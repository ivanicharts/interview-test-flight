'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTriggerOtpAuth, useVerifyOtpAuth } from '@/lib/auth/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import RequestForm from './components/request-form';
import SubmitForm from './components/submit-form';

type Step = 'request' | 'verify';

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); // simple email format check
};

const isValidToken = (token: string) => {
  return /^\d{8}$/.test(token); // simple 6-digit check
};

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  const { trigger: triggerOtpAuth, isMutating: isTriggeringOtp } = useTriggerOtpAuth();
  const { trigger: verifyOtpAuth, isMutating: isVerifyingOtp } = useVerifyOtpAuth();

  const [step, setStep] = React.useState<Step>('request');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const sendCode = async (newEmail: string, e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const cleanEmail = newEmail.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email.');
      return;
    }

    setEmail(cleanEmail);

    const { error, ...r } = await triggerOtpAuth({ email: cleanEmail });

    console.log('Trigger OTP response:', r, error);

    if (error) {
      setError(error.message);
      return;
    }

    setStep('verify');
  };

  const retrySendCode = async () => {
    setError(null);
    await sendCode(email);
  };

  const verifyCode = async (token: string, e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanToken = token.replace(/\s+/g, '');

    if (!isValidToken(cleanToken)) {
      setError('Enter the 6-digit code.');
      return;
    }

    const { data, error } = await verifyOtpAuth({ email, token: cleanToken });

    if (error) {
      setError(error.message);
      return;
    }

    // If successful, you now have a session in the browser client.
    // Proxy + server components will see it via cookies on next navigation.
    if (!data?.session) {
      // Rare, but be explicit.
      setError('Signed in, but no session was returned. Please try again.');
      return;
    }

    router.replace(next);
    router.refresh();
  };

  function resetToRequest() {
    setStep('request');
    setEmail('');
    setError(null);
  }

  const loading = isTriggeringOtp || isVerifyingOtp;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            {step === 'request'
              ? 'Enter your email to receive a sign-in code.'
              : 'Enter the 6-digit code sent to your email.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'request' ? (
            <RequestForm onSubmit={sendCode} loading={loading} />
          ) : (
            <SubmitForm
              email={email}
              onSubmit={verifyCode}
              loading={loading}
              onRetry={retrySendCode}
              onGoBack={resetToRequest}
            />
          )}

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
