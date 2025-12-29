'use client';

import { useEffect, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { createInterviewAction } from '@/app/(app)/interviews/actions';
import type { WizardState } from './start-flow-wizard';

interface WizardStepInterviewProps {
  state: WizardState;
  onNext: (updates: Partial<WizardState>) => void;
}

export function WizardStepInterview({ state, onNext }: WizardStepInterviewProps) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.analysisId && !state.interviewId && !isPending) {
      runInterviewGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.analysisId, state.interviewId]);

  const runInterviewGeneration = () => {
    startTransition(async () => {
      const result = await createInterviewAction({
        analysisId: state.analysisId!,
      });

      if (result.error) {
        onNext({ error: result.error, isLoading: false });
      } else if (result.data) {
        onNext({
          interviewId: result.data.id,
          questionCount: result.data.questionCount || null,
          currentStep: 'complete',
          isLoading: false,
        });
      }
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="font-semibold text-lg">Generating interview questions...</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Creating personalized questions based on your analysis
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            AI is generating interview questions...
          </p>
        </div>
      )}
    </div>
  );
}
