import { type VariantProps, cva } from 'class-variance-authority';
import { JSX } from 'react';

import { cn } from '@/lib/utils';

const variants = cva('', {
  variants: {
    variant: {
      small: 'text-sm leading-none font-medium',
      muted: 'text-muted-foreground text-sm',
      large: 'text-lg font-semibold',
      lead: 'text-muted-foreground text-xl',
      semibold: 'font-semibold',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

const elements = {
  small: 'small',
  muted: 'p',
  large: 'div',
  lead: 'p',
  semibold: 'p',
  p: 'p',
} as const;

interface Props extends VariantProps<typeof variants> {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography = ({ children, className, variant, as }: Props) => {
  const Component = as || elements[variant || 'p'];
  return <Component className={cn(variants({ variant }), className)}>{children}</Component>;
};
