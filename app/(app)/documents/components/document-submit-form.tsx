'use client';

import { useState, useTransition } from 'react';

import * as config from '@/lib/config';
import { DocumentType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { createDocumentAction } from '../actions';

type Props = {
  formId?: string;
  initialDocumentType: 'cv' | 'jd';
  allowChangeType?: boolean;
  disableCta?: boolean;
  onSuccess?: (id: string, title: string) => void;
  onError?: () => void;
  onCancel?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
};

export const DocumentForm = ({
  initialDocumentType,
  allowChangeType,
  formId,
  disableCta,
  onSuccess,
  onError,
  onCancel,
  onSubmit,
}: Props) => {
  const [documentType, setDocumentType] = useState<DocumentType>(initialDocumentType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    onSubmit?.(e);

    startTransition(async () => {
      const result = await createDocumentAction({ documentType, title, content });

      if (result.error) {
        setError(result.error);
        onError?.();
      } else if (result.data) {
        onSuccess?.(result.data.id, title);
      }
    });
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {allowChangeType && (
        <Tabs value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
          <TabsList>
            <TabsTrigger value="jd" type="button">
              Job Description
            </TabsTrigger>
            <TabsTrigger value="cv" type="button">
              CV
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      <Field className="gap-2">
        <FieldLabel htmlFor="title">{documentType === 'jd' ? 'Job Position' : 'CV Title'}</FieldLabel>
        <Input
          required
          autoComplete="off"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            documentType === 'jd' ? 'e.g. Senior Frontend Engineer (Company X)' : 'e.g. John Doe CV v1'
          }
        />
      </Field>
      <Field className="gap-2">
        <FieldLabel htmlFor="content">
          {documentType === 'jd' ? 'Job Description text' : 'CV text'}
        </FieldLabel>
        <Textarea
          required
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={documentType === 'jd' ? 'Paste the job description here...' : 'Paste your CV here...'}
          className="min-h-80 max-h-110 resize-y"
          minLength={config.MIN_DOCUMENT_CONTENT_LENGTH}
          maxLength={config.MAX_DOCUMENT_CONTENT_LENGTH}
        />
        <FieldDescription className="text-xs">
          {content.length < config.MIN_DOCUMENT_CONTENT_LENGTH
            ? `${content.length}/${config.MIN_DOCUMENT_CONTENT_LENGTH} characters minimum`
            : `${content.length}/${config.MAX_DOCUMENT_CONTENT_LENGTH} characters maximum`}
        </FieldDescription>
      </Field>
      {error && <ErrorAlert message={error} />}
      {!disableCta && (
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending} loading={isPending}>
            Save
          </Button>
        </div>
      )}{' '}
    </form>
  );
};
