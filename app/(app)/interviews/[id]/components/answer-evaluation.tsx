'use client';

import { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pill, type PillProps } from '@/components/ui/pill';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { AnswerEvaluation } from '@/lib/ai/schemas';

interface AnswerEvaluationProps {
  evaluation: AnswerEvaluation;
  className?: string;
}

const tierConfig = {
  strong: { icon: CheckCircle2, label: 'Strong Answer', tone: 'good' as const },
  adequate: { icon: TrendingUp, label: 'Adequate Answer', tone: 'warn' as const },
  weak: { icon: AlertCircle, label: 'Weak Answer', tone: 'warn' as const },
  insufficient: { icon: XCircle, label: 'Insufficient', tone: 'bad' as const },
};

function getScoreTone(score: number): PillProps['tone'] {
  if (score >= 75) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
}

export function AnswerEvaluation({ evaluation, className }: AnswerEvaluationProps) {
  const [showDetails, setShowDetails] = useState(false);

  const scoreTone = getScoreTone(evaluation.score);
  const tierInfo = tierConfig[evaluation.tier];
  const TierIcon = tierInfo.icon;

  return (
    <div className={cn('space-y-4 rounded-lg border border-border/60 bg-muted/20 p-4', className)}>
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TierIcon
            className={cn(
              'h-5 w-5',
              scoreTone === 'good' && 'text-green-600 dark:text-green-400',
              scoreTone === 'warn' && 'text-amber-600 dark:text-amber-400',
              scoreTone === 'bad' && 'text-rose-600 dark:text-rose-400',
            )}
          />
          <div>
            <div className="text-sm font-medium">AI Evaluation</div>
            <div className="text-xs text-muted-foreground">{tierInfo.label}</div>
          </div>
        </div>
        <Pill tone={scoreTone} className="text-base font-semibold">
          {evaluation.score}/100
        </Pill>
      </div>

      {/* Score bar */}
      <Progress value={evaluation.score} tone={scoreTone} />

      {/* Summary */}
      <div className="text-sm text-muted-foreground">{evaluation.summary}</div>

      {/* Toggle details button */}
      <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? (
          <>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide Details
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Show Details
          </>
        )}
      </Button>

      {/* Detailed feedback (collapsible) */}
      {showDetails && (
        <div className="space-y-4 border-t pt-4">
          {/* Good signals detected */}
          {evaluation.detectedGoodSignals.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium text-green-700 dark:text-green-400">
                Good Signals Detected
              </div>
              <ul className="space-y-2">
                {evaluation.detectedGoodSignals.map((signal, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-500">✓</span>
                    <div className="flex-1">
                      <div>{signal.signal}</div>
                      {signal.evidence && (
                        <div className="mt-1 text-xs italic text-muted-foreground">
                          &quot;{signal.evidence}&quot;
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bad signals detected */}
          {evaluation.detectedBadSignals.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium text-red-700 dark:text-red-400">Areas of Concern</div>
              <ul className="space-y-2">
                {evaluation.detectedBadSignals.map((signal, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-red-600 dark:text-red-500">✗</span>
                    <div className="flex-1">
                      <div>{signal.signal}</div>
                      {signal.evidence && (
                        <div className="mt-1 text-xs italic text-muted-foreground">
                          &quot;{signal.evidence}&quot;
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missed signals */}
          {evaluation.missedSignals.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Missing Elements</div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {evaluation.missedSignals.map((signal, i) => (
                  <li key={i} className="flex gap-2">
                    <span>○</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement suggestions */}
          {evaluation.improvements.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium">Suggestions for Improvement</div>
              <ul className="space-y-2">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="rounded-md border border-border/60 bg-background p-3 text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{imp.area}</span>
                      <Pill
                        tone={imp.priority === 'high' ? 'bad' : imp.priority === 'medium' ? 'warn' : 'neutral'}
                      >
                        {imp.priority}
                      </Pill>
                    </div>
                    <div className="text-muted-foreground">{imp.suggestion}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-muted-foreground">
            Evaluated by {evaluation.meta.model} • {new Date(evaluation.meta.evaluatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
