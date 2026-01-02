'use client';

import { Check, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';
import { Progress } from '@/components/ui/progress';

interface StreamingProgressProps {
  percent: number;
  stage: string;
  partialResults?: {
    overallScore?: number;
    summary?: string;
    strengths?: string[];
    gaps?: Array<{ title: string; priority: string }>;
  };
  onCancel?: () => void;
  className?: string;
}

export function StreamingProgress({
  percent,
  stage,
  partialResults,
  onCancel,
  className,
}: StreamingProgressProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar and stage */}
      <ContentCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Generating Analysis Report</h3>
              <p className="text-sm text-muted-foreground">{stage}</p>
            </div>
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 text-muted-foreground hover:text-destructive"
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <Progress value={percent} tone="neutral" className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percent}% complete</span>
              <span>{percent < 100 ? 'In progress...' : 'Complete'}</span>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Partial results */}
      {partialResults && (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
          {/* Overall Score */}
          {partialResults.overallScore !== undefined && (
            <ContentCard
              title="Match Score"
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">{partialResults.overallScore}</span>
                  <span className="text-muted-foreground">/100</span>
                </div>
                <Progress
                  value={partialResults.overallScore}
                  tone={
                    partialResults.overallScore >= 75
                      ? 'good'
                      : partialResults.overallScore >= 50
                        ? 'warn'
                        : 'bad'
                  }
                  className="flex-1"
                />
              </div>
            </ContentCard>
          )}

          {/* Summary */}
          {partialResults.summary && (
            <ContentCard
              title="Summary"
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <p className="text-sm leading-relaxed">{partialResults.summary}</p>
            </ContentCard>
          )}

          {/* Strengths */}
          {partialResults.strengths && partialResults.strengths.length > 0 && (
            <ContentCard
              title="Key Strengths"
              description={`${partialResults.strengths.length} strength${partialResults.strengths.length === 1 ? '' : 's'} identified`}
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <ul className="space-y-2">
                {partialResults.strengths.slice(0, 5).map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{strength}</span>
                  </li>
                ))}
                {partialResults.strengths.length > 5 && (
                  <li className="text-xs text-muted-foreground">
                    +{partialResults.strengths.length - 5} more...
                  </li>
                )}
              </ul>
            </ContentCard>
          )}

          {/* Top Gaps */}
          {partialResults.gaps && partialResults.gaps.length > 0 && (
            <ContentCard
              title="Priority Gaps"
              description="Top areas to address"
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            >
              <ul className="space-y-2">
                {partialResults.gaps.slice(0, 3).map((gap, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span
                      className={cn(
                        'mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-semibold',
                        gap.priority === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : gap.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                      )}
                    >
                      {gap.priority === 'high' ? 'H' : gap.priority === 'medium' ? 'M' : 'L'}
                    </span>
                    <span>{gap.title}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          )}
        </div>
      )}

      {/* Completion state (hidden until 100%) */}
      {percent === 100 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          <Check className="h-4 w-4" />
          <span>Analysis complete! Redirecting...</span>
        </div>
      )}
    </div>
  );
}
