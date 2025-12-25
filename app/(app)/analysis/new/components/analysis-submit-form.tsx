'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Doc = {
  id: string;
  kind: 'jd' | 'cv';
  title: string | null;
  content: string;
  updated_at: string;
};

function preview(text: string) {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > 140 ? t.slice(0, 140) + '…' : t;
}

function DocPicker({
  title,
  docs,
  selectedId,
  onSelect,
  emptyCtaHref,
  emptyCtaLabel,
}: {
  title: string;
  docs: Doc[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyCtaHref: string;
  emptyCtaLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground text-xs">{docs.length} items</div>
      </div>

      {docs.length === 0 ? (
        <div className="border-border/60 bg-muted/10 rounded-md border p-4 text-sm">
          <div className="text-muted-foreground">No documents yet.</div>
          <Button asChild size="sm" className="mt-3">
            <Link href={emptyCtaHref}>{emptyCtaLabel}</Link>
          </Button>
        </div>
      ) : (
        <div className="border-border/60 max-h-[360px] overflow-auto rounded-md border">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={[
                'border-border/60 w-full border-b p-3 text-left last:border-b-0',
                'hover:bg-muted/30 transition',
                selectedId === d.id ? 'bg-muted/30' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{d.title ? 'Titled' : 'Untitled'}</Badge>
                <div className="truncate font-medium">{d.title || '(Untitled)'}</div>
              </div>
              <div className="text-muted-foreground mt-1 truncate text-xs">{preview(d.content)}</div>
              <div className="text-muted-foreground mt-1 text-[11px]">
                Updated: {new Date(d.updated_at).toLocaleString(['en-US'])}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AnalysisSubmitForm({ jds, cvs }: { jds: Doc[]; cvs: Doc[] }) {
  const router = useRouter();
  const [jdId, setJdId] = React.useState<string | null>(jds[0]?.id ?? null);
  const [cvId, setCvId] = React.useState<string | null>(cvs[0]?.id ?? null);
  const [title, setTitle] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canCreate = !!jdId && !!cvId && !isCreating;

  async function create() {
    if (!jdId || !cvId) return;
    setError(null);
    setIsCreating(true);
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jdId, cvId, title: title.trim() || undefined }),
      });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(json.error || 'Failed to create analysis');
      router.push(`/analyses/${json.id}`);
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <DocPicker
          title="Job Description"
          docs={jds}
          selectedId={jdId}
          onSelect={setJdId}
          emptyCtaHref="/documents/new?kind=jd"
          emptyCtaLabel="Add a JD"
        />
        <DocPicker
          title="CV"
          docs={cvs}
          selectedId={cvId}
          onSelect={setCvId}
          emptyCtaHref="/documents/new?kind=cv"
          emptyCtaLabel="Add a CV"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <div className="text-sm font-medium">Title (optional)</div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Frontend Engineer @ Company X — CV v2"
            maxLength={120}
          />
        </div>

        <div className="flex gap-2 md:justify-end">
          <Button asChild variant="secondary">
            <Link href="/documents">Manage documents</Link>
          </Button>
          <Button disabled={!canCreate} onClick={create}>
            {isCreating ? 'Generating…' : 'Generate report'}
          </Button>
        </div>
      </div>

      {error ? <div className="border-border/60 bg-muted/30 rounded-md border p-3 text-sm">{error}</div> : null}
    </div>
  );
}
