import { redirect } from 'next/navigation';
import {
  getUser,
  getDashboardStats,
  getActiveInterviewSessions,
  getRecentAnalyses,
} from '@/lib/supabase/queries';
import { DashboardClient } from './components/dashboard-client';

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

  const stats = statsResult.data;
  const activeSessions = activeSessionsResult.data ?? [];
  const recentAnalyses = recentAnalysesResult.data ?? [];

  // Check if completely new user
  const hasAnyData = stats.documents.total > 0 || stats.analyses.total > 0 || stats.interviews.total > 0;

  return (
    <DashboardClient
      hasAnyData={hasAnyData}
      stats={stats}
      activeSessions={activeSessions}
      recentAnalyses={recentAnalyses}
    />
  );
}
