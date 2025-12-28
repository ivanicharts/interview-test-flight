'use client';

import * as React from 'react';

import { PageSection } from '@/components/ui/page-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContentSection } from '@/components/ui/content-section';

import { signOutAction } from './actions';

export default function SettingsPage() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  async function signOut() {
    setError(null);
    startTransition(async () => {
      const result = await signOutAction();
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <PageSection title="Settings" description="Account + privacy controls.">
      <div className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <ContentSection title="Account" description="Sign out of this device.">
          <Button variant="destructive" onClick={signOut} loading={isPending}>
            Sign out
          </Button>
        </ContentSection>

        <ContentSection title="Privacy" description='Step 7+: "Delete my data" and "Delete account" flows.'>
          TODO: implement deletion endpoints + confirmations.
        </ContentSection>
      </div>
    </PageSection>
  );
}
