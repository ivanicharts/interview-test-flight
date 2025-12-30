'use client';

import Link from 'next/link';

import type { InterviewSession } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, ListItem, ListItemContent } from '@/components/ui/list';

type Props = {
  interviewSessions: InterviewSession[];
};

export function InterviewsList({ interviewSessions }: Props) {
  return (
    <List>
      {interviewSessions.map((session) => (
        <ListItem key={session.id}>
          <ListItemContent>
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
              <Link href={`/interviews/${session.id}`} className="line-clamp-1 font-medium hover:underline">
                {session.analysis.jd_document.title || 'Interview Session'}
              </Link>
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {formatDate(session.created_at)}
              {session.mode && ` • ${session.mode}`}
              {session.completed_at && ` • Completed ${formatDate(session.completed_at)}`}
            </div>
          </ListItemContent>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/interviews/${session.id}`}>
              {session.status === 'completed' ? 'Review' : 'Continue'}
            </Link>
          </Button>
        </ListItem>
      ))}
    </List>
  );
}
