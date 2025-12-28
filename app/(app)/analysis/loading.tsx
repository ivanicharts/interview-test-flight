import { Section } from '@/components/ui/section';

export default function Loading() {
  return (
    <Section
      title="Analyses"
      description="Your match reports."
      actions={<div className="h-9 w-28 animate-pulse rounded-md bg-muted" />}
    >
      <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex animate-pulse items-center gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-4 w-64 rounded bg-muted" />
              </div>
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </Section>
  );
}
