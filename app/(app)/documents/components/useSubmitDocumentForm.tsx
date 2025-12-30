'use client';

import { useState, useTransition } from 'react';

import { DocumentType } from '@/lib/types';

import { createDocumentAction } from '../actions';

type Props = {
  onSuccess?: (id: string, title: string) => void;
  documentType: DocumentType;
};

export const useSubmitDocumentForm = ({ documentType, onSuccess }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createDocumentAction({ documentType, title, content });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        onSuccess?.(result.data.id, title);
      }
    });
  }

  return {
    title,
    setTitle,
    content,
    setContent,
    error,
    isPending,
    onSubmit,
  };
};
