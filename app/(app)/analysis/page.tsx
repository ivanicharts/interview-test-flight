import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { getAnalyses, getUser } from '@/lib/supabase/queries';
import { PageSection } from '@/components/ui/page-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
          {analyses!.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{a.match_score ?? 0}/100</Badge>
                  <Link href={`/analysis/${a.id}`} className="truncate font-medium hover:underline">
                    {(a.jd_document as any)?.title || 'Job Description'} -{' '}
                    {(a.cv_document as any)?.title || 'CV'}
                  </Link>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {formatDate(a.created_at)} • {a.model ?? 'gpt-5-mini'}
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/analysis/${a.id}`}>Open</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}
