import type { AnalysisResult } from '@/lib/ai/schemas';
import { Pill, type PillProps } from '@/components/ui/pill';

const MATCH_TONE_MAP: Record<AnalysisResult['evidence'][number]['match'], PillProps['tone']> = {
  strong: 'good',
  partial: 'warn',
  missing: 'bad',
};

const IMPORTANCE_TONE_MAP: Record<AnalysisResult['evidence'][number]['importance'], PillProps['tone']> = {
  must: 'bad',
  should: 'warn',
  nice: 'neutral',
};

const PRIORITY_TONE_MAP: Record<AnalysisResult['gaps'][number]['priority'], PillProps['tone']> = {
  high: 'bad',
  medium: 'warn',
  low: 'neutral',
};

interface AnalysisReportProps {
  result: AnalysisResult;
}

export function AnalysisReport({ result }: AnalysisReportProps) {
  const score = result.overallScore;

  return (
    <div className="space-y-6">
      {/* Score */}
      <section className="bg-card rounded-xl border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Match score</h2>
            <p className="text-muted-foreground mt-1 text-sm">{result.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-muted-foreground text-xs">out of 100</div>
          </div>
        </div>

        <div className="bg-muted mt-4 h-2 w-full overflow-hidden rounded">
          <div className="bg-primary h-full" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
        </div>

        {result.strengths?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">Strengths</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="bg-muted/50 rounded-lg border p-3 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Evidence mapping */}
      <section className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Evidence mapping</h2>
          <Pill tone="neutral">{result.evidence.length} requirements</Pill>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">Requirement</th>
                <th className="py-2 pr-4">Importance</th>
                <th className="py-2 pr-4">Match</th>
                <th className="py-2 pr-4">JD evidence</th>
                <th className="py-2 pr-4">CV evidence</th>
              </tr>
            </thead>
            <tbody>
              {result.evidence.map((e, i) => (
                <tr key={i} className="border-b align-top">
                  <td className="py-3 pr-4 font-medium">{e.requirement}</td>
                  <td className="py-3 pr-4">
                    <Pill tone={IMPORTANCE_TONE_MAP[e.importance]}>{e.importance}</Pill>
                  </td>
                  <td className="py-3 pr-4">
                    <Pill tone={MATCH_TONE_MAP[e.match]}>{e.match}</Pill>
                  </td>
                  <td className="text-muted-foreground py-3 pr-4">{e.jdEvidence}</td>
                  <td className="text-muted-foreground py-3 pr-4">{e.cvEvidence ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gaps */}
      <section className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Gaps</h2>
          <Pill tone="neutral">{result.gaps.length} items</Pill>
        </div>

        <div className="mt-4 grid gap-3">
          {result.gaps.map((g, i) => (
            <div key={i} className="bg-muted/50 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{g.title}</div>
                <Pill tone={PRIORITY_TONE_MAP[g.priority]}>{g.priority}</Pill>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{g.whyItMatters}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {g.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Rewrite suggestions */}
      <section className="bg-card rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Rewrite suggestions</h2>

        {result.rewriteSuggestions.headline && (
          <div className="bg-muted/50 mt-3 rounded-lg border p-4">
            <div className="text-muted-foreground text-sm">Suggested headline</div>
            <div className="mt-1 font-medium">{result.rewriteSuggestions.headline}</div>
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="text-sm font-medium">Summary bullets</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {result.rewriteSuggestions.summaryBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="text-sm font-medium">Keyword additions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.rewriteSuggestions.keywordAdditions.map((k, i) => (
                <Pill key={i} tone="neutral">
                  {k}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 mt-4 rounded-lg border p-4">
          <div className="text-sm font-medium">Experience bullet upgrades</div>
          <div className="mt-3 space-y-3">
            {result.rewriteSuggestions.experienceBullets.map((b, i) => (
              <div key={i} className="bg-card rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">{b.section}</div>
                  <Pill tone="neutral">rewrite</Pill>
                </div>
                <div className="mt-2 text-sm">{b.after}</div>
                <div className="text-muted-foreground mt-2 text-xs">{b.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="bg-card text-muted-foreground rounded-xl border p-4 text-xs">
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
