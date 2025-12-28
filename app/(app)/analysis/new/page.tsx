import { redirect } from 'next/navigation';

import { PageSection } from '@/components/ui/page-section';
import { getUser, getDocuments } from '@/lib/supabase/queries';
import AnalysisSubmitForm from './components/analysis-submit-form';

export default async function NewAnalysisPage() {
  const { user } = await getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: docs, error } = await getDocuments({ maxContentLength: 200 });

  if (error) {
    throw new Error(error.message);
  }

  const jds = (docs ?? []).filter((d) => d.kind === 'jd');
  const cvs = (docs ?? []).filter((d) => d.kind === 'cv');

  return (
    <PageSection
      title="New analysis"
      description="Select a Job Description and a CV, then generate a match report."
    >
      <AnalysisSubmitForm jds={jds} cvs={cvs} />
    </PageSection>
  );
}
