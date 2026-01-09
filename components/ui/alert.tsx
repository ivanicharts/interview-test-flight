import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-600 dark:text-emerald-500 dark:border-emerald-600/60 dark:bg-emerald-600/10 [&>svg]:text-current *:data-[slot=alert-description]:text-emerald-800/80 *:data-[slot=alert-description]:dark:text-emerald-500',
        destructive:
          'text-destructive border-destructive/60 bg-destructive/10 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function AlertContainer({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

function Alert({ title, description, ...props }: Props & VariantProps<typeof alertVariants>) {
  return (
    <AlertContainer {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </AlertContainer>
  );
}

export { Alert, AlertContainer, AlertTitle, AlertDescription };
