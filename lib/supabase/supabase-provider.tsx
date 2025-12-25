'use client';
import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

export const SupabaseContext = React.createContext<any>(null);

// Supabase browser client provider
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = React.useMemo(() => createClient(), []);
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  return React.useContext(SupabaseContext);
}
