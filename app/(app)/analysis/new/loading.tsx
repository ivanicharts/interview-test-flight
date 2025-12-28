import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';
import { List, ListItemContent } from '@/components/ui/list';

export default function Loading() {
  return (
    <PageSection
      title="New analysis"
      description="Select a Job Description and a CV, then generate a match report."
    >
      <div className="space-y-5">
        {/* Document pickers grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* JD picker skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">Job Description</div>
              <Skeleton className="h-4 w-16" />
            </div>
            <List className="max-h-100 overflow-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between gap-3 border-b p-4 text-left last:border-b-0"
                >
                  <ListItemContent className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </ListItemContent>
                </button>
              ))}
            </List>
          </div>

          {/* CV picker skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">CV</div>
              <Skeleton className="h-4 w-16" />
            </div>
            <List className="max-h-100 overflow-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between gap-3 border-b p-4 text-left last:border-b-0"
                >
                  <ListItemContent className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </ListItemContent>
                </button>
              ))}
            </List>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-2 md:justify-end">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </PageSection>
  );
}
