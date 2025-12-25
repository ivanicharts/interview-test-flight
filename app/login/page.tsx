'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { LinkButton } from '@/components/ui/button';

import LoginForm from './components/login-form';
import SignupForm from './components/signup-form';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  const [step, setStep] = useState<'login' | 'signup'>('login');

  const onSuccess = () => {
    router.replace(next);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {step === 'login' ? (
        <LoginForm onSuccess={onSuccess} onSignupClick={() => setStep('signup')} />
      ) : (
        <SignupForm onSuccess={onSuccess} onLoginClick={() => setStep('login')} />
      )}

      <LinkButton href="/login/otp" variant="inline-link" className="text-muted-foreground text-xs">
        Login via email code
      </LinkButton>
    </div>
  );
}
