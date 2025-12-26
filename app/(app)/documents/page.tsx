import { redirect } from 'next/navigation';

import { Section } from '@/components/ui/section';
import { getUser, getDocuments } from '@/lib/supabase/queries';
import DocumentListClient from './components/document-list';

export default async function DocumentsPage() {
  const { user } = await getUser();
  if (!user) redirect('/login');

  const { data: docs, error } = await getDocuments();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <Section title="Documents" description="Your pasted Job Descriptions and CV versions.">
      <DocumentListClient initialDocs={docs ?? []} />
    </Section>
  );
}
