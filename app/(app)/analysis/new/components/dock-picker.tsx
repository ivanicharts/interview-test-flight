import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Document } from '@/lib/types';

function preview(text: string) {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > 140 ? t.slice(0, 140) + '…' : t;
}

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
        <div className="border-border/60 max-h-90 overflow-auto rounded-md border">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={[
                'border-border/60 w-full cursor-pointer border-b p-3 text-left last:border-b-0',
                'hover:bg-muted/30 transition',
                selectedId === d.id ? 'bg-muted/30' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{d.title ? 'Titled' : 'Untitled'}</Badge>
                <div className="line-clamp-1 font-medium">{d.title || '(Untitled)'}</div>
              </div>
              <div className="text-muted-foreground mt-1 line-clamp-1 text-xs">{preview(d.content)}</div>
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
