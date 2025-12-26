import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeJDAndCV, hashedSafetyIdentifier } from '@/lib/ai/openai-analysis';

import { getUser, getCachedAnalysis, getDocumentsByIds } from '@/lib/supabase/queries';
import { createAnalysis } from '@/lib/supabase/mutations';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  jdId: z.uuid(),
  cvId: z.uuid(),
  // optional knobs
  // model: z.string().optional(),
  force: z.boolean().optional(), // bypass cache
});

export async function POST(req: Request) {
  const { user, error: userErr } = await getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { jdId, cvId, force } = parsed.data;

  const model = process.env.OPENAI_ANALYSIS_MODEL ?? 'gpt-5-mini';

  // Optional: simple cache by (jdId, cvId, model)
  if (!force) {
    const { data: cached } = await getCachedAnalysis(jdId, cvId, model);
    if (cached?.report) {
      return NextResponse.json({ analysisId: cached.id, result: cached.report });
    }
  }

  // Load documents (RLS should ensure user can only see their rows)
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

  try {
    const result = await analyzeJDAndCV({
      jdText: jd.content ?? '',
      cvText: cv.content ?? '',
      model,
      safetyIdentifier: hashedSafetyIdentifier(user.id),
    });

    const { data: inserted, error: insertErr } = await createAnalysis({
      userId: user.id,
      jdId,
      cvId,
      model,
      result,
    });

    if (insertErr || !inserted) {
      return NextResponse.json({ error: insertErr || 'Analysis computed but failed to store result' }, { status: 500 });
    }

    return NextResponse.json({ analysisId: inserted.id, result });
  } catch (e: any) {
    // Avoid leaking internals; log server-side if you want.
    return NextResponse.json({ error: 'AI analysis failed', message: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
