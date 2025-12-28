import { Skeleton } from '@/components/ui/skeleton';
import { PageSection } from '@/components/ui/page-section';

export default function Loading() {
  return (
    <PageSection title="Dashboard" description="Your progress and activity across interview prep">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-32 w-full" />
      </div>
    </PageSection>
  );
}
