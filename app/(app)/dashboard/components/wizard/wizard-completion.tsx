'use client';

import { Check, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { WizardStepContainer } from './components/wizard-step-container';
import { useWizardStore } from './store/wizard-store';

interface WizardCompletionProps {
  onClose: () => void;
}

export function WizardCompletion({ onClose }: WizardCompletionProps) {
  const interviewId = useWizardStore((state) => state.interviewId);
  const questionCount = useWizardStore((state) => state.questionCount);
  const cvTitle = useWizardStore((state) => state.cvTitle);
  const jdTitle = useWizardStore((state) => state.jdTitle);
  const analysisId = useWizardStore((state) => state.analysisId);

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
          <Button asChild>
            <Link href={`/interviews/${interviewId}`}>Start Interview</Link>
          </Button>
        </>
      }
    >
      <div className="rounded-full bg-green-500/10 p-4 mx-auto w-fit">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <div>
        <h3 className="text-xl font-semibold">All Set!</h3>
        <p className="text-muted-foreground">
          Your interview prep is ready. {questionCount ? `${questionCount} questions generated.` : ''}
        </p>
      </div>

      <div className="space-y-2 text-sm text-left bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>CV: {cvTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>JD: {jdTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Analysis created</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Interview questions ready</span>
        </div>
      </div>
    </WizardStepContainer>
  );
}
