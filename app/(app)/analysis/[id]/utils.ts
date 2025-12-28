import type { AnalysisResult } from '@/lib/ai/schemas';
import { type PillProps } from '@/components/ui/pill';

export const MATCH_TONE_MAP: Record<AnalysisResult['evidence'][number]['match'], PillProps['tone']> = {
  strong: 'good',
  partial: 'warn',
  missing: 'bad',
};

export const IMPORTANCE_TONE_MAP: Record<
  AnalysisResult['evidence'][number]['importance'],
  PillProps['tone']
> = {
  must: 'bad',
  should: 'warn',
  nice: 'neutral',
};

export const PRIORITY_TONE_MAP: Record<AnalysisResult['gaps'][number]['priority'], PillProps['tone']> = {
  high: 'bad',
  medium: 'warn',
  low: 'neutral',
};

export const getScoreTone = (score: number): PillProps['tone'] => {
  if (score >= 75) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
};
