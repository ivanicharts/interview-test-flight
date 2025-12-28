import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageSection
      title="Analysis Report"
      description={<Skeleton className="h-4 w-48" />}
      actions={
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      }
    >
      <div className="space-y-5">
        {/* Score section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 rounded-lg" />
        </div>

        {/* Evidence section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-40 rounded-lg" />
        </div>

        {/* Gaps section skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-32 rounded-lg" />
        </div>

        {/* Rewrite suggestions skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 rounded-lg" />
        </div>

        {/* Meta section skeleton */}
        <Skeleton className="h-4 w-full" />
      </div>
    </PageSection>
  );
}
