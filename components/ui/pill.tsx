import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pillVariants = cva('inline-flex items-center rounded-full px-2 py-0.5 text-xs', {
  variants: {
    tone: {
      neutral: 'bg-zinc-500/15 text-zinc-700 ring-1 ring-zinc-500/30 dark:text-zinc-200',
      good: 'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-200',
      warn: 'bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-200',
      bad: 'bg-rose-500/15 text-rose-700 ring-1 ring-rose-500/30 dark:text-rose-200',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
});

export interface PillProps extends VariantProps<typeof pillVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Pill({ children, tone, className }: PillProps) {
  return <span className={cn(pillVariants({ tone }), className)}>{children}</span>;
}
