'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// import { LoginForm } from '@/components/login-form';
// import { SignupForm } from '@/components/signup-form';

import { Button } from '@/components/ui/button';

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
      {/* <LoginForm className="w-full max-w-md" /> */}
      {/* {step === 'login' ? <LoginForm /> : <SignupForm />} */}

      {step === 'login' ? (
        <LoginForm onSuccess={onSuccess} onSignupClick={() => setStep('signup')} />
      ) : (
        <SignupForm onSuccess={onSuccess} onLoginClick={() => setStep('login')} />
      )}
    </div>
  );
}
