import { Progress } from '@/components/ui/progress';
import { Typography } from '@/components/ui/typography';

const stepLabels = ['CV', 'Job Description', 'Analysis', 'Interview', 'Complete'];

type Props = {
  currentStep: number;
};

export const WizardStepIndicator = ({ currentStep }: Props) => {
  return (
    <div>
      <div className="flex flex-col mb-4">
        <Typography variant="muted">
          Step {currentStep + 1} of {stepLabels.length}
        </Typography>
        <Typography variant="semibold">{stepLabels[currentStep]}</Typography>
      </div>
      <Progress value={((currentStep + 1) / stepLabels.length) * 100} />
    </div>
  );
};
