import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { z } from 'zod';

import { supabaseServer } from '@/lib/supabase/server';
import { AnalysisResultSchema } from '@/lib/ai/schemas';

import { AnalysisReport } from './components/analysis-report';

const ParamsSchema = z.object({ id: z.string().uuid() });

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const parsedParams = ParamsSchema.safeParse(await params);
  if (!parsedParams.success) notFound();

  const { id } = parsedParams.data;

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/analysis/${id}`)}`);
  }

  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('id, created_at, model, report, jd_document_id, cv_document_id')
    .eq('id', id)
    .single();

  if (error || !analysis) notFound();

  const parsedResult = AnalysisResultSchema.safeParse(analysis.report);
  const result = parsedResult.success ? parsedResult.data : null;

  async function deleteAnalysisAction(formData: FormData) {
    'use server';
    const analysisId = String(formData.get('analysisId') ?? '');
    if (!z.string().uuid().safeParse(analysisId).success) return;

    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // RLS should protect this, but we also scope by user_id explicitly.
    await supabase.from('analyses').delete().eq('id', analysisId).eq('user_id', user.id);

    redirect('/dashboard');
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/dashboard" className="hover:text-zinc-200">
              ← Dashboard
            </Link>
            <span className="text-zinc-600">/</span>
            <span>Analysis</span>
          </div>

          <h1 className="text-xl font-semibold text-zinc-100">Analysis report</h1>

          <div className="text-sm text-zinc-400">
            <span className="mr-3">Created: {formatDate(analysis.created_at)}</span>
            <span className="mr-3">Model: {analysis.model}</span>
            {!result && <span className="text-amber-300">(Stored result doesn’t match schema — showing raw JSON)</span>}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {/* Adjust these routes to your actual document view pages */}
            <Link
              href={`/documents/${analysis.jd_document_id}`}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Open JD
            </Link>
            <Link
              href={`/documents/${analysis.cv_document_id}`}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Open CV
            </Link>
          </div>
        </div>

        <form action={deleteAnalysisAction}>
          <input type="hidden" name="analysisId" value={analysis.id} />
          <button
            type="submit"
            className="rounded-lg border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-sm text-rose-200 hover:bg-rose-950/50"
          >
            Delete analysis
          </button>
        </form>
      </header>

      {result ? (
        <AnalysisReport result={result} />
      ) : (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-semibold text-zinc-100">Raw JSON</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Your UI schema may have changed since this analysis was generated.
          </p>

          <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-200">
            {JSON.stringify(analysis.report, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
