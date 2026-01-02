'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import type { SSEEvent } from '@/lib/ai/schemas';
import { Document } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/error-alert';

import { createAnalysisAction } from '../../actions';
import { DocumentPicker } from './dock-picker';
import { StreamingProgress } from './streaming-progress';

type StreamingState = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

export default function AnalysisSubmitForm({ jds, cvs }: { jds: Document[]; cvs: Document[] }) {
  const router = useRouter();

  const [jdId, setJdId] = useState<string | null>(jds[0]?.id ?? null);
  const [cvId, setCvId] = useState<string | null>(cvs[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);

  // Streaming state
  const [streamingState, setStreamingState] = useState<StreamingState>('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [partialResults, setPartialResults] = useState<any>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const canCreate = !!jdId && !!cvId && streamingState === 'idle';
  const isStreaming = streamingState === 'streaming' || streamingState === 'connecting';

  // Detect if browser supports streaming
  const supportsStreaming = () => {
    return typeof window !== 'undefined' && 'ReadableStream' in window;
  };

  // SSE streaming implementation
  const createWithStreaming = async () => {
    if (!jdId || !cvId) return;

    setError(null);
    setStreamingState('connecting');
    setProgress(0);
    setStage('Starting analysis...');
    setPartialResults({});

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/analysis/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdId, cvId }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start analysis');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      setStreamingState('streaming');

      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const eventData = line.slice(6); // Remove 'data: ' prefix
            try {
              const event: SSEEvent = JSON.parse(eventData);
              handleSSEEvent(event);
            } catch (err) {
              console.error('Failed to parse SSE event:', eventData, err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStreamingState('idle');
        setProgress(0);
      } else {
        console.error('Streaming error:', err);
        setError(err.message || 'Analysis failed');
        setStreamingState('error');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Fallback to blocking implementation
  const createWithBlocking = async () => {
    if (!jdId || !cvId) return;

    setError(null);
    setStreamingState('streaming');
    setProgress(0);
    setStage('Generating analysis (this may take 30-60 seconds)...');

    const result = await createAnalysisAction({ jdId, cvId });

    if (result.error) {
      setError(result.error);
      setStreamingState('error');
    } else if (result.data) {
      setStreamingState('complete');
      setProgress(100);
      router.push(`/analysis/${result.data.id}`);
    }
  };

  // Handle SSE events
  const handleSSEEvent = (event: SSEEvent) => {
    switch (event.type) {
      case 'started':
        setProgress(5);
        setStage('Analysis started...');
        break;

      case 'progress':
        setProgress(event.data.percent);
        setStage(event.data.stage);
        break;

      case 'section':
        // Update partial results as sections arrive
        setPartialResults((prev: any) => ({
          ...prev,
          [event.data.section]: event.data.content,
        }));
        break;

      case 'complete':
        setProgress(100);
        setStage('Analysis complete!');
        setStreamingState('complete');
        // Redirect to analysis page
        setTimeout(() => {
          router.push(`/analysis/${event.data.analysisId}`);
        }, 1000);
        break;

      case 'error':
        setError(event.data.error);
        setStreamingState('error');
        if (event.data.retryAfter) {
          setError(`${event.data.error}. Please retry in ${event.data.retryAfter} seconds.`);
        }
        break;
    }
  };

  // Cancel streaming
  const cancelStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStreamingState('idle');
    setProgress(0);
    setPartialResults({});
  };

  // Main create handler
  const create = async () => {
    if (supportsStreaming()) {
      await createWithStreaming();
    } else {
      await createWithBlocking();
    }
  };

  // Show streaming progress if active
  if (isStreaming || streamingState === 'complete') {
    return (
      <StreamingProgress
        percent={progress}
        stage={stage}
        partialResults={partialResults}
        onCancel={isStreaming ? cancelStreaming : undefined}
      />
    );
  }

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
        <Button disabled={!canCreate} onClick={create}>
          Generate report
        </Button>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            setError(null);
            setStreamingState('idle');
          }}
        />
      )}
    </div>
  );
}
