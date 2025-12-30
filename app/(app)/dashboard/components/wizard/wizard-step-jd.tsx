'use client';

import { useState, useEffect, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { getDocumentsAction, createDocumentAction } from '@/app/(app)/documents/actions';
import { useWizardStore } from './store/wizard-store';

interface Document {
  id: string;
  title: string;
  content: string;
  kind: 'cv' | 'jd';
}

export function WizardStepJD() {
  const setJDData = useWizardStore((state) => state.setJDData);
  const setError = useWizardStore((state) => state.setError);

  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [jds, setJds] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJds() {
      try {
        const result = await getDocumentsAction('jd');
        const jdDocs = result.data || [];
        setJds(jdDocs);
        if (jdDocs.length > 0) {
          setSelectedId(jdDocs[0].id);
        } else {
          setMode('create');
        }
      } catch (error) {
        console.error('Failed to load JDs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadJds();
  }, []);

  const handleSelectExisting = () => {
    if (!selectedId) return;
    const selected = jds.find((jd) => jd.id === selectedId);
    if (selected) {
      setJDData(selectedId, selected.title);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createDocumentAction({
        documentType: 'jd',
        title: title.trim(),
        content: content.trim(),
      });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setJDData(result.data.id, title.trim());
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading your job descriptions...</div>
      </div>
    );
  }

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as 'select' | 'create')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="select">Select Existing</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
      </TabsList>

      <TabsContent value="select" className="space-y-4 mt-6">
        {jds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No job descriptions found. Switch to &quot;Create New&quot; tab.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {jds.map((jd) => (
                <div
                  key={jd.id}
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition hover:border-primary/50',
                    selectedId === jd.id && 'border-primary bg-primary/5'
                  )}
                  onClick={() => setSelectedId(jd.id)}
                >
                  <div className="font-medium">{jd.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {jd.content.substring(0, 150)}...
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSelectExisting} disabled={!selectedId} className="w-full">
              Continue with Selected JD
            </Button>
          </>
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

          <Button
            type="submit"
            loading={isPending}
            disabled={content.length < 200}
            className="w-full"
          >
            Create & Continue
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
