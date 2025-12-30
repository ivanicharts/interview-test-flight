'use client';

import { useUserDocuments } from '@/app/(app)/documents/hooks/use-user-document';
import { useEffect, useState, useTransition } from 'react';

import { DocumentPicker } from '@/components/document-picker';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

export function WizardStepJD() {
  const setJDData = useWizardStore((state) => state.setJDData);
  const setError = useWizardStore((state) => state.setError);
  const goBack = useWizardStore((state) => state.goBack);

  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { data: jdData, isLoading } = useUserDocuments('jd');

  const jds = jdData?.documents || [];

  // Auto-select first JD or switch to create mode
  useEffect(() => {
    if (!isLoading && jds.length > 0 && !selectedId) {
      setSelectedId(jds[0].id);
    } else if (!isLoading && jds.length === 0) {
      setMode('create');
    }
  }, [jds, isLoading, selectedId]);

  const handleSelectExisting = () => {
    if (!selectedId) return;
    const selected = jds.find((jd) => jd.id === selectedId);
    if (selected) {
      setJDData(selectedId, selected.title);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();

    // startTransition(async () => {
    //   const result = await createDocumentAction({
    //     documentType: 'jd',
    //     title: title.trim(),
    //     content: content.trim(),
    //   });

    //   if (result.error) {
    //     setError(result.error);
    //   } else if (result.data) {
    //     setJDData(result.data.id, title.trim());
    //   }
    // });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading your job descriptions...</div>
      </div>
    );
  }

  const nextCta =
    mode === 'select' ? (
      <Button onClick={handleSelectExisting} disabled={!selectedId}>
        Continue with Selected JD
      </Button>
    ) : (
      <Button type="submit" loading={isPending} disabled={content.length < 200}>
        Create & Continue
      </Button>
    );

  return (
    <WizardStepContainer
      footer={
        <>
          <Button variant="outline" onClick={goBack} disabled={isLoading}>
            Back
          </Button>
          {nextCta}
        </>
      }
    >
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'select' | 'create')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Select Existing</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-4 mt-4">
          {jds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No job descriptions found. Switch to &quot;Create New&quot; tab.
              </p>
            </div>
          ) : (
            <DocumentPicker docs={jds} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4 mt-6">
          <form onSubmit={handleCreateNew} className="space-y-4">
            <Field>
              <FieldLabel>Job Description Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Developer at Acme Inc"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Job Description Content</FieldLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-60"
                minLength={200}
                required
              />
              <FieldDescription>{content.length} / 200 characters minimum</FieldDescription>
            </Field>
          </form>
        </TabsContent>
      </Tabs>
      {/* <div className="flex flex-row gap-2 absolute bottom-0 left-0 right-0 p-4"> */}
    </WizardStepContainer>
  );
}
