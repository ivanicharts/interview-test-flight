import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionProps {
  title?: string;
  description?: string;
  header?: React.ReactNode;
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

export function Section({ title, description, header, children, className, maxWidth = '5xl' }: SectionProps) {
  return (
    <div className={`mx-auto w-full ${maxWidthClasses[maxWidth]} p-4 md:p-8 ${className || ''}`}>
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        {(title || description || header) && (
          <CardHeader>
            {header ? (
              header
            ) : (
              <>
                {title && <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>}
                {description && <div className="text-muted-foreground text-sm">{description}</div>}
              </>
            )}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
