import { QueryData } from '@supabase/supabase-js';

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

export type Analysis = QueryData<ReturnType<typeof getAnalyses>>[number];

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

export async function getInterviewSessions(limit: number = 100) {
  const supabase = await supabaseServer();
  return supabase
    .from('interview_sessions')
    .select(
      `
      id,
      status,
      mode,
      plan,
      created_at,
      started_at,
      completed_at,
      analysis:analysis_id(
        id,
        match_score,
        jd_document:jd_document_id(title),
        cv_document:cv_document_id(title)
      )
    `,
    )
    .order('created_at', { ascending: false })
    .limit(limit);
}

export type InterviewSession = QueryData<ReturnType<typeof getInterviewSessions>>[number];

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
    .select(
      'question_id, answer_text, answer_audio_url, answer_mode, created_at, updated_at, evaluation_score, evaluation_result, evaluated_at',
    )
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

// ==================== Dashboard Queries ====================

export async function getDashboardStats() {
  const supabase = await supabaseServer();

  const [docsResult, jdCount, cvCount, analysesResult, interviewsResult, inProgressCount] = await Promise.all(
    [
      supabase.from('documents').select('id', { count: 'exact', head: true }),
      supabase.from('documents').select('id', { count: 'exact', head: true }).eq('kind', 'jd'),
      supabase.from('documents').select('id', { count: 'exact', head: true }).eq('kind', 'cv'),
      supabase.from('analyses').select('match_score'),
      supabase.from('interview_sessions').select('id', { count: 'exact', head: true }),
      supabase
        .from('interview_sessions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress']),
    ],
  );

  const analyses = analysesResult.data ?? [];
  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + (a.match_score ?? 0), 0) / analyses.length)
      : null;

  return {
    data: {
      documents: {
        total: docsResult.count ?? 0,
        jdCount: jdCount.count ?? 0,
        cvCount: cvCount.count ?? 0,
      },
      analyses: {
        total: analyses.length,
        avgScore,
      },
      interviews: {
        total: interviewsResult.count ?? 0,
        inProgress: inProgressCount.count ?? 0,
      },
    },
    error: null,
  };
}

export async function getActiveInterviewSessions() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('interview_sessions')
    .select(
      `
      id,
      status,
      mode,
      plan,
      created_at,
      started_at,
      analysis:analysis_id(
        id,
        match_score,
        jd_document:jd_document_id(title),
        cv_document:cv_document_id(title)
      )
    `,
    )
    .in('status', ['pending', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(3);

  if (error || !data) {
    return { data: [], error };
  }

  // For each session, count answered questions
  const sessionsWithProgress = await Promise.all(
    data.map(async (session) => {
      const { count: totalQuestions } = await supabase
        .from('interview_questions')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id);

      const { count: answeredQuestions } = await supabase
        .from('interview_answers')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)
        .not('answer_text', 'is', null);

      return {
        ...session,
        progress: {
          total: totalQuestions ?? 0,
          answered: answeredQuestions ?? 0,
        },
      };
    }),
  );

  return { data: sessionsWithProgress, error: null };
}

export type InterviewSessionWithProgress = QueryData<ReturnType<typeof getActiveInterviewSessions>>[number];

export async function getRecentAnalyses(limit: number = 3) {
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
    .limit(limit);
}
