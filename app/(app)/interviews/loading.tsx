import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageSection
      title="Interviews"
      description="Your mock interview sessions."
      actions={<Skeleton className="h-9 w-40" />}
    >
      <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </PageSection>
  );
}
