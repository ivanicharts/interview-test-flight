import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Button } from './button';

type ErrorAlertProps = {
  /**
   * The error message to display
   */
  message: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional retry handler
   */
  onRetry?: () => void;
};

export function ErrorAlert({ message, className, onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn('flex items-center space-between', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="ml-auto">
          Try again
        </Button>
      )}
    </Alert>
  );
}
