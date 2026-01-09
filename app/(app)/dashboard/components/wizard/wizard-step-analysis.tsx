'use client';

import { StreamingProgress } from '@/app/(app)/analysis/new/components/streaming-progress';
import { useSubmitAnalysis } from '@/app/(app)/analysis/new/use-submit-analysis';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';

import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

export function WizardStepAnalysis() {
  const [cvId, jdId, cvTitle, jdTitle, analysisId] = useWizardStore(
    useShallow((state) => [state.cvId, state.jdId, state.cvTitle, state.jdTitle, state.analysisId]),
  );
  const [setAnalysisData, setError] = useWizardStore(
    useShallow((state) => [state.setAnalysisData, state.setError]),
  );

  const { createAnalysis, isStreaming, isCompleted, stage, progress, partialResults, cancelStreaming } =
    useSubmitAnalysis({
      onSuccess: (analysisId: string) => {
        setTimeout(() => {
          // Delay to allow users to see 100% completion
          setAnalysisData(analysisId);
        }, 3_000);
      },
      onError: (error: string) => {
        console.error('Analysis submission error:', error);
        setError(error);
      },
    });

  const onCreateClick = () => {
    if (jdId && cvId) {
      setError(null);
      createAnalysis({ jdId, cvId });
    }
  };

  return (
    <WizardStepContainer
      className="space-y-6 text-center"
      footer={
        !isCompleted && (
          <Button type="button" onClick={onCreateClick} loading={isStreaming} className="w-full">
            Start analysis
          </Button>
        )
      }
    >
      {!analysisId && !isStreaming && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Ready to analyze your match?</h3>
          <p className="text-muted-foreground text-sm mt-2 mx-auto max-w-md">
            We will compare &quot;{cvTitle}&quot; with &quot;{jdTitle}&quot; to identify key strengths and
            gaps.
          </p>
        </div>
      )}

      {(isStreaming || isCompleted) && (
        <div className="text-left pb-4">
          <StreamingProgress
            percent={progress}
            stage={stage}
            partialResults={partialResults}
            onCancel={isStreaming ? cancelStreaming : undefined}
          />
        </div>
      )}
    </WizardStepContainer>
  );
}
