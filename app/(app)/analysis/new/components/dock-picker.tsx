import Link from 'next/link';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, ListItemContent } from '@/components/ui/list';
import type { Document } from '@/lib/types';

export function DocumentPicker({
  title,
  docs,
  selectedId,
  onSelect,
  emptyCtaHref,
  emptyCtaLabel,
}: {
  title: string;
  docs: Document[];
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
        <List className="max-h-100 overflow-auto">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={cn(
                'flex w-full items-center justify-between gap-3 border-b p-4 text-left last:border-b-0',
                'hover:bg-muted/30 cursor-pointer transition',
                selectedId === d.id && 'bg-muted hover:bg-muted',
              )}
            >
              <ListItemContent>
                <div className="flex items-center gap-2">
                  {d.title ? (
                    <div className="line-clamp-1 font-medium">{d.title}</div>
                  ) : (
                    <Badge variant="secondary">Untitled</Badge>
                  )}
                </div>
                <div className="text-muted-foreground mt-1 line-clamp-1 text-xs">{d.content}</div>
                <div className="text-muted-foreground mt-1 text-[11px]">
                  Updated: {new Date(d.updated_at).toLocaleString(['en-US'])}
                </div>
              </ListItemContent>
            </button>
          ))}
        </List>
      )}
    </div>
  );
}
