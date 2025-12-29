'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageSection } from '@/components/ui/page-section';
import { StatsOverview } from './stats-overview';
import { ActiveSessionsSection } from './active-sessions-section';
import { RecentAnalysesSection } from './recent-analyses-section';
import { EmptyDashboardState } from './empty-dashboard-state';
import { StartFlowWizard } from './wizard/start-flow-wizard';

interface DashboardClientProps {
  hasAnyData: boolean;
  stats: {
    documents: { total: number; jdCount: number; cvCount: number };
    analyses: { total: number; avgScore: number | null };
    interviews: { total: number; inProgress: number };
  };
  activeSessions: Array<{
    id: string;
    status: 'pending' | 'in_progress';
    mode: string;
    plan: any;
    created_at: string;
    analysis: Array<{
      jd_document: Array<{ title: string }>;
      cv_document: Array<{ title: string }>;
    }>;
    progress: {
      total: number;
      answered: number;
    };
  }>;
  recentAnalyses: Array<{
    id: string;
    match_score: number;
    created_at: string;
    model: string;
    jd_document: Array<{ title: string }>;
    cv_document: Array<{ title: string }>;
  }>;
}

export function DashboardClient({
  hasAnyData,
  stats,
  activeSessions,
  recentAnalyses,
}: DashboardClientProps) {
  const [wizardOpen, setWizardOpen] = useState(false);

  if (!hasAnyData) {
    return (
      <>
        <PageSection title="Dashboard" description="Your progress and activity across interview prep">
          <div className="space-y-6">
            <EmptyDashboardState onStartFlow={() => setWizardOpen(true)} />
          </div>
        </PageSection>
        <StartFlowWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      </>
    );
  }

  return (
    <>
      <PageSection
        title="Dashboard"
        description="Your progress and activity across interview prep"
        actions={
          <Button onClick={() => setWizardOpen(true)}>Start New Flow</Button>
        }
      >
        <div className="space-y-6">
          {/* Stats Overview - Always show if data exists */}
          <StatsOverview stats={stats} />

          {/* Active Sessions - Only if in-progress/pending exist */}
          {activeSessions.length > 0 && <ActiveSessionsSection sessions={activeSessions} />}

          {/* Recent Analyses - Only if analyses exist */}
          {recentAnalyses.length > 0 && <RecentAnalysesSection analyses={recentAnalyses} />}
        </div>
      </PageSection>
      <StartFlowWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
}
