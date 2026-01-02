'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Document } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';

import { STREAMING_STATES } from '../constants';
import { useSubmitAnalysis } from '../use-submit-analysis';
import { DocumentPicker } from './dock-picker';
import { StreamingProgress } from './streaming-progress';

export default function AnalysisSubmitForm({ jds, cvs }: { jds: Document[]; cvs: Document[] }) {
  const router = useRouter();

  const [jdId, setJdId] = useState<string | null>(jds[0]?.id ?? null);
  const [cvId, setCvId] = useState<string | null>(cvs[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);

  const { createAnalysis, isStreaming, streamingState, stage, progress, partialResults, cancelStreaming } =
    useSubmitAnalysis({
      onSuccess: (analysisId: string) => {
        router.push(`/analysis/${analysisId}`);
      },
      onError: (error: string) => {
        console.error('Analysis submission error:', error);
        setError(error);
      },
    });

  // Show streaming progress if active
  if (isStreaming || streamingState === STREAMING_STATES.COMPLETE) {
    return (
      <StreamingProgress
        percent={progress}
        stage={stage}
        partialResults={partialResults}
        onCancel={isStreaming ? cancelStreaming : undefined}
      />
    );
  }

  const onCreateClick = () => {
    if (jdId && cvId) {
      createAnalysis({ jdId, cvId });
    }
  };

  const canCreate = !!jdId && !!cvId && !isStreaming;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <DocumentPicker
          title="Job Description"
          docs={jds}
          selectedId={jdId}
          onSelect={setJdId}
          emptyCtaHref="/documents/new?kind=jd"
          emptyCtaLabel="Add a JD"
        />
        <DocumentPicker
          title="CV"
          docs={cvs}
          selectedId={cvId}
          onSelect={setCvId}
          emptyCtaHref="/documents/new?kind=cv"
          emptyCtaLabel="Add a CV"
        />
      </div>

      <div className="flex gap-2 md:justify-end">
        <Button asChild variant="secondary">
          <Link href="/documents">Manage documents</Link>
        </Button>
        <Button disabled={!canCreate} onClick={onCreateClick}>
          Generate report
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}
    </div>
  );
}
