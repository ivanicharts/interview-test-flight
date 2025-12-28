import { supabaseServer } from '@/lib/supabase/server';

export async function getAnalyses() {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .select(
      `
      id,
      match_score,
      created_at,
      model,
      jd_document:jd_document_id(title),
      cv_document:cv_document_id(title)
    `,
    )
    .order('created_at', { ascending: false })
    .limit(100);
}

export async function getAnalysisById(id: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .select('id, created_at, model, report, jd_document_id, cv_document_id')
    .eq('id', id)
    .single();
}

export async function getCachedAnalysis(jdId: string, cvId: string, model: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('analyses')
    .select('id, report, created_at, model')
    .eq('jd_document_id', jdId)
    .eq('cv_document_id', cvId)
    .eq('model', model)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function getDocumentsByIds(ids: string[]) {
  const supabase = await supabaseServer();
  return supabase.from('documents').select('id, title, kind, content').in('id', ids);
}

export async function getDocuments(options?: { maxContentLength?: number }) {
  const supabase = await supabaseServer();
  const result = await supabase
    .from('documents')
    .select('id, kind, title, content, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  // If maxContentLength is specified, truncate content
  if (options?.maxContentLength && result.data) {
    return {
      ...result,
      data: result.data.map((doc) => ({
        ...doc,
        content: doc.content ? doc.content.substring(0, options.maxContentLength) : doc.content,
      })),
    };
  }

  return result;
}

export async function getDocumentById(id: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('documents')
    .select('id, kind, title, content, created_at, updated_at')
    .eq('id', id)
    .single();
}

export const getUser = async () => {
  const supabase = await supabaseServer();
  const res = await supabase.auth.getUser();
  return {
    user: res?.data?.user,
    ...res,
  };
};

// ==================== Interview Queries ====================

export async function getInterviewSessions() {
  const supabase = await supabaseServer();
  return supabase
    .from('interview_sessions')
    .select(
      `
      id,
      status,
      mode,
      created_at,
      started_at,
      completed_at,
      analysis:analysis_id(
        id,
        jd_document:jd_document_id(title),
        cv_document:cv_document_id(title)
      )
    `,
    )
    .order('created_at', { ascending: false })
    .limit(100);
}

export async function getInterviewSessionById(id: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('interview_sessions')
    .select('id, status, mode, plan, created_at, started_at, completed_at, analysis_id')
    .eq('id', id)
    .single();
}

export async function getActiveInterviewForAnalysis(analysisId: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('interview_sessions')
    .select('id, status, plan, created_at')
    .eq('analysis_id', analysisId)
    .in('status', ['pending', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function getInterviewAnswersBySessionId(sessionId: string) {
  const supabase = await supabaseServer();
  return supabase
    .from('interview_answers')
    .select('id, question_id, answer_text, answer_audio_url, answer_mode, created_at, updated_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
}

export async function getInterviewQuestionsWithAnswers(sessionId: string) {
  const supabase = await supabaseServer();

  const { data: questions, error: questionsError } = await supabase
    .from('interview_questions')
    .select('id, order_index, category, question_text, context, rubric, target_gap, target_strength')
    .eq('session_id', sessionId)
    .order('order_index', { ascending: true });

  if (questionsError || !questions) {
    return { data: null, error: questionsError };
  }

  const { data: answers, error: answersError } = await supabase
    .from('interview_answers')
    .select('question_id, answer_text, answer_audio_url, answer_mode, created_at, updated_at, evaluation_score, evaluation_result, evaluated_at')
    .eq('session_id', sessionId);

  if (answersError) {
    return { data: null, error: answersError };
  }

  const answerMap = new Map((answers || []).map((answer) => [answer.question_id, answer]));

  const questionsWithAnswers = questions.map((question) => ({
    ...question,
    answer: answerMap.get(question.id) || null,
  }));

  return { data: questionsWithAnswers, error: null };
}
