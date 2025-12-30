import type { AnalysisResult } from '@/lib/ai/schemas';
import { cn } from '@/lib/utils';

import { ContentCard } from '@/components/ui/content-card';
import { Pill } from '@/components/ui/pill';
import { Progress } from '@/components/ui/progress';

import { IMPORTANCE_TONE_MAP, MATCH_TONE_MAP, PRIORITY_TONE_MAP, getScoreTone } from '../utils';
import { ReportCard } from './report-card';
import { ReportMeta } from './report-meta';

interface AnalysisReportProps {
  result: AnalysisResult;
}

export function AnalysisReport({ result }: AnalysisReportProps) {
  const scoreTone = getScoreTone(result.overallScore);

  return (
    <div className="space-y-5 mt-2">
      {/* Score */}
      <ContentCard
        borderlessMobile
        title="Match score"
        label={<Pill tone={scoreTone}>{result.overallScore}%</Pill>}
      >
        <Progress value={result.overallScore} max={100} tone={scoreTone} />
        {result.strengths?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">Strengths</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {result.strengths.map((s, i) => (
                <ReportCard key={i} className="text-sm" as="li">
                  {s}
                </ReportCard>
              ))}
            </ul>
          </div>
        )}
      </ContentCard>

      {/* Evidence mapping */}
      <ContentCard
        borderlessMobile
        title="Evidence mapping"
        label={<Pill tone="neutral">{result.evidence.length} requirements</Pill>}
      >
        {/* Mobile: Card layout */}
        <div className="space-y-2 md:hidden">
          {result.evidence.map((e, i) => (
            <ReportCard
              key={i}
              title={e.requirement}
              label={
                <>
                  <Pill tone={IMPORTANCE_TONE_MAP[e.importance]}>{e.importance}</Pill>
                  <Pill tone={MATCH_TONE_MAP[e.match]}>{e.match}</Pill>
                </>
              }
            >
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">JD evidence:</div>
                  <div className="text-muted-foreground">{e.jdEvidence}</div>
                </div>
                {e.cvEvidence && (
                  <div>
                    <div className="text-muted-foreground text-xs">CV evidence:</div>
                    <div className="text-muted-foreground">{e.cvEvidence}</div>
                  </div>
                )}
              </div>
            </ReportCard>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">Requirement</th>
                <th className="py-2 pr-4">Importance</th>
                <th className="py-2 pr-4">Match</th>
                <th className="py-2 pr-4">JD evidence</th>
                <th className="py-2 pr-4">CV evidence</th>
              </tr>
            </thead>
            <tbody className="divide-border/60  divide-y">
              {result.evidence.map((e, i) => (
                <tr key={i} className="align-top">
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
      </ContentCard>

      {/* Gaps */}
      <ContentCard
        borderlessMobile
        title="Gaps"
        label={<Pill tone="neutral">{result.gaps.length} items</Pill>}
      >
        {result.gaps.map((g, i) => (
          <ReportCard
            key={i}
            title={g.title}
            description={g.whyItMatters}
            label={<Pill tone={PRIORITY_TONE_MAP[g.priority]}>{g.priority}</Pill>}
          >
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {g.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </ReportCard>
        ))}
      </ContentCard>

      {/* Rewrite suggestions */}
      <ContentCard title="Rewrite suggestions">
        {result.rewriteSuggestions.headline && (
          <ReportCard description="Suggested headline">
            <div className="font-medium">{result.rewriteSuggestions.headline}</div>
          </ReportCard>
        )}

        <div className="grid gap-2 lg:grid-cols-2">
          <ReportCard subtitle="Summary bullets">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {result.rewriteSuggestions.summaryBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </ReportCard>

          <ReportCard subtitle="Keyword additions">
            <div className="flex flex-wrap gap-2">
              {result.rewriteSuggestions.keywordAdditions.map((k, i) => (
                <Pill key={i} tone="neutral">
                  {k}
                </Pill>
              ))}
            </div>
          </ReportCard>
        </div>

        <ReportCard subtitle="Experience bullet upgrades">
          {result.rewriteSuggestions.experienceBullets.map((b, i) => (
            <ReportCard
              key={i}
              variant="secondary"
              title={b.section}
              label={<Pill tone="neutral">rewrite</Pill>}
            >
              <div className="mt-2 text-sm">{b.after}</div>
              <div className="text-muted-foreground mt-2 text-xs">{b.rationale}</div>
            </ReportCard>
          ))}
        </ReportCard>
      </ContentCard>

      {/* Meta */}
      <ContentCard>
        <ReportMeta meta={result.meta} />
      </ContentCard>
    </div>
  );
}
