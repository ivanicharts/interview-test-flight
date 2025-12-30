import { Loader2 } from 'lucide-react';

export const DocumentsLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin" />
      <div className="text-sm text-muted-foreground">Loading your documents...</div>
    </div>
  );
};
