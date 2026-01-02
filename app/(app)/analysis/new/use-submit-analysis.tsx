import { useRef, useState } from 'react';

import { SSEEvent } from '@/lib/ai/schemas';

import { createAnalysisAction } from '../actions';
import { INITIAL_STATE, STAGES_MESSAGES, STREAMING_STATES } from './constants';
import type { AnalysisParams, SubmitAnalysisState } from './types';

// Detects if browser supports streaming
const supportsStreaming = () => 'ReadableStream' in (window ?? {});

type Props = {
  onSuccess?: (analysisId: string) => void;
  onError?: (error: string) => void;
};

export const useSubmitAnalysis = ({ onSuccess, onError }: Props) => {
  const [state, setState] = useState<SubmitAnalysisState>(INITIAL_STATE);
  const abortController = useRef<AbortController | null>(null);

  const setPartialState = (state: Partial<SubmitAnalysisState>) => {
    setState((prev) => ({ ...prev, ...state }));
  };

  const handleSSEEvent = (event: SSEEvent, onSuccess?: (analysisId: string) => void) => {
    switch (event.type) {
      case 'started':
        setPartialState({ progress: 5, stage: STAGES_MESSAGES.STARTING });
        break;

      case 'progress':
        setPartialState({ progress: event.data.percent, stage: event.data.stage });
        break;

      case 'section':
        // Update partial results as sections arrive
        setState((state) => ({
          ...state,
          partialResults: {
            ...state.partialResults,
            [event.data.section]: event.data.content,
          },
        }));
        break;

      case 'complete':
        setPartialState({
          progress: 100,
          stage: STAGES_MESSAGES.COMPLETED,
          streamingState: STREAMING_STATES.COMPLETE,
        });
        onSuccess?.(event.data.analysisId);
        break;

      case 'error':
        setPartialState({ streamingState: STREAMING_STATES.ERROR });
        onError?.(event.data.error);
        break;
    }
  };

  // SSE streaming implementation
  const createWithStreaming = async ({ jdId, cvId }: AnalysisParams) => {
    if (!jdId || !cvId) return;

    setState({
      streamingState: STREAMING_STATES.CONNECTING,
      progress: 0,
      stage: STAGES_MESSAGES.STARTING,
      partialResults: {},
    });

    const controller = new AbortController();
    abortController.current = controller;

    try {
      // TODO: update to use SWR
      const response = await fetch('/api/analysis/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdId, cvId }),
        signal: controller.signal,
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

      setPartialState({ streamingState: STREAMING_STATES.STREAMING });

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
              handleSSEEvent(event, onSuccess);
            } catch (err) {
              console.error('Failed to parse SSE event:', eventData, err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setPartialState({ streamingState: STREAMING_STATES.IDLE, progress: 0 });
      } else {
        console.error('Streaming error:', err);
        setPartialState({ streamingState: STREAMING_STATES.ERROR });
        onError?.(err.message || 'Analysis failed');
      }
    } finally {
      abortController.current = null;
    }
  };

  // Fallback to blocking implementation
  const createWithBlocking = async ({ jdId, cvId }: AnalysisParams) => {
    if (!jdId || !cvId) return;

    setPartialState({
      streamingState: STREAMING_STATES.STREAMING,
      progress: 0,
      stage: STAGES_MESSAGES.GENERATING_ANALYSIS,
    });

    const result = await createAnalysisAction({ jdId, cvId });

    if (result.error) {
      setPartialState({ streamingState: STREAMING_STATES.ERROR });
      onError?.(result.error);
    } else if (result.data) {
      setPartialState({ streamingState: STREAMING_STATES.COMPLETE, progress: 100 });
      onSuccess?.(result.data.id);
      return result.data;
    }
  };

  // Main create handler
  const createAnalysis = async (params: AnalysisParams) => {
    await (supportsStreaming() ? createWithStreaming(params) : createWithBlocking(params));
  };

  const cancelStreaming = () => {
    abortController.current?.abort();
    setState(INITIAL_STATE);
  };

  return {
    ...state,
    createAnalysis,
    cancelStreaming,
    isStreaming:
      state.streamingState === STREAMING_STATES.STREAMING ||
      state.streamingState === STREAMING_STATES.CONNECTING,
  };
};
