import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Step 4: show empty states. Step 5+ you’ll load from DB.
  const hasAny = false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your JDs, analyses, and interview sessions.</p>
      </div>

      {!hasAny ? (
        <div className="grid gap-4">
          <EmptyState
            title="No Job Descriptions yet"
            description="Create a JD, paste your CV, then run analysis and start a mock interview."
            ctaLabel="Create JD"
            ctaHref="/jd/new"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">TODO: list JDs</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">TODO: list sessions</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
