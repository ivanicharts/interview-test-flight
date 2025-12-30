import { BarChart3, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';

interface StatsOverviewProps {
  stats: {
    documents: { total: number; jdCount: number; cvCount: number };
    analyses: { total: number; avgScore: number | null };
    interviews: { total: number; inProgress: number };
  };
}

const StatCardContent = ({
  total,
  meta,
  href,
}: {
  total: React.ReactNode;
  meta: React.ReactNode;
  href: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">{total}</div>
        <p className="text-muted-foreground mt-1 text-xs">{meta}</p>
      </div>
      <Button asChild variant="link" size="inline">
        <Link href={href}>View All</Link>
      </Button>
    </div>
  );
};

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-2 md:gap-4 md:grid-cols-3">
      {/* Documents Card */}
      <ContentCard title="Documents" label={<FileText className="text-muted-foreground h-4 w-4" />}>
        <StatCardContent
          total={stats.documents.total}
          meta={`${stats.documents.jdCount} JDs • ${stats.documents.cvCount} CVs`}
          href="/documents"
        />
      </ContentCard>

      {/* Analyses Card */}
      <ContentCard title="Analyses" label={<BarChart3 className="text-muted-foreground h-4 w-4" />}>
        <StatCardContent
          total={stats.analyses.total}
          meta={
            stats.analyses.avgScore !== null ? (
              <span className="text-muted-foreground mt-1 text-xs">
                Avg Score:{' '}
                <Badge variant="secondary" className="ml-1">
                  {stats.analyses.avgScore}/100
                </Badge>
              </span>
            ) : (
              <span className="text-muted-foreground mt-1 text-xs">No analyses yet</span>
            )
          }
          href="/analysis"
        />
      </ContentCard>

      {/* Documents Card */}
      <ContentCard title="Interviews" label={<MessageSquare className="text-muted-foreground h-4 w-4" />}>
        <StatCardContent
          total={stats.interviews.total}
          meta={`${stats.interviews.inProgress} in progress`}
          href="/interviews"
        />
      </ContentCard>
    </div>
  );
}
