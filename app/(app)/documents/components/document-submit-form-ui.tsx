'use client';

import * as config from '@/lib/config';
import { DocumentType } from '@/lib/types';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  documentType: DocumentType;
  title: string;
  content: string;
  formId?: string;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
};

export const DocumentForm = ({
  documentType,
  title,
  content,
  children,
  formId,
  onSubmit,
  onTitleChange,
  onContentChange,
}: Props & React.PropsWithChildren) => {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <Field className="gap-2">
        <FieldLabel htmlFor="title">{documentType === 'jd' ? 'Job Position' : 'CV Title'}</FieldLabel>
        <Input
          required
          autoComplete="off"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
          onChange={(e) => onContentChange(e.target.value)}
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

      {/* Submit button or other children */}
      {children}
    </form>
  );
};
