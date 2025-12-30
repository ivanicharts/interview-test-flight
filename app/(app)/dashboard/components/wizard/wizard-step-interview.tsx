'use client';

import { createInterviewAction } from '@/app/(app)/interviews/actions';
import Link from 'next/link';
import { useTransition } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';

import { InterviewGenerationAnimation } from './animations/interview-generation-animation';
import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

export function WizardStepInterview() {
  const [isPending, startTransition] = useTransition();

  const [analysisId, interviewId, setInterviewData, setError] = useWizardStore(
    useShallow((state) => [state.analysisId, state.interviewId, state.setInterviewData, state.setError]),
  );

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
    <WizardStepContainer
      className="space-y-6 text-center mt-10"
      footer={
        <>
          <Button asChild variant="secondary">
            <Link target="_blank" href={`/analysis/${analysisId}`}>
              Open Analysis Report
            </Link>
          </Button>
          {interviewId ? (
            <Button loading={isPending}>Start Interview</Button>
          ) : (
            <Button onClick={runInterviewGeneration} loading={isPending}>
              Generate Questions
            </Button>
          )}
        </>
      }
    >
      {!isPending && !interviewId && (
        <div>
          <h3 className="text-lg font-semibold">Ready to generate your interview questions?</h3>
          <p className="text-muted-foreground text-sm">
            We will create personalized questions based on your analysis
          </p>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col items-center gap-6 py-8">
          <div>
            <h3 className="text-lg font-semibold">Generating interview questions...</h3>
            <p className="text-muted-foreground text-sm">
              Creating personalized questions based on your analysis
            </p>
          </div>

          {/* Animated Question Generation Visualization */}
          <InterviewGenerationAnimation />

          <p className="text-muted-foreground animate-pulse text-sm">
            AI is generating interview questions...
          </p>
        </div>
      )}
    </WizardStepContainer>
  );
}
