import { cn } from '@/lib/utils';

export const CharacterCounter = ({ count, max, min = 0 }: { count: number; max: number; min?: number }) => {
  if (min && count < min) {
    const colorClass = count < min ? 'text-yellow-600' : 'text-emerald-600';
    return (
      <span className={cn('text-xs text-muted-foreground', count > 0 ? colorClass : '')}>
        {count}/{min} min characters
      </span>
    );
  }

  const colorClass = count > max ? 'text-red-600' : 'text-emerald-600';

  return (
    <span className={cn('text-xs text-muted-foreground', count > 0 ? colorClass : '')}>
      {count}/{max} max characters
    </span>
  );
};
