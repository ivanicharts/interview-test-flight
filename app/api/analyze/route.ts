import { NextResponse } from 'next/server';
import { AnalyzeRequestSchema, MatchReportSchema } from '@/lib/ai/schemas';
import { buildAnalyzePrompt, buildFixJsonPrompt } from '@/lib/ai/prompts';
import { extractJson } from '@/lib/ai/parse';
import { hashInputs } from '@/lib/hash';
import { z } from 'zod/mini';

// Minimal in-memory cache for Phase 1 (per server instance)
const cache = new Map<string, any>();

export const runtime = 'nodejs';

async function callModel(prompt: string): Promise<string> {
  // Replace with your model call.
  // Keep API key server-side via process.env.*
  // Return the assistant text.
  throw new Error('Implement model call');
}

export async function POST(req: Request) {
  const start = Date.now();

  try {
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    // Validate input
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: z.treeifyError(parsed.error) }, { status: 400 });
    }

    const jdText = parsed.data.jdText.trim();
    const cvText = parsed.data.cvText.trim();
    const reportId = hashInputs(jdText, cvText);

    // Check cache
    if (cache.has(reportId)) {
      return NextResponse.json({ reportId, report: cache.get(reportId), cached: true });
    }

    const prompt = buildAnalyzePrompt(jdText, cvText);

    // 1st attempt
    let raw = await callModel(prompt);

    // parse + validate
    let report: any;
    try {
      report = MatchReportSchema.parse(extractJson(raw));
    } catch {
      // 2nd attempt: “fix JSON”
      raw = await callModel(buildFixJsonPrompt(raw));
      report = MatchReportSchema.parse(extractJson(raw));
    }

    // attach metadata
    const latencyMs = Date.now() - start;
    report.metadata = {
      ...(report.metadata ?? {}),
      createdAt: new Date().toISOString(),
      latencyMs,
    };

    cache.set(reportId, report);
    return NextResponse.json({ reportId, report, cached: false });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
