'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WizardStepIndicator } from './wizard-step-indicator';
import { WizardStepCV } from './wizard-step-cv';
import { WizardStepJD } from './wizard-step-jd';
import { WizardStepAnalysis } from './wizard-step-analysis';
import { WizardStepInterview } from './wizard-step-interview';
import { WizardCompletion } from './wizard-completion';

export type WizardStep = 'cv' | 'jd' | 'analysis' | 'interview' | 'complete';

export interface WizardState {
  currentStep: WizardStep;
  cvId: string | null;
  cvTitle: string | null;
  jdId: string | null;
  jdTitle: string | null;
  analysisId: string | null;
  interviewId: string | null;
  questionCount: number | null;
  error: string | null;
  isLoading: boolean;
}

interface StartFlowWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartFlowWizard({ open, onOpenChange }: StartFlowWizardProps) {
  const [state, setState] = useState<WizardState>({
    currentStep: 'cv',
    cvId: null,
    cvTitle: null,
    jdId: null,
    jdTitle: null,
    analysisId: null,
    interviewId: null,
    questionCount: null,
    error: null,
    isLoading: false,
  });

  const handleNext = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates, error: null }));
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['cv', 'jd', 'analysis', 'interview', 'complete'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: steps[currentIndex - 1],
        error: null,
      }));
    }
  };

  const canGoBack = () => {
    if (state.currentStep === 'cv') return false;
    if (state.currentStep === 'complete') return false;
    if (state.currentStep === 'interview' || state.currentStep === 'analysis') {
      return state.analysisId === null;
    }
    return true;
  };

  const handleClose = (shouldClose: boolean) => {
    if (shouldClose) {
      setState({
        currentStep: 'cv',
        cvId: null,
        cvTitle: null,
        jdId: null,
        jdTitle: null,
        analysisId: null,
        interviewId: null,
        questionCount: null,
        error: null,
        isLoading: false,
      });
    }
    onOpenChange(shouldClose);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Interview Prep Flow</SheetTitle>
          <SheetDescription>Complete the steps below to prepare for your interview</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <WizardStepIndicator currentStep={state.currentStep} />
        </div>

        <div className="flex-1 px-4 py-6">
          {state.currentStep === 'cv' && <WizardStepCV state={state} onNext={handleNext} />}
          {state.currentStep === 'jd' && <WizardStepJD state={state} onNext={handleNext} />}
          {state.currentStep === 'analysis' && <WizardStepAnalysis state={state} onNext={handleNext} />}
          {state.currentStep === 'interview' && <WizardStepInterview state={state} onNext={handleNext} />}
          {state.currentStep === 'complete' && (
            <WizardCompletion state={state} onClose={() => handleClose(false)} />
          )}
        </div>

        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <SheetFooter className="flex gap-2">
          {canGoBack() && (
            <Button variant="outline" onClick={handleBack} disabled={state.isLoading}>
              Back
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
