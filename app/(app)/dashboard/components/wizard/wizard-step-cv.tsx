'use client';

import { DocumentForm } from '@/app/(app)/documents/components/document-submit-form-ui';
// import { DocumentForm } from '@/app/(app)/documents/components/document-submit-form';
import { useSubmitDocumentForm } from '@/app/(app)/documents/components/useSubmitDocumentForm';
import { useUserDocuments } from '@/app/(app)/documents/hooks/use-user-document';
import { useEffect, useState, useTransition } from 'react';

import { DocumentPicker } from '@/components/document-picker';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

const DOCUMENT_TYPE = 'cv';

export function WizardStepCV() {
  const setCVData = useWizardStore((state) => state.setCVData);
  const setError = useWizardStore((state) => state.setError);
  // const [isPending, setIsPending] = useState(false);

  const [mode, setMode] = useState<'select' | 'create'>('select');
  // const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [isPending, startTransition] = useTransition();

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

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();

    // startTransition(async () => {
    //   const result = await createDocumentAction({
    //     documentType: 'cv',
    //     title: title.trim(),
    //     content: content.trim(),
    //   });

    //   if (result.error) {
    //     setError(result.error);
    //   } else if (result.data) {
    //     setCVData(result.data.id, title.trim());
    //   }
    // });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading your CVs...</div>
      </div>
    );
  }

  const nextCta =
    mode === 'select' ? (
      <Button onClick={handleSelectExisting} disabled={!selectedId} className="w-full">
        Continue with Selected CV
      </Button>
    ) : (
      <Button type="submit" form="cv-form" loading={isPending} className="w-full">
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
            formId="cv-form"
            documentType={DOCUMENT_TYPE}
            onSubmit={onSubmit}
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
          />
          {/* <DocumentForm
            disableCta
            formId="cv-form"
            initialDocumentType="cv"
            onSubmit={() => setIsPending(true)}
            onError={() => {
              setIsPending(false);
            }}
            onSuccess={(id, title) => {
              setCVData(id, title);
            }}
          /> */}
          {/* <form onSubmit={handleCreateNew} className="space-y-4">
            <Field>
              <FieldLabel>CV Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Software Developer CV"
                required
              />
            </Field>

            <Field>
              <FieldLabel>CV Content</FieldLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your CV here..."
                className="min-h-60"
                minLength={200}
                required
              />
              <FieldDescription>{content.length} / 200 characters minimum</FieldDescription>
            </Field>
          </form> */}
        </TabsContent>
      </Tabs>
    </WizardStepContainer>
  );
}
