'use client';

import * as React from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';
import { PageSection } from '@/components/ui/page-section';

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
        {error ? <Alert variant="destructive" description={error} /> : null}

        <ContentCard title="Account" description="Sign out of this device.">
          <Button variant="destructive" onClick={signOut} loading={isPending}>
            Sign out
          </Button>
        </ContentCard>

        <ContentCard title="Privacy" description='Step 7+: "Delete my data" and "Delete account" flows.'>
          TODO: implement deletion endpoints + confirmations.
        </ContentCard>
      </div>
    </PageSection>
  );
}
