import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentListClient from './components/document-list';

export default async function DocumentsPage() {
  const supabase = await supabaseServer();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect('/login');

  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, kind, title, content, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (error) {
    // keep it simple; you can add a nicer error boundary later
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Documents</CardTitle>
          <div className="text-muted-foreground text-sm">Your pasted Job Descriptions and CV versions.</div>
        </CardHeader>

        <CardContent>
          <DocumentListClient initialDocs={docs ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
