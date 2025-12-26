'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export function NavActions({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {userEmail ? <span className="text-muted-foreground hidden text-sm sm:block">{userEmail}</span> : null}
      <ThemeToggle />
    </div>
  );
}
