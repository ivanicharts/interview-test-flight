'use client';

import { useEffect, useTransition } from 'react';
import { createInterviewAction } from '@/app/(app)/interviews/actions';
import { useWizardStore } from './store/wizard-store';
import { InterviewGenerationAnimation } from './animations/interview-generation-animation';

export function WizardStepInterview() {
  const analysisId = useWizardStore((state) => state.analysisId);
  const interviewId = useWizardStore((state) => state.interviewId);
  const setInterviewData = useWizardStore((state) => state.setInterviewData);
  const setError = useWizardStore((state) => state.setError);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (analysisId && !interviewId && !isPending) {
      runInterviewGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId, interviewId]);

  const runInterviewGeneration = () => {
    startTransition(async () => {
      const result = await createInterviewAction({
        analysisId: analysisId!,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setInterviewData(result.data.id, result.data.questionCount);
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
