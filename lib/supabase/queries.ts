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

export const getUser = async () => {
  const supabase = await supabaseServer();
  const res = await supabase.auth.getUser();
  return {
    user: res?.data?.user,
    ...res,
  };
};
