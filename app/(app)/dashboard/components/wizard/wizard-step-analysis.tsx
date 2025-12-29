'use client';

import { useEffect, useTransition } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createAnalysisAction } from '@/app/(app)/analysis/actions';
import type { WizardState } from './start-flow-wizard';

interface WizardStepAnalysisProps {
  state: WizardState;
  onNext: (updates: Partial<WizardState>) => void;
}

export function WizardStepAnalysis({ state, onNext }: WizardStepAnalysisProps) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.cvId && state.jdId && !state.analysisId && !isPending) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cvId, state.jdId, state.analysisId]);

  const runAnalysis = () => {
    startTransition(async () => {
      const result = await createAnalysisAction({
        jdId: state.jdId!,
        cvId: state.cvId!,
      });

      if (result.error) {
        onNext({ error: result.error, isLoading: false });
      } else if (result.data) {
        onNext({
          analysisId: result.data.id,
          currentStep: 'interview',
          isLoading: false,
        });
      }
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="font-semibold text-lg">Analyzing your match...</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Comparing &quot;{state.cvTitle}&quot; with &quot;{state.jdTitle}&quot;
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            AI is analyzing your CV against job requirements...
          </p>
        </div>
      )}

      {state.analysisId && !isPending && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Analysis complete! Generating interview questions...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
