import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg space-y-2 border p-3 md:p-4', {
  variants: {
    variant: {
      default: 'bg-muted/50',
      secondary: 'bg-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const ReportCard = ({
  title,
  subtitle,
  description,
  label,
  children,
  className,
  variant,
  as: Component = 'div',
}: {
  title?: string;
  subtitle?: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
} & VariantProps<typeof cardVariants>) => {
  return (
    <Component className={cn(cardVariants({ variant }), className)}>
      <div>
        {(title || label) && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 font-medium">{title}</div>
            <div className="flex shrink-0 gap-1">{label}</div>
          </div>
        )}
        {subtitle && <div className="text-sm font-medium">{subtitle}</div>}
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children}
    </Component>
  );
};
