import { Section } from '@/components/ui/section';

export default function Loading() {
  return (
    <Section
      maxWidth="5xl"
      header={
        <>
          <div className="flex animate-pulse items-center gap-2">
            <div className="h-6 w-24 rounded-full bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        </>
      }
    >
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${Math.random() * 20 + 80}%` }} />
        ))}
      </div>
    </Section>
  );
}
