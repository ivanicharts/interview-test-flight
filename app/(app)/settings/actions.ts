'use server';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export async function signOutAction() {
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect('/login');
}
