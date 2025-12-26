import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { AppNav } from '@/components/app-nav';
import { Separator } from '@/components/ui/separator';

export function AppShell({ userEmail, children }: { userEmail: string | null; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
              Interview Test Flight
            </Link>
            <span className="text-muted-foreground text-xs">pet project</span>
          </div>

          <div className="flex items-center gap-3">
            {userEmail ? <span className="text-muted-foreground hidden text-sm sm:block">{userEmail}</span> : null}
            <ThemeToggle />
          </div>
        </header>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-6 md:h-[calc(100vh-48px)]">
            <AppNav />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
