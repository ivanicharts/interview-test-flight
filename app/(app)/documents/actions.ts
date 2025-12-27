'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/queries';
import { createDocument } from '@/lib/supabase/mutations';
import { DocumentType } from '@/lib/types';

type CreateDocumentInput = {
  documentType: DocumentType;
  title: string;
  content: string;
};

type CreateDocumentResult = { data: { id: string }; error?: never } | { data?: never; error: string };

export async function createDocumentAction({
  documentType,
  title,
  content,
}: CreateDocumentInput): Promise<CreateDocumentResult> {
  // Validate input
  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  if (!content || content.trim().length < 50) {
    return { error: 'Content too short (min 50 chars)' };
  }

  // Check auth
  const { user, error: userErr } = await getUser();
  if (userErr || !user) {
    return { error: 'Unauthorized' };
  }

  // Create document using centralized mutation
  const { data, error } = await createDocument({
    documentType,
    title,
    content,
  });

  if (error) {
    return { error: error.message };
  }

  // Revalidate cache
  revalidatePath('/documents');
  revalidatePath(`/documents/${data.id}`);

  return { data: { id: data.id } };
}
