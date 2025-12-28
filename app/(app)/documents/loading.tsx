import { PageSection } from '@/components/ui/page-section';
import { Skeleton } from '@/components/ui/skeleton';
import { List, ListItem, ListItemContent, ListItemActions } from '@/components/ui/list';

export default function Loading() {
  return (
    <PageSection title="Documents" description="Your pasted Job Descriptions and CV versions.">
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
        <List>
          {[...Array(5)].map((_, i) => (
            <ListItem key={i} className="flex-col md:flex-row md:items-center">
              <ListItemContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </ListItemContent>
              <ListItemActions>
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </ListItemActions>
            </ListItem>
          ))}
        </List>
      </div>
    </PageSection>
  );
}
