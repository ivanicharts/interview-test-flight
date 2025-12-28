import { redirect } from 'next/navigation';
import Link from 'next/link';

import { getUser } from '@/lib/supabase/queries';
import { AppSidebar } from '@/components/app-sidebar';
import { NavActions } from '@/components/nav-actions';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Link href="/dashboard" className="text-sm font-semibold tracking-tight md:text-lg">
              Interview Test Flight
            </Link>
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <span className="text-muted-foreground text-xs">pet project</span>
          </div>
          <div className="ml-auto px-3">
            <NavActions userEmail={user.email ?? null} />
          </div>
        </header>
        <div className="bg-card/60 flex flex-1 flex-col gap-4 px-4 py-6 md:py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
