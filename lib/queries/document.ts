'use server';

import { getDocuments, getUser } from '@/lib/supabase/queries';

import type { DocumentType } from '../types';

export async function getUserDocuments(kind?: DocumentType) {
  // Check auth
  const { user, error: userErr } = await getUser();
  if (userErr || !user) {
    return { documents: [], error: 'Unauthorized' };
  }

  const result = await getDocuments({ maxContentLength: 200 });

  if (result.error) {
    return { documents: [], error: result.error.message };
  }

  const documents = result.data || [];
  const filtered = kind ? documents.filter((d) => d.kind === kind) : documents;

  return { documents: filtered, error: null };
}
