import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAnalyses, getUser } from '@/lib/supabase/queries';

import { Button } from '@/components/ui/button';
import { PageSection } from '@/components/ui/page-section';

import { AnalysesList } from './components/analyses-list';

export default async function AnalysesPage() {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: analyses, error } = await getAnalyses();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PageSection
      title="Analyses"
      description="Your match reports."
      actions={
        <Button asChild>
          <Link href="/analysis/new">New analysis</Link>
        </Button>
      }
    >
      {(analyses ?? []).length === 0 ? (
        <div className="border-border/60 bg-muted/10 rounded-md border p-6 text-center">
          <div className="text-muted-foreground text-sm">No analysis yet.</div>
          <Button asChild className="mt-3">
            <Link href="/analysis/new">Create one</Link>
          </Button>
        </div>
      ) : (
        <AnalysesList analyses={analyses ?? []} />
      )}
    </PageSection>
  );
}
