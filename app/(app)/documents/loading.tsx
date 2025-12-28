import { Section } from '@/components/ui/section';

export default function Loading() {
  return (
    <Section title="Documents" description="Your pasted Job Descriptions and CV versions.">
      <div className="space-y-4">
        {/* Top controls skeleton */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex animate-pulse flex-col gap-3 md:flex-row md:items-center">
            <div className="h-10 w-64 rounded-md bg-muted" />
            <div className="h-10 w-full rounded-md bg-muted md:w-[320px]" />
          </div>
          <div className="flex animate-pulse gap-2">
            <div className="h-10 w-20 rounded-md bg-muted" />
            <div className="h-10 w-20 rounded-md bg-muted" />
          </div>
        </div>

        {/* List skeleton */}
        <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex animate-pulse items-center gap-2">
                  <div className="h-5 w-24 rounded-full bg-muted" />
                  <div className="h-5 w-48 rounded bg-muted" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex animate-pulse gap-2">
                <div className="h-9 w-16 rounded-md bg-muted" />
                <div className="h-9 w-16 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
