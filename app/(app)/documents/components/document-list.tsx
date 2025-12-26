'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Doc = {
  id: string;
  kind: 'jd' | 'cv';
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

function label(kind: Doc['kind']) {
  return kind === 'cv' ? 'CV' : 'Job Description';
}

function preview(text: string) {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > 160 ? `${t.slice(0, 160)}…` : t;
}

export default function DocumentListClient({ initialDocs }: { initialDocs: Doc[] }) {
  const [docs, setDocs] = React.useState<Doc[]>(initialDocs);
  const [tab, setTab] = React.useState<'all' | 'jd' | 'cv'>('all');
  const [q, setQ] = React.useState('');
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return docs.filter((d) => {
      if (tab !== 'all' && d.kind !== tab) return false;
      if (!query) return true;

      const hay = `${d.title ?? ''} ${d.content}`.toLowerCase();
      return hay.includes(query);
    });
  }, [docs, tab, q]);

  const counts = React.useMemo(() => {
    const jd = docs.filter((d) => d.kind === 'jd').length;
    const cv = docs.filter((d) => d.kind === 'cv').length;
    return { all: docs.length, jd, cv };
  }, [docs]);

  async function doDelete(id: string) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* top controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="jd">JD ({counts.jd})</TabsTrigger>
              <TabsTrigger value="cv">CV ({counts.cv})</TabsTrigger>
            </TabsList>
          </Tabs>

          <Input
            placeholder="Search title or content…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:w-[320px]"
          />
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/documents/new?kind=jd">New JD</Link>
          </Button>
          <Button asChild>
            <Link href="/documents/new?kind=cv">New CV</Link>
          </Button>
        </div>
      </div>

      {error ? <div className="border-border/60 bg-muted/30 rounded-md border p-3 text-sm">{error}</div> : null}

      {/* list */}
      {filtered.length === 0 ? (
        <div className="border-border/60 bg-muted/10 rounded-md border p-6 text-center">
          <div className="text-muted-foreground text-sm">No documents found.</div>
          <div className="mt-3 flex justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/documents/new?kind=jd">Add a JD</Link>
            </Button>
            <Button asChild>
              <Link href="/documents/new?kind=cv">Add a CV</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
          {filtered.map((d) => (
            <div key={d.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{label(d.kind)}</Badge>
                  <Link
                    href={`/documents/${d.id}`}
                    className="truncate font-medium hover:underline"
                    title={d.title ?? undefined}
                  >
                    {d.title || '(Untitled)'}
                  </Link>
                </div>

                <div className="text-muted-foreground mt-1 truncate text-sm">{preview(d.content)}</div>

                <div className="text-muted-foreground mt-1 text-xs">
                  Updated: {new Date(d.updated_at).toLocaleString('en')}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/documents/${d.id}`}>Open</Link>
                </Button>
                <Button variant="destructive" size="sm" disabled={busyId === d.id} onClick={() => setConfirmId(d.id)}>
                  {busyId === d.id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* confirm dialog */}
      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove it. Related analyses may be removed too (privacy-first).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={!confirmId || !!busyId} onClick={() => confirmId && doDelete(confirmId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
