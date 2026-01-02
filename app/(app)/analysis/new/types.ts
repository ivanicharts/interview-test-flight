export type StreamingState = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

export interface PartialResults {
  overallScore?: number;
  summary?: string;
  strengths?: string[];
  gaps?: Array<{ title: string; priority: string }>;
}

export type SubmitAnalysisState = {
  streamingState: StreamingState;
  progress: number;
  stage: string;
  partialResults: PartialResults;
  // error: string | null;
};

export type AnalysisParams = {
  jdId: string;
  cvId: string;
};
