import { redirect } from 'next/navigation';

import {
  getActiveInterviewSessions,
  getDashboardStats,
  getRecentAnalyses,
  getUser,
} from '@/lib/supabase/queries';

import { DashboardPage } from './components/dashboard-page';

export default async function DashboardPageWrapper() {
  const { user } = await getUser();
  if (!user) redirect('/login');

  // Parallel data fetching
  const [statsResult, activeSessionsResult, recentAnalysesResult] = await Promise.all([
    getDashboardStats(),
    getActiveInterviewSessions(),
    getRecentAnalyses(3),
  ]);

  const stats = statsResult.data;
  const activeSessions = activeSessionsResult.data ?? [];
  const recentAnalyses = recentAnalysesResult.data ?? [];

  // Check if completely new user
  const hasAnyData = stats.documents.total > 0 || stats.analyses.total > 0 || stats.interviews.total > 0;

  return (
    <DashboardPage
      hasAnyData={hasAnyData}
      stats={stats}
      activeSessions={activeSessions}
      recentAnalyses={recentAnalyses}
    />
  );
}
