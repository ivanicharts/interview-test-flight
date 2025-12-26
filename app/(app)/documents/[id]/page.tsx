import { notFound, redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function kindLabel(kind: string) {
  return kind === 'cv' ? 'CV' : 'Job Description';
}

export default async function DocumentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await supabaseServer();
  const documentId = (await params).id;

  const { data: userRes } = await supabase.auth.getUser();

  if (!userRes.user) {
    redirect('/login');
  }

  const { data: doc, error } = await supabase
    .from('documents')
    .select('id, kind, title, content, created_at, updated_at')
    .eq('id', documentId)
    .single();

  if (error || !doc) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{kindLabel(doc.kind)}</Badge>
            <span className="text-muted-foreground text-xs">{new Date(doc.created_at).toLocaleString()}</span>
          </div>

          <CardTitle className="text-xl md:text-2xl">{doc.title || '(Untitled)'}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="prose prose-invert max-w-none text-sm leading-6 whitespace-pre-wrap">{doc.content}</div>
        </CardContent>
      </Card>
    </div>
  );
}
