'use client';

import { useState } from 'react';

import { type InterviewSessionWithProgress } from '@/lib/supabase/queries';

import { Button } from '@/components/ui/button';
import { PageSection } from '@/components/ui/page-section';

import { ActiveSessionsSection } from './active-sessions-section';
import { EmptyDashboardState } from './empty-dashboard-state';
import { RecentAnalysesSection } from './recent-analyses-section';
import { StatsOverview } from './stats-overview';
import { StartFlowWizard } from './wizard/start-flow-wizard';

type Props = {
  hasAnyData: boolean;
  stats: {
    documents: { total: number; jdCount: number; cvCount: number };
    analyses: { total: number; avgScore: number | null };
    interviews: { total: number; inProgress: number };
  };
  activeSessions: Array<InterviewSessionWithProgress>;
  recentAnalyses: Array<{
    id: string;
    match_score: number;
    created_at: string;
    model: string;
    jd_document: Array<{ title: string }>;
    cv_document: Array<{ title: string }>;
  }>;
};

export const DashboardPage = ({ hasAnyData, stats, activeSessions, recentAnalyses }: Props) => {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <PageSection
        title="Dashboard"
        description="Your progress and activity across interview prep"
        actions={<Button onClick={() => setWizardOpen(true)}>Start New Flow</Button>}
      >
        <div className="space-y-6">
          {hasAnyData ? (
            <>
              {/* Stats Overview - Always show if data exists */}
              <StatsOverview stats={stats} />

              {/* Active Sessions - Only if in-progress/pending exist */}
              {activeSessions.length > 0 && <ActiveSessionsSection sessions={activeSessions} />}

              {/* Recent Analyses - Only if analyses exist */}
              {recentAnalyses.length > 0 && <RecentAnalysesSection analyses={recentAnalyses} />}
            </>
          ) : (
            <EmptyDashboardState onStartFlow={() => setWizardOpen(true)} />
          )}
        </div>
      </PageSection>
      <StartFlowWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
};
