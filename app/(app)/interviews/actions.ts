'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/queries';
import { getAnalysisById, getDocumentsByIds, getActiveInterviewForAnalysis } from '@/lib/supabase/queries';
import { createInterviewSession } from '@/lib/supabase/mutations';
import { generateInterviewPlan } from '@/lib/ai/openai-interview';
import { hashedSafetyIdentifier } from '@/lib/ai/openai-analysis';
import { AnalysisResultSchema } from '@/lib/ai/schemas';

const DEFAULT_MODEL = process.env.OPENAI_ANALYSIS_MODEL || 'gpt-5-mini';

export async function createInterviewAction({
  analysisId,
  mode = 'text',
}: {
  analysisId: string;
  mode?: 'text' | 'audio';
}) {
  // Auth check
  const { user } = await getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Check for existing active session (reuse to avoid duplicate AI calls)
  const { data: existingSession } = await getActiveInterviewForAnalysis(analysisId);
  if (existingSession) {
    return {
      data: {
        id: existingSession.id,
        questionCount: existingSession.plan?.questions?.length ?? 0,
        reused: true,
      },
    };
  }

  // Load analysis
  const { data: analysis, error: analysisError } = await getAnalysisById(analysisId);
  if (analysisError || !analysis) {
    return { error: 'Analysis not found' };
  }

  // Validate and parse analysis report
  const parseResult = AnalysisResultSchema.safeParse(analysis.report);
  if (!parseResult.success) {
    return { error: 'Invalid analysis data' };
  }

  const analysisResult = parseResult.data;

  // Load linked JD and CV documents
  const { data: documents, error: docsError } = await getDocumentsByIds([
    analysis.jd_document_id,
    analysis.cv_document_id,
  ]);

  if (docsError || !documents || documents.length !== 2) {
    return { error: 'Failed to load documents' };
  }

  const jdDoc = documents.find((d) => d.id === analysis.jd_document_id);
  const cvDoc = documents.find((d) => d.id === analysis.cv_document_id);

  if (!jdDoc || !cvDoc) {
    return { error: 'Missing JD or CV document' };
  }

  // Extract role title from JD or use fallback
  const roleTitle = jdDoc.title || 'Position';
  //  jdDoc.content?.split('\n')?.[0]?.trim().slice(0, 200) || 'Position';

  try {
    // Generate interview plan using AI
    const plan = await generateInterviewPlan({
      jdText: jdDoc.content || '',
      cvText: cvDoc.content || '',
      analysisResult,
      roleTitle,
      model: DEFAULT_MODEL,
      safetyIdentifier: hashedSafetyIdentifier(user.id),
    });

    // Store session
    const { data: session, error: sessionError } = await createInterviewSession({
      userId: user.id,
      analysisId,
      mode,
      plan,
    });

    if (sessionError || !session) {
      return { error: sessionError?.message || 'Failed to create interview session' };
    }

    // Revalidate relevant paths
    revalidatePath('/interviews');
    revalidatePath(`/interviews/${session.id}`);
    revalidatePath(`/analysis/${analysisId}`);

    return {
      data: {
        id: session.id,
        questionCount: plan.questions.length,
      },
    };
  } catch (error) {
    console.error('Interview generation error:', error);
    return { error: 'Failed to generate interview plan. Please try again.' };
  }
}
