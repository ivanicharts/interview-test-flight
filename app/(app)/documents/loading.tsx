import { Section } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Section title="Documents" description="Your pasted Job Descriptions and CV versions.">
      <div className="space-y-4">
        {/* Top controls skeleton */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-full md:w-[320px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* List skeleton */}
        <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
