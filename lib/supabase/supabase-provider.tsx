'use client';
import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export const SupabaseContext = React.createContext<SupabaseClient | null>(null);

// Supabase browser client provider
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = React.useMemo(() => createClient(), []);
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  return React.useContext(SupabaseContext);
}
