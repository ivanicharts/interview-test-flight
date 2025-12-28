import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { z } from 'zod';

import { AnalysisResultSchema } from '@/lib/ai/schemas';
import { formatDate } from '@/lib/utils';
import { getAnalysisById, getUser } from '@/lib/supabase/queries';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { AnalysisReport } from './components/analysis-report';

const ParamsSchema = z.object({ id: z.uuid() });

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const parsedParams = ParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    notFound();
  }

  const { id } = parsedParams.data;

  const { user } = await getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/analysis/${id}`)}`);
  }

  const { data: analysis, error } = await getAnalysisById(id);

  if (error || !analysis) {
    notFound();
  }

  const parsedResult = AnalysisResultSchema.safeParse(analysis.report);
  const result = parsedResult.success ? parsedResult.data : null;

  return (
    <Section
      title="Analysis Report"
      description={
        <span className="text-muted-foreground text-xs">
          {formatDate(analysis.created_at)} · {analysis.model}
        </span>
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/documents/${analysis.jd_document_id}`}>Open JD</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/documents/${analysis.cv_document_id}`}>Open CV</Link>
          </Button>
        </div>
      }
      header={
        !result && (
          <Badge variant="destructive" className="mt-2 text-xs">
            Stored result doesn't match schema - showing raw JSON
          </Badge>
        )
      }
    >
      {result ? (
        <AnalysisReport result={result} />
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Raw JSON</h2>
          <p className="text-muted-foreground text-sm">
            Your UI schema may have changed since this analysis was generated.
          </p>
          <pre className="bg-muted overflow-x-auto rounded-lg border p-4 text-xs">
            {JSON.stringify(analysis.report, null, 2)}
          </pre>
        </div>
      )}
    </Section>
  );
}
