import type { StreamingState } from './types';

export const STAGES_MESSAGES = {
  STARTING: 'Starting analysis...',
  GENERATING_ANALYSIS: 'Generating analysis (this may take 30-60 seconds)...',
  COMPLETED: 'Analysis completed!',
} as const;

export const STREAMING_STATES: Record<string, StreamingState> = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  STREAMING: 'streaming',
  COMPLETE: 'complete',
  ERROR: 'error',
} as const;

export const INITIAL_STATE = {
  streamingState: STREAMING_STATES.IDLE,
  progress: 0,
  stage: '',
  partialResults: {},
} as const;
