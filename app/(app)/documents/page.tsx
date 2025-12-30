import { redirect } from 'next/navigation';

import { getUserDocuments } from '@/lib/queries/document';
import { getUser } from '@/lib/supabase/queries';

import { PageSection } from '@/components/ui/page-section';

import DocumentListClient from './components/document-list';

export default async function DocumentsPage() {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  const { documents, error } = await getUserDocuments();

  if (error) {
    throw new Error(error);
  }

  return (
    <PageSection title="Documents" description="Your pasted Job Descriptions and CV versions.">
      <DocumentListClient initialDocs={documents ?? []} />
    </PageSection>
  );
}
