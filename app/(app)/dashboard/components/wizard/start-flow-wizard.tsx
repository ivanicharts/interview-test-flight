'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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
  const [currentStep, error, isLoading, goBack, reset] = useWizardStore(
    useShallow((state) => [state.currentStep, state.error, state.isLoading, state.goBack, state.reset]),
  );

  const canGoBack = () => currentStep === 1;

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
        <SheetHeader>
          <SheetTitle>Interview Prep Flow</SheetTitle>
          <SheetDescription>Complete the steps below to prepare for your interview</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <WizardStepIndicator currentStep={currentStep} />

          <div className="flex-1 py-6">
            {currentStep === 0 && <WizardStepCV />}
            {currentStep === 1 && <WizardStepJD />}
            {currentStep === 2 && <WizardStepAnalysis />}
            {currentStep === 3 && <WizardStepInterview />}
            {currentStep === 4 && <WizardCompletion onClose={() => handleClose(false)} />}
          </div>

          {error && <ErrorAlert message={error} />}
        </div>

        <SheetFooter className="flex gap-2">
          {canGoBack() && (
            <Button variant="outline" onClick={goBack} disabled={isLoading}>
              Back
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
