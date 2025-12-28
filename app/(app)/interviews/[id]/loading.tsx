import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageSection
      title={<Skeleton className="h-8 w-64" />}
      description={
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Progress bar skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main question card skeleton */}
          <div className="space-y-4">
            <div className="border-border/60 space-y-4 rounded-lg border p-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Answer input skeleton */}
            <div className="border-border/60 rounded-lg border p-6">
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Navigation skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          {/* Timeline sidebar skeleton */}
          <div className="border-border/60 rounded-lg border p-4">
            <Skeleton className="mb-3 h-5 w-20" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-border/60 space-y-2 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overview skeleton */}
        <div className="border-border/60 space-y-3 rounded-lg border p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </PageSection>
  );
}
