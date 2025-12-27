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
  return supabase.from('documents').select('id, kind, content').in('id', ids);
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
