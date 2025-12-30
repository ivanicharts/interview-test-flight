import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getInterviewSessions, getUser } from '@/lib/supabase/queries';

import { Button } from '@/components/ui/button';
import { PageSection } from '@/components/ui/page-section';

import { InterviewsList } from './components/InterviewsList';

export default async function InterviewsPage() {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: sessions, error } = await getInterviewSessions();

  if (error) {
    throw new Error(error.message);
  }

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
        <InterviewsList interviewSessions={sessions} />
      )}
    </PageSection>
  );
}
