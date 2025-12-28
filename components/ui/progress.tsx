'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const progressVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    tone: {
      neutral: 'bg-primary',
      good: 'bg-emerald-500',
      warn: 'bg-amber-500',
      bad: 'bg-rose-500',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
});

export interface ProgressProps
  extends VariantProps<typeof progressVariants>, React.ComponentProps<typeof ProgressPrimitive.Root> {
  className?: string;
}

function Progress({ className, value, tone = 'neutral', ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressVariants({ tone }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
