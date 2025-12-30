'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ErrorAlert } from '@/components/ui/error-alert';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { useWizardStore } from './store/wizard-store';
import { WizardCompletion } from './wizard-completion';
import { WizardStepAnalysis } from './wizard-step-analysis';
import { WizardStepCV } from './wizard-step-cv';
import { WizardStepIndicator } from './wizard-step-indicator';
import { WizardStepInterview } from './wizard-step-interview';
import { WizardStepJD } from './wizard-step-jd';

// Re-export types from store for backwards compatibility
export type { WizardStep, WizardState } from './store/wizard-store';

interface StartFlowWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartFlowWizard({ open, onOpenChange }: StartFlowWizardProps) {
  const [currentStep, error, reset] = useWizardStore(
    useShallow((state) => [state.currentStep, state.error, state.reset]),
  );

  const handleClose = (shouldClose: boolean) => {
    if (shouldClose) {
      reset();
    }
    onOpenChange(shouldClose);
  };

  // Reset state when wizard closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="gap-0 pb-0">
          <SheetTitle>Interview Prep Flow</SheetTitle>
          <SheetDescription>Complete the steps below to prepare for your interview</SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-4">
          <WizardStepIndicator currentStep={currentStep} />
          {error && <ErrorAlert message={error} />}
        </div>

        {currentStep === 0 && <WizardStepCV />}
        {currentStep === 1 && <WizardStepJD />}
        {currentStep === 2 && <WizardStepAnalysis />}
        {currentStep === 3 && <WizardStepInterview />}
        {currentStep === 4 && <WizardCompletion onClose={() => handleClose(false)} />}
      </SheetContent>
    </Sheet>
  );
}
