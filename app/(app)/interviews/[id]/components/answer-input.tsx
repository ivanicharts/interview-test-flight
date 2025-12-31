'use client';

import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Check, Mic, MicOff, Settings2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

import type { AnswerEvaluation } from '@/lib/ai/schemas';
import * as config from '@/lib/config';

import { Button } from '@/components/ui/button';
import { CharacterCounter } from '@/components/ui/character-counter';
import { Textarea } from '@/components/ui/textarea';

import { AnswerEvaluation as AnswerEvaluationComponent } from './answer-evaluation';

interface AnswerInputProps {
  sessionId: string;
  questionId: string;
  initialAnswer?: string | null;
  evaluation?: AnswerEvaluation | null;
  onSubmitSuccess?: () => void;
  onSubmitAttempt?: () => void;
  submitAction: (data: {
    sessionId: string;
    questionId: string;
    answerText: string;
  }) => Promise<{ data?: { answerId: string; answerCount: number }; error?: string }>;
}

export function AnswerInput({
  sessionId,
  questionId,
  initialAnswer,
  evaluation,
  onSubmitSuccess,
  onSubmitAttempt,
  submitAction,
}: AnswerInputProps) {
  const [answerText, setAnswerText] = useState(initialAnswer || '');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(initialAnswer ? new Date() : null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoStopEnabled, setAutoStopEnabled] = useState(true);

  const {
    isSupported: isSpeechSupported,
    isListening,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    autoStopOnSilence: autoStopEnabled,
    silenceTimeout: config.ANSWER_SPEECH_TIMEOUT_MS,
    onFinalResult: (transcript?: string) => {
      if (transcript) {
        setAnswerText((prev) => `${prev} ${transcript}`);
      }
    },
  });

  const hasChanges = answerText !== (initialAnswer || '');
  const canSubmit = answerText.trim().length >= 10 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    setError(null);
    onSubmitAttempt?.();

    startTransition(async () => {
      const result = await submitAction({
        sessionId,
        questionId,
        answerText: answerText.trim(),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setLastSaved(new Date());
        onSubmitSuccess?.();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="answer-textarea" className="text-sm font-medium">
            Your Answer
          </label>
          {lastSaved && !hasChanges && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-green-600" />
              Saved
            </div>
          )}
        </div>
        <Textarea
          id="answer-textarea"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder={`Type your answer here... (minimum ${config.MIN_ANSWER_CONTENT_LENGTH} characters)`}
          className="min-h-32 max-h-100 resize-y"
          disabled={isPending}
          minLength={config.MIN_ANSWER_CONTENT_LENGTH}
        />
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSpeechSupported && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon-sm"
                  variant={isListening ? 'destructive' : 'outline'}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isPending}
                  className="h-6 w-6"
                  aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setShowSettings(!showSettings)}
                  disabled={isPending}
                  className="h-6 w-6"
                  aria-label="Voice settings"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <CharacterCounter
              count={answerText.length}
              min={config.MIN_ANSWER_CONTENT_LENGTH}
              max={config.MAX_ANSWER_CONTENT_LENGTH}
            />
          </div>
        </div>

        {/* Listening indicator */}
        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Listening...</span>
            {interimTranscript && (
              <span className="italic text-muted-foreground">&quot;{interimTranscript}&quot;</span>
            )}
          </div>
        )}

        {/* Settings panel */}
        {showSettings && isSpeechSupported && (
          <div className="mt-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Auto-stop on silence</div>
                <div className="text-xs text-muted-foreground">
                  Automatically stop recording after 3 seconds of silence
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAutoStopEnabled(!autoStopEnabled)}
                className="min-w-16"
              >
                {autoStopEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        )}

        {/* Speech errors */}
        {speechError && (
          <div className="mt-2 rounded-md border border-amber-600/60 bg-amber-600/10 p-2 text-xs text-amber-600">
            {speechError}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!canSubmit} loading={isPending}>
          {initialAnswer ? 'Update Answer' : 'Submit Answer'}
        </Button>
        {hasChanges && initialAnswer && (
          <Button variant="outline" onClick={() => setAnswerText(initialAnswer)} disabled={isPending}>
            Reset
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {evaluation && <AnswerEvaluationComponent evaluation={evaluation} className="mt-4" />}
    </div>
  );
}
