'use client';

import Link from 'next/link';
import { useState } from 'react';

import { usePasswordAuth } from '@/lib/auth/auth';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type Props = { onSuccess: () => void; onSignupClick: () => void };

export default function LoginForm({ onSuccess, onSignupClick }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { trigger: login, isMutating: isLoading } = usePasswordAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await login({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    onSuccess();
  }

  return (
    <Card className="flex w-full max-w-md flex-col gap-6">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {error ? <Alert variant="destructive" description={error} /> : null}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Button asChild variant="link" size="inline" className="ml-auto inline-block">
                  <Link href="/login/otp">Forgot your password?</Link>
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Field>
            <Field>
              <Button type="submit" loading={isLoading}>
                Login
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Button variant="inline-link" size="inline" onClick={onSignupClick}>
                  Sign up
                </Button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
