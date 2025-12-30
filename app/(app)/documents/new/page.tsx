'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { DocumentType } from '@/lib/types';
import { clampDocumentType } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { PageSection } from '@/components/ui/page-section';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DocumentForm } from '../components/document-submit-form-ui';
import { useSubmitDocumentForm } from '../components/useSubmitDocumentForm';

export default function NewDocumentPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [documentType, setDocumentType] = useState<DocumentType>(clampDocumentType(sp.get('kind')));

  const { onSubmit, error, isPending, title, setTitle, content, setContent } = useSubmitDocumentForm({
    documentType,
    onSuccess: (id: string) => {
      router.push(`/documents/${id}`);
    },
  });

  return (
    <PageSection title="New document" description="Paste the text for your Job Description or CV.">
      <Tabs className="mb-4" value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
        <TabsList>
          <TabsTrigger value="jd" type="button">
            Job Description
          </TabsTrigger>
          <TabsTrigger value="cv" type="button">
            CV
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <DocumentForm
        onSubmit={onSubmit}
        documentType={documentType}
        title={title}
        onTitleChange={setTitle}
        content={content}
        onContentChange={setContent}
      >
        {error && <ErrorAlert message={error} />}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} loading={isPending}>
            Save
          </Button>
        </div>
      </DocumentForm>
    </PageSection>
  );
}
