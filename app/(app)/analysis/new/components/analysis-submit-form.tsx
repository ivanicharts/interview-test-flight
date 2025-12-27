'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Document } from '@/lib/types';

import { createAnalysisAction } from '../../actions';
import { DocumentPicker } from './dock-picker';

export default function AnalysisSubmitForm({ jds, cvs }: { jds: Document[]; cvs: Document[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [jdId, setJdId] = useState<string | null>(jds[0]?.id ?? null);
  const [cvId, setCvId] = useState<string | null>(cvs[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);

  const canCreate = !!jdId && !!cvId && !isPending;

  const create = async () => {
    if (!jdId || !cvId) return;
    setError(null);

    startTransition(async () => {
      const result = await createAnalysisAction({ jdId, cvId });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        router.push(`/analysis/${result.data.id}`);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <DocumentPicker
          title="Job Description"
          docs={jds}
          selectedId={jdId}
          onSelect={setJdId}
          emptyCtaHref="/documents/new?kind=jd"
          emptyCtaLabel="Add a JD"
        />
        <DocumentPicker
          title="CV"
          docs={cvs}
          selectedId={cvId}
          onSelect={setCvId}
          emptyCtaHref="/documents/new?kind=cv"
          emptyCtaLabel="Add a CV"
        />
      </div>

      <div className="flex gap-2 md:justify-end">
        <Button asChild variant="secondary">
          <Link href="/documents">Manage documents</Link>
        </Button>
        <Button disabled={!canCreate} loading={isPending} onClick={create}>
          Generate report
        </Button>
      </div>

      {error ? <div className="border-border/60 bg-muted/30 rounded-md border p-3 text-sm">{error}</div> : null}
    </div>
  );
}
