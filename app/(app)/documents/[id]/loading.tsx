import { Section } from '@/components/ui/section';

export default function Loading() {
  return (
    <Section
      header={
        <>
          <div className="flex animate-pulse items-center gap-2">
            <div className="bg-muted h-6 w-32 rounded-full" />
            <div className="bg-muted h-4 w-48 rounded" />
          </div>
          <div className="bg-muted mt-2 h-7 w-64 animate-pulse rounded md:h-8" />
        </>
      }
    >
      <div className="prose prose-invert max-w-none space-y-3 text-sm leading-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-muted h-4 animate-pulse rounded"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          />
        ))}
      </div>
    </Section>
  );
}
