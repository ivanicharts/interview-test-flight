import { supabaseServer } from '@/lib/supabase/server';
import type { AnalysisResult } from '@/lib/ai/schemas';
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
    })
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
