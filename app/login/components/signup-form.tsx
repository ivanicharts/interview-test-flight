'use client';

import { useState } from 'react';

import { usePasswordSignUp } from '@/lib/auth/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = { onSuccess: () => void; onLoginClick: () => void };

export default function SignupForm({ onSuccess, onLoginClick }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { trigger: signUp, isMutating: isLoading } = usePasswordSignUp();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    onSuccess();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign up with email</CardTitle>
        <CardDescription>
          Already have an account?{' '}
          <Button variant="inline-link" size="inline" onClick={onLoginClick}>
            Sign in
          </Button>
        </CardDescription>
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
