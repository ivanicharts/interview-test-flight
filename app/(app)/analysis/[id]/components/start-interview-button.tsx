'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { createInterviewAction } from '@/app/(app)/interviews/actions';

export function StartInterviewButton({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);

    startTransition(async () => {
      const result = await createInterviewAction({ analysisId });

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        router.push(`/interviews/${result.data.id}`);
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleStart} loading={isPending} disabled={isPending} size="sm">
        <MessageSquare className="h-4 w-4" />
        Start mock interview
      </Button>
      {error && (
        <div className="border-destructive/60 bg-destructive/10 text-destructive rounded-md border p-2 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
