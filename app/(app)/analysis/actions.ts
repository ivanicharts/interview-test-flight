'use server';

import { revalidatePath } from 'next/cache';
import { analyzeJDAndCV, hashedSafetyIdentifier } from '@/lib/ai/openai-analysis';
import { getUser, getCachedAnalysis, getDocumentsByIds } from '@/lib/supabase/queries';
import { createAnalysis } from '@/lib/supabase/mutations';

type CreateAnalysisInput = {
  jdId: string;
  cvId: string;
  force?: boolean;
};

type CreateAnalysisResult =
  | { data: { id: string }; error?: never }
  | { data?: never; error: string };

export async function createAnalysisAction({
  jdId,
  cvId,
  force = false,
}: CreateAnalysisInput): Promise<CreateAnalysisResult> {
  // Validate input
  if (!jdId || !cvId) {
    return { error: 'Both Job Description and CV are required' };
  }

  // Check auth
  const { user, error: userErr } = await getUser();
  if (userErr || !user) {
    return { error: 'Unauthorized' };
  }

  const model = process.env.OPENAI_ANALYSIS_MODEL ?? 'gpt-5-mini';

  // Check cache unless forced
  if (!force) {
    const { data: cached } = await getCachedAnalysis(jdId, cvId, model);
    if (cached?.id) {
      // Return cached analysis
      revalidatePath('/analysis');
      return { data: { id: cached.id } };
    }
  }

  // Load documents
  const { data: docs, error: docsErr } = await getDocumentsByIds([jdId, cvId]);

  if (docsErr || !docs) {
    return { error: 'Failed to load documents' };
  }

  const jd = docs.find((d) => d.id === jdId);
  const cv = docs.find((d) => d.id === cvId);

  if (!jd || !cv) {
    return { error: 'JD or CV not found' };
  }

  if (jd.kind !== 'jd') {
    return { error: 'Selected document is not a Job Description' };
  }

  if (cv.kind !== 'cv') {
    return { error: 'Selected document is not a CV' };
  }

  try {
    // Call OpenAI to analyze
    const result = await analyzeJDAndCV({
      jdText: jd.content ?? '',
      cvText: cv.content ?? '',
      model,
      safetyIdentifier: hashedSafetyIdentifier(user.id),
    });

    // Store the result
    const { data: inserted, error: insertErr } = await createAnalysis({
      userId: user.id,
      jdId,
      cvId,
      model,
      result,
    });

    if (insertErr || !inserted) {
      return { error: 'Analysis completed but failed to save results' };
    }

    // Revalidate cache
    revalidatePath('/analysis');
    revalidatePath(`/analysis/${inserted.id}`);

    return { data: { id: inserted.id } };
  } catch (e: any) {
    return { error: e?.message ?? 'AI analysis failed' };
  }
}
