import { cn } from '@/lib/utils';

export const WizardStepContainer = ({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="space-y-4 flex flex-col flex-1">
      <div className={cn('px-4 space-y-4 flex flex-col flex-1', className)}>{children}</div>
      {footer && (
        <div className="mt-4 flex flex-row gap-2 justify-between sticky bottom-0 left-0 right-0 p-4 bg-background border-t ">
          {footer}
        </div>
      )}
    </div>
  );
};
