import { supabaseServer } from '@/lib/supabase/server';
import type { AnalysisResult, InterviewPlan, AnswerEvaluation } from '@/lib/ai/schemas';
import { DocumentType } from '@/lib/types';

export async function createAnalysis({
  userId,
  jdId,
  cvId,
  model,
  result,
}: {
  userId: string;
  jdId: string;
  cvId: string;
  model: string;
  result: AnalysisResult;
}) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .insert({
      user_id: userId,
      jd_document_id: jdId,
      cv_document_id: cvId,
      model,
      match_score: result.overallScore,
      report: result, // jsonb
      status: 'completed',
    })
    .select('id')
    .single();
}

// ==================== Analysis Streaming Mutations ====================

export async function createAnalysisPlaceholder({
  userId,
  jdId,
  cvId,
  model,
}: {
  userId: string;
  jdId: string;
  cvId: string;
  model: string;
}) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .insert({
      user_id: userId,
      jd_document_id: jdId,
      cv_document_id: cvId,
      model,
      status: 'processing',
      match_score: 0, // Placeholder
      report: {}, // Empty JSONB
    })
    .select('id')
    .single();
}

export async function updateAnalysisResult(analysisId: string, result: AnalysisResult) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .update({
      status: 'completed',
      match_score: result.overallScore,
      report: result,
    })
    .eq('id', analysisId)
    .select('id')
    .single();
}

export async function markAnalysisFailed(analysisId: string, error: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .update({
      status: 'failed',
      report: { error, meta: { failedAt: new Date().toISOString() } },
    })
    .eq('id', analysisId)
    .select('id')
    .single();
}

export async function createDocument({
  documentType,
  title,
  content,
}: {
  documentType: DocumentType;
  title: string;
  content: string;
}) {
  const supabase = await supabaseServer();
  return supabase
    .from('documents')
    .insert({
      kind: documentType,
      title: title.trim(),
      content: content.trim(),
      // user_id defaults to auth.uid()
    })
    .select('id')
    .single();
}

export async function deleteDocument({ id }: { id: string }) {
  const supabase = await supabaseServer();
  return supabase.from('documents').delete().eq('id', id);
}

// ==================== Interview Mutations ====================

export async function createInterviewSession({
  userId,
  analysisId,
  mode,
  plan,
}: {
  userId: string;
  analysisId: string;
  mode: string;
  plan: InterviewPlan;
}) {
  const supabase = await supabaseServer();

  // Insert session first
  const sessionResult = await supabase
    .from('interview_sessions')
    .insert({
      user_id: userId,
      analysis_id: analysisId,
      status: 'pending',
      mode,
      plan, // Store full plan as JSONB
    })
    .select('id')
    .single();

  if (sessionResult.error) {
    return sessionResult;
  }

  const sessionId = sessionResult.data.id;

  // Denormalize questions into interview_questions table
  const questions = plan.questions.map((q, index) => ({
    session_id: sessionId,
    order_index: index,
    category: q.category,
    question_text: q.questionText,
    context: q.context,
    rubric: q.rubric,
    target_gap: q.targetGap,
    target_strength: q.targetStrength,
  }));

  const questionsResult = await supabase.from('interview_questions').insert(questions);

  if (questionsResult.error) {
    // Rollback session if questions insert fails
    await supabase.from('interview_sessions').delete().eq('id', sessionId);
    return questionsResult;
  }

  return sessionResult;
}

export async function updateInterviewSessionStatus({
  sessionId,
  status,
}: {
  sessionId: string;
  status: 'pending' | 'in_progress' | 'completed';
}) {
  const supabase = await supabaseServer();

  const updates: Record<string, unknown> = { status };

  if (status === 'in_progress') {
    updates.started_at = new Date().toISOString();
  } else if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  return supabase.from('interview_sessions').update(updates).eq('id', sessionId).select('id').single();
}

export async function upsertInterviewAnswer({
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
  const supabase = await supabaseServer();

  return supabase
    .from('interview_answers')
    .upsert(
      {
        session_id: sessionId,
        question_id: questionId,
        answer_text: answerText,
        answer_mode: answerMode,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id,question_id' },
    )
    .select('id')
    .single();
}

export async function saveAnswerEvaluation({
  answerId,
  evaluation,
}: {
  answerId: string;
  evaluation: AnswerEvaluation;
}) {
  const supabase = await supabaseServer();

  return supabase
    .from('interview_answers')
    .update({
      evaluation_score: evaluation.score,
      evaluation_result: evaluation,
      evaluated_at: new Date().toISOString(),
    })
    .eq('id', answerId)
    .select('id, evaluation_score')
    .single();
}
