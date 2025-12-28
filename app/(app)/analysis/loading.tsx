import { Section } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Section title="Analyses" description="Your match reports." actions={<Skeleton className="h-9 w-28" />}>
      <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </Section>
  );
}
