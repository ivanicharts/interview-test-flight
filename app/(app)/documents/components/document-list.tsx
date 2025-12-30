'use client';

import Link from 'next/link';
import * as React from 'react';

import { Document } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { List, ListItem, ListItemActions, ListItemContent } from '@/components/ui/list';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { deleteDocumentAction } from '../actions';

function label(kind: Document['kind']) {
  return kind === 'cv' ? 'CV' : 'Job Description';
}

export default function DocumentListClient({ initialDocs }: { initialDocs: Document[] }) {
  const [docs, setDocs] = React.useState<Document[]>(initialDocs);
  const [tab, setTab] = React.useState<'all' | 'jd' | 'cv'>('all');
  const [query, setQuery] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return docs.filter((d) => {
      if (tab !== 'all' && d.kind !== tab) {
        return false;
      }
      if (!cleanQuery) {
        return true;
      }

      const hay = `${d.title ?? ''} ${d.content}`.toLowerCase();
      return hay.includes(cleanQuery);
    });
  }, [docs, tab, query]);

  const counts = React.useMemo(() => {
    const jd = docs.filter((d) => d.kind === 'jd').length;
    const cv = docs.filter((d) => d.kind === 'cv').length;
    return { all: docs.length, jd, cv };
  }, [docs]);

  async function doDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteDocumentAction(id);
      if (result.error) {
        setError(result.error);
      } else {
        setDocs((prev) => prev.filter((d) => d.id !== id));
      }
      setConfirmId(null);
    });
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:w-[320px]"
          />
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/documents/new?kind=jd">New JD</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/documents/new?kind=cv">New CV</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="border-border/60 bg-muted/30 rounded-md border p-3 text-sm">{error}</div>
      ) : null}

      {/* list */}
      {filtered.length === 0 ? (
        <div className="border-border/60 bg-muted/10 rounded-md border p-6 text-center">
          <div className="text-muted-foreground text-sm">No documents found.</div>
          <div className="mt-3 flex justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/documents/new?kind=jd">Add a JD</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/documents/new?kind=cv">Add a CV</Link>
            </Button>
          </div>
        </div>
      ) : (
        <List>
          {filtered.map((d) => (
            <ListItem key={d.id} className="flex-row md:items-center">
              <ListItemContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{label(d.kind)}</Badge>
                  <Link
                    href={`/documents/${d.id}`}
                    className="line-clamp-1 font-medium hover:underline"
                    title={d.title ?? undefined}
                  >
                    {d.title || '(Untitled)'}
                  </Link>
                </div>

                <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">{d.content}</div>

                <div className="text-muted-foreground mt-1 text-xs">
                  Updated: {new Date(d.updated_at).toLocaleString('en')}
                </div>
              </ListItemContent>

              <ListItemActions className="flex flex-col md:flex-row">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/documents/${d.id}`}>Open</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setConfirmId(d.id)}
                >
                  Delete
                </Button>
              </ListItemActions>
            </ListItem>
          ))}
        </List>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Delete this document?"
        description="This will permanently remove it. Related analyses may be removed too."
        confirmText="Delete"
        variant="destructive"
        disabled={isPending}
        onConfirm={() => confirmId && doDelete(confirmId)}
      />
    </div>
  );
}
