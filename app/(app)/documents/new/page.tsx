'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Kind = 'jd' | 'cv';

function clampKind(v: string | null): Kind {
  return v === 'cv' ? 'cv' : 'jd';
}

export default function NewDocumentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [kind, setKind] = React.useState<Kind>(() => clampKind(sp.get('kind')));
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const charCount = content.length;
  const canSave = content.trim().length >= 50 && !isSaving;

  async function onSave() {
    setError(null);
    setIsSaving(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, title, content }),
      });

      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      router.push(`/documents/${json.id}`);
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">New document</CardTitle>
          <div className="text-muted-foreground text-sm">
            Paste the text for your Job Description or CV. (Uploads later.)
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={kind} onValueChange={(v) => setKind(v as Kind)}>
            <TabsList>
              <TabsTrigger value="jd">Job Description</TabsTrigger>
              <TabsTrigger value="cv">CV</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder={kind === 'jd' ? 'e.g. Senior Frontend Engineer (Company X)' : 'e.g. John Doe CV v1'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="content">{kind === 'jd' ? 'JD text' : 'CV text'}</Label>
              <span className="text-muted-foreground text-xs">{charCount} chars</span>
            </div>
            <Textarea
              id="content"
              placeholder={kind === 'jd' ? 'Paste the job description here...' : 'Paste your CV here...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="max-h-100 min-h-80 resize-y"
            />
            <div className="text-muted-foreground text-xs">
              Tip: include the full text (requirements + responsibilities). Minimum ~50 chars.
            </div>
          </div>

          {error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => router.back()} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={!canSave}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
