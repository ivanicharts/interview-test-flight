import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function PageSection({
  title,
  description,
  header,
  children,
  actions,
  className,
  maxWidth = '5xl',
}: SectionProps) {
  return (
    <div className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${className || ''}`}>
      <Card className="gap-3 border-none bg-transparent py-0 shadow-none md:gap-6">
        {(title || description || header) && (
          <CardHeader className="gap-0 px-0">
            {(title || description) && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  {title && <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>}
                  {description && <div className="text-muted-foreground text-sm">{description}</div>}
                </div>
                {actions}
              </div>
            )}
            {header}
          </CardHeader>
        )}
        <CardContent className="px-0">{children}</CardContent>
      </Card>
    </div>
  );
}
