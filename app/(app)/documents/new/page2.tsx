'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { clampDocumentType } from '@/lib/utils';

import { PageSection } from '@/components/ui/page-section';

import { DocumentForm } from '../components/document-submit-form';

export default function NewDocumentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const onDocumentSubmitSuccess = (id: string) => {
    router.push(`/documents/${id}`);
  };

  return (
    <PageSection title="New document" description="Paste the text for your Job Description or CV.">
      <DocumentForm
        allowChangeType
        onSuccess={onDocumentSubmitSuccess}
        onCancel={router.back}
        initialDocumentType={clampDocumentType(sp.get('kind'))}
      />
    </PageSection>
  );
}
