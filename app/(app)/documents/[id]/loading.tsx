import { Section } from '@/components/ui/section';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Section
      header={
        <>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="mt-2 h-7 w-64 md:h-8" />
        </>
      }
    >
      <div className="prose prose-invert max-w-none space-y-3 text-sm leading-6">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${Math.random() * 30 + 70}%` }} />
        ))}
      </div>
    </Section>
  );
}
