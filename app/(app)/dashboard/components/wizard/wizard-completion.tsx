'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WizardState } from './start-flow-wizard';

interface WizardCompletionProps {
  state: WizardState;
  onClose: () => void;
}

export function WizardCompletion({ state, onClose }: WizardCompletionProps) {
  const router = useRouter();

  const handleStartInterview = () => {
    router.push(`/interviews/${state.interviewId}`);
    onClose();
  };

  return (
    <div className="space-y-6 text-center">
      <div className="rounded-full bg-green-500/10 p-4 mx-auto w-fit">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <div>
        <h3 className="text-xl font-semibold">All Set!</h3>
        <p className="text-muted-foreground mt-2">
          Your interview prep is ready.{' '}
          {state.questionCount ? `${state.questionCount} questions generated.` : ''}
        </p>
      </div>

      <div className="space-y-2 text-sm text-left bg-muted/20 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>CV: {state.cvTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>JD: {state.jdTitle}</span>
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

      <div className="flex flex-col gap-2">
        <Button onClick={handleStartInterview} size="lg">
          Start Interview
        </Button>
        <Button variant="outline" onClick={onClose}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
