'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import LoginForm from './components/login-form';
import SignupForm from './components/signup-form';

function LoginContent() {
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
