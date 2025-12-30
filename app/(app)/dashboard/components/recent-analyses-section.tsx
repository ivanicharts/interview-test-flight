import Link from 'next/link';

import { Analysis } from '@/lib/supabase/queries';

import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';

import { AnalysesList } from '../../analysis/components/analyses-list';

type Props = {
  analyses: Analysis[];
};

export function RecentAnalysesSection({ analyses }: Props) {
  return (
    <ContentCard
      title="Recent Analyses"
      description="Your latest match reports"
      label={
        <Button asChild variant="ghost" size="sm">
          <Link href="/analysis">View All →</Link>
        </Button>
      }
    >
      <div className="mt-6">
        <AnalysesList analyses={analyses} />
      </div>
    </ContentCard>
  );
}
