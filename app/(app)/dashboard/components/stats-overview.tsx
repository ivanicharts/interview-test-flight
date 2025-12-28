import Link from 'next/link';
import { FileText, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StatsOverviewProps {
  stats: {
    documents: { total: number; jdCount: number; cvCount: number };
    analyses: { total: number; avgScore: number | null };
    interviews: { total: number; inProgress: number };
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Documents Card */}
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">{stats.documents.total}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {stats.documents.jdCount} JDs • {stats.documents.cvCount} CVs
            </p>
          </div>
          <Button asChild variant="link" size="inline">
            <Link href="/documents">View All</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Analyses Card */}
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Analyses</CardTitle>
          <BarChart3 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">{stats.analyses.total}</div>
            {stats.analyses.avgScore !== null ? (
              <p className="text-muted-foreground mt-1 text-xs">
                Avg Score:{' '}
                <Badge variant="secondary" className="ml-1">
                  {stats.analyses.avgScore}/100
                </Badge>
              </p>
            ) : (
              <p className="text-muted-foreground mt-1 text-xs">No analyses yet</p>
            )}
          </div>

          <Button asChild variant="link" size="inline">
            <Link href="/analysis">View All</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Interviews Card */}
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Interviews</CardTitle>
          <MessageSquare className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">{stats.interviews.total}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {stats.interviews.inProgress > 0
                ? `${stats.interviews.inProgress} in progress`
                : 'All completed'}
            </p>
          </div>

          <Button asChild variant="link" size="inline">
            <Link href="/interviews">View All</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
