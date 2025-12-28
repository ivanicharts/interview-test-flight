import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { getUser } from '@/lib/supabase/queries';
import { PageSection } from '@/components/ui/page-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function InterviewsPage() {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  // TODO: Create getInterviewSessions() query in lib/supabase/queries.ts
  // const { data: sessions, error } = await getInterviewSessions();
  // if (error) {
  //   throw new Error(error.message);
  // }
  const sessions: any[] = [];

  return (
    <PageSection
      title="Interviews"
      description="Your mock interview sessions."
      actions={
        <Button asChild>
          <Link href="/analysis">Start from analysis</Link>
        </Button>
      }
    >
      {(sessions ?? []).length === 0 ? (
        <div className="border-border/60 bg-muted/10 rounded-md border p-6 text-center">
          <div className="text-muted-foreground text-sm">No interview sessions yet.</div>
          <p className="text-muted-foreground mt-2 text-xs">
            Create an analysis first, then start a mock interview from the analysis page.
          </p>
          <Button asChild className="mt-3">
            <Link href="/analysis">View analyses</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
          {sessions.map((session: any) => (
            <div key={session.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      session.status === 'completed'
                        ? 'default'
                        : session.status === 'in_progress'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {session.status === 'completed'
                      ? 'Completed'
                      : session.status === 'in_progress'
                        ? 'In Progress'
                        : 'Pending'}
                  </Badge>
                  <Link href={`/interviews/${session.id}`} className="truncate font-medium hover:underline">
                    {session.analysis?.jd_document?.title || 'Interview Session'}
                  </Link>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {formatDate(session.created_at)}
                  {session.mode && ` • ${session.mode}`}
                  {session.completed_at && ` • Completed ${formatDate(session.completed_at)}`}
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/interviews/${session.id}`}>
                  {session.status === 'completed' ? 'Review' : 'Continue'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}
