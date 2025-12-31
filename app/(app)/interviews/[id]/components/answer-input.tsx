'use client';

import { Check } from 'lucide-react';
import { useState, useTransition } from 'react';

import type { AnswerEvaluation } from '@/lib/ai/schemas';

import { Button } from '@/components/ui/button';
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
          placeholder="Type your answer here... (minimum 10 characters)"
          className="min-h-32 max-h-100 resize-y"
          disabled={isPending}
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{answerText.length} characters</span>
          {answerText.length < 10 && answerText.length > 0 && (
            <span className="text-amber-600">Minimum 10 characters required</span>
          )}
        </div>
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
