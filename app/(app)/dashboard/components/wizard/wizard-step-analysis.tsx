'use client';

import { createAnalysisAction } from '@/app/(app)/analysis/actions';
import { CheckCircle2 } from 'lucide-react';
import { useTransition } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { AnalysisLoadingAnimation } from '../../../analysis/new/components/analysis-generation-animation';
import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

export function WizardStepAnalysis() {
  const [isPending, startTransition] = useTransition();

  const [cvId, jdId, cvTitle, jdTitle, analysisId] = useWizardStore(
    useShallow((state) => [state.cvId, state.jdId, state.cvTitle, state.jdTitle, state.analysisId]),
  );
  const [setAnalysisData, setError] = useWizardStore(
    useShallow((state) => [state.setAnalysisData, state.setError]),
  );

  const runAnalysis = () => {
    startTransition(async () => {
      const result = await createAnalysisAction({
        jdId: jdId!,
        cvId: cvId!,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setAnalysisData(result.data.id);
      }
    });
  };

  return (
    <WizardStepContainer
      className="space-y-6 text-center mt-10"
      footer={
        <Button type="button" onClick={runAnalysis} loading={isPending} className="w-full">
          Start analysis
        </Button>
      }
    >
      {!analysisId && !isPending && (
        <div>
          <h3 className="text-lg font-semibold">Ready to analyze your match?</h3>
          <p className="text-muted-foreground text-sm mt-2 mx-auto max-w-md">
            We will compare &quot;{cvTitle}&quot; with &quot;{jdTitle}&quot; to identify key strengths and
            gaps.
          </p>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col items-center gap-6 py-8">
          <div>
            <h3 className="text-lg font-semibold">Analyzing your match...</h3>
            <p className="text-muted-foreground text-sm  mt-2 mx-auto max-w-md">
              Comparing &quot;{cvTitle}&quot; with &quot;{jdTitle}&quot;
            </p>
          </div>
          {/* Animated Document Comparison Visualization */}
          <AnalysisLoadingAnimation />

          <p className="text-muted-foreground animate-pulse text-sm">
            AI is analyzing your CV against job requirements...
          </p>
        </div>
      )}

      {analysisId && !isPending && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Analysis complete! Generating interview questions...</AlertDescription>
        </Alert>
      )}
    </WizardStepContainer>
  );
}
