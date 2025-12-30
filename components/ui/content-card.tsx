import { cn } from '@/lib/utils';

export const ContentCard = ({
  title,
  description,
  label,
  children,
  borderless = false,
  borderlessMobile = false,
}: {
  title?: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
  children: React.ReactNode;
  borderless?: boolean;
  borderlessMobile?: boolean;
}) => (
  <section
    className={cn(
      'items space-y-2',
      // 'md:bg-card md:rounded-xl md:border md:p-5',
      !borderless && 'md:bg-card md:rounded-xl md:border md:p-5',
      !borderless && !borderlessMobile && 'bg-card rounded-xl border p-4',
    )}
  >
    <div>
      {title || label ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {label}
        </div>
      ) : null}
      {description ? <div className="text-muted-foreground text-sm">{description}</div> : null}
    </div>
    {children}
  </section>
);
