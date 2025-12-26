'use client';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-zinc-100">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-400">{error.message}</p>
      <Button onClick={() => reset()} variant="outline" className="mt-6">
        Try again
      </Button>
    </main>
  );
}
