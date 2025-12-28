'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/queries';
import {
  getAnalysisById,
  getDocumentsByIds,
  getActiveInterviewForAnalysis,
  getInterviewSessionById,
  getInterviewAnswersBySessionId,
} from '@/lib/supabase/queries';
import { createInterviewSession, upsertInterviewAnswer, updateInterviewSessionStatus, saveAnswerEvaluation } from '@/lib/supabase/mutations';
import { generateInterviewPlan } from '@/lib/ai/openai-interview';
import { evaluateInterviewAnswer } from '@/lib/ai/openai-evaluation';
import { hashedSafetyIdentifier } from '@/lib/ai/openai-analysis';
import { AnalysisResultSchema, SubmitAnswerSchema, QuestionRubricSchema } from '@/lib/ai/schemas';
import { supabaseServer } from '@/lib/supabase/server';

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

export async function submitAnswerAction({
  sessionId,
  questionId,
  answerText,
  answerMode = 'text',
}: {
  sessionId: string;
  questionId: string;
  answerText: string;
  answerMode?: 'text' | 'audio';
}) {
  const { user } = await getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const validationResult = SubmitAnswerSchema.safeParse({
    sessionId,
    questionId,
    answerText,
    answerMode,
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  try {
    const { data: answer, error: answerError } = await upsertInterviewAnswer({
      sessionId,
      questionId,
      answerText,
      answerMode,
    });

    if (answerError || !answer) {
      return { error: answerError?.message || 'Failed to save answer' };
    }

    // Check if session is 'pending' - if so, transition to 'in_progress'
    const { data: session, error: sessionError } = await getInterviewSessionById(sessionId);

    if (!sessionError && session && session.status === 'pending') {
      await updateInterviewSessionStatus({
        sessionId,
        status: 'in_progress',
      });
    }

    // Trigger evaluation asynchronously
    // Note: We don't await this - evaluation happens in background
    // UI will show loading state and update via revalidation
    evaluateAnswerAction({
      answerId: answer.id,
      questionId,
      answerText,
    }).catch((err) => {
      console.error('Background evaluation failed:', err);
      // Silent failure - evaluation can be manually retried if needed
    });

    const { data: allAnswers } = await getInterviewAnswersBySessionId(sessionId);
    const answerCount = allAnswers?.length || 0;

    revalidatePath(`/interviews/${sessionId}`);

    return {
      data: {
        answerId: answer.id,
        answerCount,
      },
    };
  } catch (error) {
    console.error('Submit answer error:', error);
    return { error: 'Failed to save answer. Please try again.' };
  }
}

export async function evaluateAnswerAction({
  answerId,
  questionId,
  answerText,
}: {
  answerId: string;
  questionId: string;
  answerText: string;
}) {
  const { user } = await getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    // Fetch question with rubric
    const supabase = await supabaseServer();
    const { data: question, error: questionError } = await supabase
      .from('interview_questions')
      .select('question_text, category, context, rubric, session_id')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return { error: 'Question not found' };
    }

    // Verify user owns this session
    const { data: session } = await supabase
      .from('interview_sessions')
      .select('user_id')
      .eq('id', question.session_id)
      .single();

    if (!session || session.user_id !== user.id) {
      return { error: 'Unauthorized' };
    }

    // Validate rubric structure
    const rubricResult = QuestionRubricSchema.safeParse(question.rubric);
    if (!rubricResult.success) {
      return { error: 'Invalid rubric data' };
    }

    // Call AI evaluation
    const evaluation = await evaluateInterviewAnswer({
      answerText,
      questionText: question.question_text,
      rubric: rubricResult.data,
      questionCategory: question.category,
      questionContext: question.context,
      model: DEFAULT_MODEL,
      safetyIdentifier: hashedSafetyIdentifier(user.id),
    });

    // Save evaluation to database
    const { data: saved, error: saveError } = await saveAnswerEvaluation({
      answerId,
      evaluation,
    });

    if (saveError || !saved) {
      return { error: saveError?.message || 'Failed to save evaluation' };
    }

    // Note: Don't call revalidatePath here since this runs async in background
    // The parent submitAnswerAction already revalidates the path

    return {
      data: {
        evaluationScore: evaluation.score,
        evaluationTier: evaluation.tier,
      },
    };
  } catch (error) {
    console.error('Evaluation error:', error);
    return { error: 'Failed to evaluate answer. Please try again.' };
  }
}
