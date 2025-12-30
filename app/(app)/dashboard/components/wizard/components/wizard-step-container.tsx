export const WizardStepContainer = ({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <div className="space-y-4 flex flex-col flex-1">
      <div className="px-4 space-y-4 flex flex-col flex-1">{children}</div>
      {footer && (
        <div className="mt-4 flex flex-row gap-2 justify-between sticky bottom-0 left-0 right-0 p-4 bg-background border-t ">
          {footer}
        </div>
      )}
    </div>
  );
};
