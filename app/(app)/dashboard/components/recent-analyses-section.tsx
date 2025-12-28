import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface RecentAnalysesSectionProps {
  analyses: Array<{
    id: string;
    match_score: number;
    created_at: string;
    model: string;
    jd_document: Array<{ title: string }>;
    cv_document: Array<{ title: string }>;
  }>;
}

function getScoreTone(score: number): 'default' | 'secondary' | 'outline' {
  if (score >= 75) return 'default';
  if (score >= 50) return 'secondary';
  return 'outline';
}

export function RecentAnalysesSection({ analyses }: RecentAnalysesSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Analyses</CardTitle>
          <p className="text-xs text-muted-foreground">Your latest match reports</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/analysis">View All →</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyses.map((analysis) => {
            const jdTitle = analysis.jd_document[0]?.title || 'Unknown JD';
            const cvTitle = analysis.cv_document[0]?.title || 'Unknown CV';

            return (
              <div
                key={analysis.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getScoreTone(analysis.match_score)}>
                      {analysis.match_score}/100
                    </Badge>
                    <Link
                      href={`/analysis/${analysis.id}`}
                      className="line-clamp-1 text-sm font-medium hover:underline"
                    >
                      {jdTitle} - {cvTitle}
                    </Link>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(analysis.created_at)} • {analysis.model}
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/analysis/${analysis.id}`}>Open</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
