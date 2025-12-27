import { redirect } from 'next/navigation';

import { Section } from '@/components/ui/section';
import { getUser, getDocuments } from '@/lib/supabase/queries';
import AnalysisCreateClient from './components/analysis-submit-form';

export default async function NewAnalysisPage() {
  const { user } = await getUser();
  if (!user) {
    redirect('/login');
  }

  // Only fetch first 200 chars of content for preview (DocumentPicker uses 140)
  const { data: docs, error } = await getDocuments({ maxContentLength: 200 });

  if (error) {
    throw new Error(error.message);
  }

  const jds = (docs ?? []).filter((d) => d.kind === 'jd');
  const cvs = (docs ?? []).filter((d) => d.kind === 'cv');

  return (
    <Section title="New analysis" description="Select a Job Description and a CV, then generate a match report.">
      <AnalysisCreateClient jds={jds} cvs={cvs} />
    </Section>
  );
}
