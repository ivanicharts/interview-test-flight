import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisCreateClient from './components/analysis-submit-form';

export const dynamic = 'force-dynamic';

export default async function NewAnalysisPage() {
  const supabase = await supabaseServer();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect('/login');

  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, kind, title, content, updated_at')
    .order('updated_at', { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);

  const jds = (docs ?? []).filter((d) => d.kind === 'jd');
  const cvs = (docs ?? []).filter((d) => d.kind === 'cv');

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">New analysis</CardTitle>
          <div className="text-muted-foreground text-sm">
            Select a Job Description and a CV, then generate a match report.
          </div>
        </CardHeader>
        <CardContent>
          <AnalysisCreateClient jds={jds} cvs={cvs} />
        </CardContent>
      </Card>
    </div>
  );
}
