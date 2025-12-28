'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { PageSection } from '@/components/ui/page-section';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentType } from '@/lib/types';

import { createDocumentAction } from '../actions';

function clampKind(v: string | null): DocumentType {
  return v === 'cv' ? 'cv' : 'jd';
}

export default function NewDocumentPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [documentType, setDocumentType] = React.useState<DocumentType>(() => clampKind(sp.get('kind')));
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const charCount = content.length;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createDocumentAction({ documentType, title, content });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        router.push(`/documents/${result.data.id}`);
      }
    });
  }

  return (
    <PageSection title="New document" description="Paste the text for your Job Description or CV.">
      <form onSubmit={onSubmit} className="space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder={
              documentType === 'jd' ? 'e.g. Senior Frontend Engineer (Company X)' : 'e.g. John Doe CV v1'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="content">{documentType === 'jd' ? 'JD text' : 'CV text'}</Label>
            <span className="text-muted-foreground text-xs">{charCount} chars</span>
          </div>
          <Textarea
            id="content"
            placeholder={
              documentType === 'jd' ? 'Paste the job description here...' : 'Paste your CV here...'
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="max-h-100 min-h-80 resize-y"
            required
            minLength={50}
          />
          <div className="text-muted-foreground text-xs">
            Tip: include the full text (requirements + responsibilities). Minimum 50 chars.
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} loading={isPending}>
            Save
          </Button>
        </div>
      </form>
    </PageSection>
  );
}
