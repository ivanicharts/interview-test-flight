import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { WizardStep } from './start-flow-wizard';

const stepLabels: Record<WizardStep, string> = {
  cv: '1. CV',
  jd: '2. JD',
  analysis: '3. Analysis',
  interview: '4. Interview',
  complete: '5. Complete',
};

const progressPercent: Record<WizardStep, number> = {
  cv: 20,
  jd: 40,
  analysis: 60,
  interview: 80,
  complete: 100,
};

interface WizardStepIndicatorProps {
  currentStep: WizardStep;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <div className="space-y-3">
      <Progress value={progressPercent[currentStep]} />
      <div className="flex items-center justify-between gap-2 text-xs">
        {Object.entries(stepLabels).map(([step, label]) => (
          <Badge
            key={step}
            variant={currentStep === step ? 'default' : 'secondary'}
            className="text-[10px]"
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
