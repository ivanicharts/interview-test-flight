import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { getUser } from '@/lib/supabase/queries';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <AppShell userEmail={user.email ?? null}>{children}</AppShell>;
}
