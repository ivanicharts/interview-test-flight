import { supabaseServer } from '@/lib/supabase/server';
import type { AnalysisResult } from '@/lib/ai/schemas';

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
    })
    .select('id')
    .single();
}

export async function createDocument({
  kind,
  title,
  content,
}: {
  kind: 'jd' | 'cv';
  title?: string | null;
  content: string;
}) {
  const supabase = await supabaseServer();
  return supabase
    .from('documents')
    .insert({
      kind,
      title: title?.trim() || null,
      content: content.trim(),
      // user_id defaults to auth.uid()
    })
    .select('id')
    .single();
}
