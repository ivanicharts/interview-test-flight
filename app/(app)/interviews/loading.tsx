import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';
import { List, ListItem, ListItemContent } from '@/components/ui/list';

export default function Loading() {
  return (
    <PageSection
      title="Interviews"
      description="Your mock interview sessions."
      actions={<Skeleton className="h-9 w-40" />}
    >
      <List>
        {Array.from({ length: 3 }).map((_, i) => (
          <ListItem key={i}>
            <ListItemContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-3 w-56" />
            </ListItemContent>
            <Skeleton className="h-8 w-20" />
          </ListItem>
        ))}
      </List>
    </PageSection>
  );
}
