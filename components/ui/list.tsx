import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function List({ className, children, ...props }: ListProps) {
  return (
    <div
      className={cn('divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 p-4', className)} {...props}>
      {children}
    </div>
  );
}

export interface ListItemContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ListItemContent({ className, children, ...props }: ListItemContentProps) {
  return (
    <div className={cn('min-w-0 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export interface ListItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ListItemActions({ className, children, ...props }: ListItemActionsProps) {
  return (
    <div className={cn('flex shrink-0 gap-2', className)} {...props}>
      {children}
    </div>
  );
}
