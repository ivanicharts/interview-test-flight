import Link from 'next/link';

import { type InterviewSessionWithProgress } from '@/lib/supabase/queries';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';
import { List, ListItem } from '@/components/ui/list';
import { Progress } from '@/components/ui/progress';

type Props = {
  sessions: InterviewSessionWithProgress[];
};

export function ActiveSessionsSection({ sessions }: Props) {
  return (
    <ContentCard
      title="In Progress"
      description="Continue your mock interviews"
      label={
        <Button asChild variant="ghost" size="sm">
          <Link href="/interviews">View All →</Link>
        </Button>
      }
    >
      <List className="mt-6">
        {sessions.map((session) => {
          const progressPercent =
            session.progress.total > 0
              ? Math.round((session.progress.answered / session.progress.total) * 100)
              : 0;

          const isPending = session.status === 'pending';
          const jdTitle = session.analysis[0]?.jd_document[0]?.title || 'Unknown JD';

          return (
            <ListItem key={session.id}>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isPending ? 'outline' : 'secondary'}>
                        {isPending ? 'Pending' : 'In Progress'}
                      </Badge>
                      <Link
                        href={`/interviews/${session.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {session.plan.roleTitle || jdTitle}
                      </Link>
                    </div>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/interviews/${session.id}`}>{isPending ? 'Start' : 'Continue'}</Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs">
                    {isPending
                      ? `${session.progress.total} questions prepared`
                      : `${session.progress.answered} of ${session.progress.total} questions answered`}
                  </div>
                  {!isPending && <Progress value={progressPercent} className="mt-1" />}
                </div>
              </div>
            </ListItem>
          );
        })}
      </List>
    </ContentCard>
  );
}
