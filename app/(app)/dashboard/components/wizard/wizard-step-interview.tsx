'use client';

import { useEffect, useTransition } from 'react';
import { createInterviewAction } from '@/app/(app)/interviews/actions';

import type { WizardState } from './start-flow-wizard';
import { InterviewGenerationAnimation } from './animations/interview-generation-animation';

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
        <h3 className="text-lg font-semibold">Generating interview questions...</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Creating personalized questions based on your analysis
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Animated Question Generation Visualization */}
          <InterviewGenerationAnimation />

          <p className="text-muted-foreground animate-pulse text-sm">
            AI is generating interview questions...
          </p>
        </div>
      )}
    </div>
  );
}
