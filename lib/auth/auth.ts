import useSWRMutation from 'swr/mutation';
import { createClient } from '@/lib/supabase/client';

import { useSupabase } from '@/lib/supabase/supabase-provider';

export const useTriggerOtpAuth = () => {
  const supabase = useSupabase();
  return useSWRMutation<any, any, 'login', { email: string }>('login', async (key, { arg }) => {
    return await supabase.auth.signInWithOtp({
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
      return await supabase.auth.verifyOtp({
        email: arg.email,
        token: arg.token,
        type: 'email',
      });
    },
  );
};

// Custom hook to authenticate a user with email and password
export function useAuthenticate() {
  const {
    trigger: authenticate,
    isMutating,
    error,
  } = useSWRMutation('login', async (key, { arg }) => {
    const supabase = createClient();
    const { email, password } = arg;
    return await supabase.auth.signInWithPassword({ email, password });
  });

  return {
    isLoading: isMutating,
    error,
    authenticate,
  };
}

// Custom hook to sign up a user with email and password
export function useSignUp() {
  const {
    trigger: signUp,
    isMutating,
    error,
  } = useSWRMutation('signup', async (key, { arg }) => {
    const supabase = createClient();
    const { email, password } = arg;
    return await supabase.auth.signUp({ email, password });
  });

  return {
    isLoading: isMutating,
    error,
    signUp,
  };
}

// Custom hook to sign out the current user
export function useSignOut() {
  const {
    trigger: signOut,
    isMutating,
    error,
  } = useSWRMutation('signout', async () => {
    const supabase = createClient();
    return await supabase.auth.signOut();
  });

  return {
    isLoading: isMutating,
    error,
    signOut,
  };
}
