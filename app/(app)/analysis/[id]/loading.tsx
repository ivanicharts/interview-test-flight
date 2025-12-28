import { Section } from '@/components/ui/section';

export default function Loading() {
  return (
    <Section
      title="Analysis Report"
      description={<div className="h-4 w-48 animate-pulse rounded bg-muted" />}
      actions={
        <div className="flex animate-pulse flex-wrap gap-2">
          <div className="h-8 w-20 rounded bg-muted" />
          <div className="h-8 w-20 rounded bg-muted" />
        </div>
      }
    >
      <div className="space-y-5">
        {/* Score section skeleton */}
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-24 rounded-lg bg-muted/50" />
        </div>

        {/* Evidence section skeleton */}
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-40 rounded-lg bg-muted/50" />
        </div>

        {/* Gaps section skeleton */}
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="h-32 rounded-lg bg-muted/50" />
        </div>

        {/* Rewrite suggestions skeleton */}
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-32 rounded-lg bg-muted/50" />
        </div>

        {/* Meta section skeleton */}
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
        </div>
      </div>
    </Section>
  );
}
