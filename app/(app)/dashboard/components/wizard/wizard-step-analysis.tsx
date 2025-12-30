'use client';

import { useEffect, useTransition } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { createAnalysisAction } from '@/app/(app)/analysis/actions';
import { useWizardStore } from './store/wizard-store';
import { AnalysisLoadingAnimation } from './animations/analysis-generation-animation';

export function WizardStepAnalysis() {
  const cvId = useWizardStore((state) => state.cvId);
  const jdId = useWizardStore((state) => state.jdId);
  const cvTitle = useWizardStore((state) => state.cvTitle);
  const jdTitle = useWizardStore((state) => state.jdTitle);
  const analysisId = useWizardStore((state) => state.analysisId);
  const setAnalysisData = useWizardStore((state) => state.setAnalysisData);
  const setError = useWizardStore((state) => state.setError);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (cvId && jdId && !analysisId && !isPending) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvId, jdId, analysisId]);

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
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold">Analyzing your match...</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Comparing &quot;{cvTitle}&quot; with &quot;{jdTitle}&quot;
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center gap-6 py-8">
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
    </div>
  );
}
