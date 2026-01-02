import { NextResponse } from 'next/server';
import { z } from 'zod';
import { streamAnalysis } from '@/lib/ai/openai-streaming-analysis';
import type { SSEEvent } from '@/lib/ai/schemas';

import { getUser, getCachedAnalysis, getDocumentsByIds } from '@/lib/supabase/queries';
import { createAnalysis } from '@/lib/supabase/mutations';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  jdId: z.string().uuid(),
  cvId: z.string().uuid(),
  force: z.boolean().optional(), // bypass cache
});

/**
 * SSE endpoint for streaming analysis generation.
 * Emits progress updates and partial results as OpenAI streams the response.
 */
export async function POST(req: Request) {
  // Validate authentication
  const { user, error: userErr } = await getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { jdId, cvId, force } = parsed.data;
  const model = process.env.OPENAI_ANALYSIS_MODEL ?? 'gpt-5-mini';

  // Check cache first (if not forcing)
  if (!force) {
    const { data: cached } = await getCachedAnalysis(jdId, cvId, model);
    if (cached?.report) {
      // Return cached result as instant SSE stream
      const stream = createSSEStream(async (emit) => {
        emit({
          type: 'started',
          data: { model },
        });
        emit({
          type: 'complete',
          data: { analysisId: cached.id, result: cached.report },
        });
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }
  }

  // Load documents (RLS enforces user ownership)
  const { data: docs, error: docsErr } = await getDocumentsByIds([jdId, cvId]);

  if (docsErr) {
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }

  const jd = docs?.find((d) => d.id === jdId);
  const cv = docs?.find((d) => d.id === cvId);

  if (!jd || !cv) {
    return NextResponse.json({ error: 'JD or CV not found' }, { status: 404 });
  }
  if (jd.kind !== 'jd') {
    return NextResponse.json({ error: 'jdId is not a JD document' }, { status: 400 });
  }
  if (cv.kind !== 'cv') {
    return NextResponse.json({ error: 'cvId is not a CV document' }, { status: 400 });
  }

  // Create SSE stream for real-time updates
  const stream = createSSEStream(async (emit) => {
    try {
      // Emit started event (no analysisId yet)
      emit({
        type: 'started',
        data: { model },
      });

      // Stream analysis from OpenAI with progress callbacks
      const result = await streamAnalysis({
        jdText: jd.content ?? '',
        cvText: cv.content ?? '',
        model,

        // Progress callback
        onProgress: (percent, stage) => {
          emit({
            type: 'progress',
            data: { percent, stage },
          });
        },

        // Section callback (partial results)
        onSection: (section, content) => {
          emit({
            type: 'section',
            data: { section: section as any, content },
          });
        },
      });

      // Create analysis record (only once, at the end)
      const { data: inserted, error: insertErr } = await createAnalysis({
        userId: user.id,
        jdId,
        cvId,
        model,
        result,
      });

      if (insertErr || !inserted) {
        throw new Error('Failed to save analysis');
      }

      // Emit completion event
      emit({
        type: 'complete',
        data: { analysisId: inserted.id, result },
      });
    } catch (error: any) {
      console.error('Analysis streaming error:', error);

      // Emit error event (no DB cleanup needed)
      const isRateLimit = error?.message?.includes('429') || error?.message?.includes('rate');
      emit({
        type: 'error',
        data: {
          error: error?.message || 'Analysis failed',
          retryable: true,
          retryAfter: isRateLimit ? 60 : undefined,
        },
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

/**
 * Helper to create a ReadableStream for SSE events.
 * Encodes events in SSE format: `data: <json>\n\n`
 */
function createSSEStream(handler: (emit: (event: SSEEvent) => void) => Promise<void>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Emit function encodes events in SSE format
      const emit = (event: SSEEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      try {
        // Run the handler (which will call emit)
        await handler(emit);
      } catch (error) {
        console.error('SSE stream handler error:', error);
      } finally {
        // Close the stream
        controller.close();
      }
    },
  });
}
