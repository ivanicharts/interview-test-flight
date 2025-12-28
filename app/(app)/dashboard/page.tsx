import { redirect } from 'next/navigation';
import {
  getUser,
  getDashboardStats,
  getActiveInterviewSessions,
  getRecentAnalyses,
} from '@/lib/supabase/queries';
import { StatsOverview } from './components/stats-overview';
import { ActiveSessionsSection } from './components/active-sessions-section';
import { RecentAnalysesSection } from './components/recent-analyses-section';
import { EmptyDashboardState } from './components/empty-dashboard-state';
import { PageSection } from '@/components/ui/page-section';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user } = await getUser();
  if (!user) redirect('/login');

  // Parallel data fetching
  const [statsResult, activeSessionsResult, recentAnalysesResult] = await Promise.all([
    getDashboardStats(),
    getActiveInterviewSessions(),
    getRecentAnalyses(3),
  ]);

  console.log('Dashboard data fetched', activeSessionsResult);

  const stats = statsResult.data;
  const activeSessions = activeSessionsResult.data ?? [];
  const recentAnalyses = recentAnalysesResult.data ?? [];

  // Check if completely new user
  const hasAnyData = stats.documents.total > 0 || stats.analyses.total > 0 || stats.interviews.total > 0;

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome to Interview Prep</p>
        </div>
        <EmptyDashboardState />
      </div>
    );
  }

  return (
    <PageSection title="Dashboard" description="Your progress and activity across interview prep">
      <div className="space-y-6">
        {/* Stats Overview - Always show if data exists */}
        <StatsOverview stats={stats} />

        {/* Active Sessions - Only if in-progress/pending exist */}
        {activeSessions.length > 0 && <ActiveSessionsSection sessions={activeSessions} />}

        {/* Recent Analyses - Only if analyses exist */}
        {recentAnalyses.length > 0 && <RecentAnalysesSection analyses={recentAnalyses} />}
      </div>
    </PageSection>
  );
}
