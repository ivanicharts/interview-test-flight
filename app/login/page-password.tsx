'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWRMutation from 'swr/mutation';

import { createClient } from '@/lib/supabase/client';
import { useAuthenticate, useTriggerOtpAuth } from '@/lib/auth/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  const { authenticate, isLoading, error } = useAuthenticate();
  const { trigger: triggerOtpAuth } = useTriggerOtpAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await triggerOtpAuth({ email });

    console.log('OTP auth response:', { data, error });

    if (error) {
      console.error('Error triggering OTP auth:', error);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your Supabase Auth email/password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {/* <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button> */}

            <p className="text-muted-foreground text-xs">
              Tip: enable Email/Password provider in Supabase Auth settings.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
