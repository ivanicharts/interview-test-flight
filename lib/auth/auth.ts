import useSWRMutation from 'swr/mutation';
import { createClient } from '@/lib/supabase/client';

import { useSupabase } from '@/lib/supabase/supabase-provider';

export const useTriggerOtpAuth = () => {
  const supabase = useSupabase();
  return useSWRMutation<any, any, 'login', { email: string }>('login', async (key, { arg }) => {
    return await supabase?.auth.signInWithOtp({
      email: arg.email,
      options: {
        // If the project is configured for magic links, this redirect matters.
        // If configured for OTP codes, users will enter the code on this page.
        // emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,

        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
      },
    });
  });
};

export const useVerifyOtpAuth = () => {
  const supabase = useSupabase();
  return useSWRMutation<any, any, 'verify-otp', { email: string; token: string }>(
    'verify-otp',
    async (key, { arg }) => {
      return await supabase?.auth.verifyOtp({
        email: arg.email,
        token: arg.token,
        type: 'email',
      });
    },
  );
};

// Custom hook to authenticate a user with email and password
export function usePasswordAuth() {
  const supabase = useSupabase();
  return useSWRMutation<any, any, 'login', { email: string; password: string }>('login', async (key, { arg }) => {
    const { email, password } = arg;
    return await supabase?.auth.signInWithPassword({ email, password });
  });
}

// Custom hook to sign up a user with email and password
export function usePasswordSignUp() {
  const supabase = createClient();
  return useSWRMutation<any, any, 'signup', { email: string; password: string }>('signup', async (key, { arg }) => {
    const { email, password } = arg;
    return await supabase.auth.signUp({ email, password });
  });
}

// Custom hook to sign out the current user
export function useSignOut() {
  const supabase = createClient();
  return useSWRMutation('signout', async () => {
    return await supabase.auth.signOut();
  });
}
