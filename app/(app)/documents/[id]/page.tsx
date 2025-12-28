import { notFound, redirect } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { PageSection } from '@/components/ui/page-section';
import { getUser, getDocumentById } from '@/lib/supabase/queries';

function kindLabel(kind: string) {
  return kind === 'cv' ? 'CV' : 'Job Description';
}

export default async function DocumentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const documentId = (await params).id;

  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: doc, error } = await getDocumentById(documentId);

  if (error || !doc) {
    return notFound();
  }

  return (
    <PageSection
      header={
        <>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{kindLabel(doc.kind)}</Badge>
            <span className="text-muted-foreground text-xs">{new Date(doc.created_at).toLocaleString()}</span>
          </div>
          <CardTitle className="text-xl md:text-2xl">{doc.title || '(Untitled)'}</CardTitle>
        </>
      }
    >
      <div className="prose prose-invert max-w-none text-sm leading-6 whitespace-pre-wrap">{doc.content}</div>
    </PageSection>
  );
}
