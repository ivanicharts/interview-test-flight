'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { usePasswordSignUp } from '@/lib/auth/auth';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type Props = { onSuccess: () => void; onLoginClick: () => void };

export default function SignupForm({ onSuccess, onLoginClick }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { trigger: signUp, isMutating: isLoading } = usePasswordSignUp();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
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
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 h-auto w-auto -translate-y-1/2 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <FieldDescription>Must be at least 6 characters long.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" loading={isLoading}>
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{' '}
                  <Button variant="inline-link" size="inline" onClick={onLoginClick}>
                    Sign in
                  </Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
