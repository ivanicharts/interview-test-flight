import type { AnalysisResult } from '@/lib/ai/schemas';

function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30'
      : tone === 'warn'
        ? 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30'
        : tone === 'bad'
          ? 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30'
          : 'bg-zinc-500/15 text-zinc-200 ring-1 ring-zinc-500/30';

  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>{children}</span>;
}

function matchTone(match: AnalysisResult['evidence'][number]['match']) {
  if (match === 'strong') return 'good';
  if (match === 'partial') return 'warn';
  return 'bad';
}

export function AnalysisReport({ result }: { result: AnalysisResult }) {
  const score = result.overallScore;

  return (
    <div className="space-y-6">
      {/* Score */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Match score</h2>
            <p className="mt-1 text-sm text-zinc-400">{result.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-zinc-100">{score}</div>
            <div className="text-xs text-zinc-500">out of 100</div>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-zinc-800">
          <div className="h-full bg-zinc-100" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
        </div>

        {result.strengths?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-zinc-200">Strengths</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Evidence mapping */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Evidence mapping</h2>
          <Pill tone="neutral">{result.evidence.length} requirements</Pill>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-zinc-400">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-4">Requirement</th>
                <th className="py-2 pr-4">Importance</th>
                <th className="py-2 pr-4">Match</th>
                <th className="py-2 pr-4">JD evidence</th>
                <th className="py-2 pr-4">CV evidence</th>
              </tr>
            </thead>
            <tbody>
              {result.evidence.map((e, i) => (
                <tr key={i} className="border-b border-zinc-900 align-top">
                  <td className="py-3 pr-4 text-zinc-100">{e.requirement}</td>
                  <td className="py-3 pr-4">
                    <Pill tone={e.importance === 'must' ? 'bad' : e.importance === 'should' ? 'warn' : 'neutral'}>
                      {e.importance}
                    </Pill>
                  </td>
                  <td className="py-3 pr-4">
                    <Pill tone={matchTone(e.match)}>{e.match}</Pill>
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">{e.jdEvidence}</td>
                  <td className="py-3 pr-4 text-zinc-300">{e.cvEvidence ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gaps */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Gaps</h2>
          <Pill tone="neutral">{result.gaps.length} items</Pill>
        </div>

        <div className="mt-4 grid gap-3">
          {result.gaps.map((g, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-zinc-100">{g.title}</div>
                <Pill tone={g.priority === 'high' ? 'bad' : g.priority === 'medium' ? 'warn' : 'neutral'}>
                  {g.priority}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{g.whyItMatters}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                {g.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Rewrite suggestions */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="text-lg font-semibold text-zinc-100">Rewrite suggestions</h2>

        {result.rewriteSuggestions.headline && (
          <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Suggested headline</div>
            <div className="mt-1 text-zinc-100">{result.rewriteSuggestions.headline}</div>
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm font-medium text-zinc-200">Summary bullets</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-200">
              {result.rewriteSuggestions.summaryBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm font-medium text-zinc-200">Keyword additions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.rewriteSuggestions.keywordAdditions.map((k, i) => (
                <Pill key={i} tone="neutral">
                  {k}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm font-medium text-zinc-200">Experience bullet upgrades</div>
          <div className="mt-3 space-y-3">
            {result.rewriteSuggestions.experienceBullets.map((b, i) => (
              <div key={i} className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium text-zinc-100">{b.section}</div>
                  <Pill tone="neutral">rewrite</Pill>
                </div>
                <div className="mt-2 text-sm text-zinc-200">{b.after}</div>
                <div className="mt-2 text-xs text-zinc-400">{b.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-500">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>Model: {result.meta.model}</span>
          <span>JD chars: {result.meta.inputChars.jd}</span>
          <span>CV chars: {result.meta.inputChars.cv}</span>
          <span>Generated: {result.meta.generatedAt}</span>
        </div>
        {result.meta.warnings?.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {result.meta.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
