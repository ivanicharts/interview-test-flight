import { redirect, notFound } from 'next/navigation';
import { z } from 'zod';

import { getUser, getInterviewSessionById } from '@/lib/supabase/queries';
import { InterviewPlanSchema } from '@/lib/ai/schemas';
import { PageSection } from '@/components/ui/page-section';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

import { InterviewPlayer } from './components/interview-player';

const ParamsSchema = z.object({ id: z.string().uuid() });

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const parsedParams = ParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    notFound();
  }

  const { id } = parsedParams.data;

  const { user } = await getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/interviews/${id}`)}`);
  }

  const { data: session, error } = await getInterviewSessionById(id);

  if (error || !session) {
    notFound();
  }

  // Validate plan JSONB
  const planResult = InterviewPlanSchema.safeParse(session.plan);

  if (!planResult.success) {
    return (
      <PageSection title="Interview Session" description="Error loading interview">
        <div className="border-destructive/60 bg-destructive/10 text-destructive rounded-md border p-4">
          <div className="font-medium">Invalid interview data</div>
          <p className="mt-1 text-sm">
            The interview plan stored in the database doesn't match the expected format. This
            session may have been created with an older version.
          </p>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm underline">Show validation errors</summary>
            <pre className="text-destructive mt-2 overflow-x-auto text-xs">
              {JSON.stringify(planResult.error.issues, null, 2)}
            </pre>
          </details>
        </div>
      </PageSection>
    );
  }

  const plan = planResult.data;

  const statusVariant =
    session.status === 'completed'
      ? 'default'
      : session.status === 'in_progress'
        ? 'secondary'
        : 'outline';

  const difficultyColors: Record<string, string> = {
    entry: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    mid: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    senior: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    lead: 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  return (
    <PageSection
      title={plan.roleTitle}
      description={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">{formatDate(session.created_at)}</span>
          <Badge variant={statusVariant} className="text-xs">
            {session.status === 'completed'
              ? 'Completed'
              : session.status === 'in_progress'
                ? 'In Progress'
                : 'Pending'}
          </Badge>
          <Badge variant="secondary" className={difficultyColors[plan.difficulty] || ''}>
            {plan.difficulty}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {plan.questions.length} questions • {session.mode || 'text'}
          </span>
        </div>
      }
    >
      <InterviewPlayer plan={plan} />
    </PageSection>
  );
}
