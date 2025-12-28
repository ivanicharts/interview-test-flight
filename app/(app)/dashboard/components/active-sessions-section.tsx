import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { InterviewPlan } from '@/lib/ai/schemas';

interface ActiveSessionsSectionProps {
  sessions: Array<{
    id: string;
    status: 'pending' | 'in_progress';
    mode: string;
    plan: InterviewPlan;
    created_at: string;
    analysis: Array<{
      jd_document: Array<{ title: string }>;
      cv_document: Array<{ title: string }>;
    }>;
    progress: {
      total: number;
      answered: number;
    };
  }>;
}

export function ActiveSessionsSection({ sessions }: ActiveSessionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>In Progress</CardTitle>
        <p className="text-muted-foreground text-xs">Continue your mock interviews</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => {
            const progressPercent =
              session.progress.total > 0
                ? Math.round((session.progress.answered / session.progress.total) * 100)
                : 0;

            const isPending = session.status === 'pending';

            const jdTitle = session.analysis[0]?.jd_document[0]?.title || 'Unknown JD';

            return (
              <div key={session.id} className="rounded-lg border p-4">
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
                        {session.plan.roleTitle}
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
