import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

type ErrorAlertProps = {
  /**
   * The error message to display
   */
  message: string;
  /**
   * Additional CSS classes
   */
  className?: string;
};

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
