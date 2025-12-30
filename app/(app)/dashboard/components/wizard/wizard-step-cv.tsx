'use client';

import { DocumentForm } from '@/app/(app)/documents/components/document-submit-form-ui';
import { useSubmitDocumentForm } from '@/app/(app)/documents/components/useSubmitDocumentForm';
import { useUserDocuments } from '@/app/(app)/documents/hooks/use-user-document';
import { useEffect, useState } from 'react';

import { DocumentPicker } from '@/components/document-picker';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DocumentsLoader } from './animations/documents-loader';
import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

const DOCUMENT_TYPE = 'cv';
const FORM_ID = 'wizard-cv-form';

export function WizardStepCV() {
  const setCVData = useWizardStore((state) => state.setCVData);

  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { onSubmit, error, isPending, title, setTitle, content, setContent } = useSubmitDocumentForm({
    documentType: DOCUMENT_TYPE,
    onSuccess: (id: string, newTitle: string) => {
      setCVData(id, newTitle);
    },
  });

  const { data: cvData, isLoading } = useUserDocuments(DOCUMENT_TYPE);
  const cvs = cvData?.documents || [];

  // Auto-select first CV or switch to create mode
  useEffect(() => {
    if (!isLoading && cvs.length > 0 && !selectedId) {
      setSelectedId(cvs[0].id);
    } else if (!isLoading && cvs.length === 0) {
      setMode('create');
    }
  }, [cvs, isLoading, selectedId]);

  const handleSelectExisting = () => {
    if (!selectedId) return;
    const selected = cvs.find((cv) => cv.id === selectedId);
    if (selected) {
      setCVData(selectedId, selected.title);
    }
  };

  if (isLoading) {
    return <DocumentsLoader />;
  }

  const nextCta =
    mode === 'select' ? (
      <Button onClick={handleSelectExisting} disabled={!selectedId} className="w-full">
        Continue with Selected CV
      </Button>
    ) : (
      <Button type="submit" form={FORM_ID} loading={isPending} className="w-full">
        Create & Continue
      </Button>
    );

  return (
    <WizardStepContainer footer={nextCta}>
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'select' | 'create')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Select Existing</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        {error && <ErrorAlert message={error} />}

        <TabsContent value="select" className="space-y-4 mt-6">
          {cvs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No CVs found. Switch to &quot;Create New&quot; tab.
              </p>
            </div>
          ) : (
            <DocumentPicker title="Your CVs" docs={cvs} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4 mt-6">
          <DocumentForm
            formId={FORM_ID}
            documentType={DOCUMENT_TYPE}
            onSubmit={onSubmit}
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
          />
        </TabsContent>
      </Tabs>
    </WizardStepContainer>
  );
}
