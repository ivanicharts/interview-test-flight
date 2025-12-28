'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pill, type PillProps } from '@/components/ui/pill';
import { cn } from '@/lib/utils';
import type { InterviewPlan, AnswerEvaluation } from '@/lib/ai/schemas';

import { AnswerInput } from './answer-input';
import { submitAnswerAction } from '../../actions';

interface QuestionWithAnswer {
  id: string;
  order_index: number;
  question_text: string;
  category: string;
  context: string | null;
  rubric: any;
  target_gap: string | null;
  target_strength: string | null;
  answer: {
    answer_text: string | null;
    answer_mode: string;
    evaluation_score: number | null;
    evaluation_result: AnswerEvaluation | null;
    evaluated_at: string | null;
  } | null;
}

interface InterviewPlayerProps {
  plan: InterviewPlan;
  sessionId: string;
  questionsWithAnswers: QuestionWithAnswer[];
}

export function InterviewPlayer({ plan, sessionId, questionsWithAnswers }: InterviewPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRubric, setShowRubric] = useState(false);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(
    new Set(questionsWithAnswers.filter((q) => q.answer?.answer_text).map((q) => q.id)),
  );

  const currentQuestion = plan.questions[currentIndex];
  const currentQuestionData = questionsWithAnswers[currentIndex];
  const totalQuestions = plan.questions.length;
  const answeredCount = answeredQuestionIds.size;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const categoryColors: Record<string, string> = {
    technical: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    behavioral: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    situational: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    'strength-based': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'gap-based': 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  const getScoreTone = (score: number): PillProps['tone'] => {
    if (score >= 75) return 'good';
    if (score >= 50) return 'warn';
    return 'bad';
  };

  const handleAnswerSubmitSuccess = () => {
    // Mark question as answered (optimistic update)
    setAnsweredQuestionIds((prev) => new Set([...prev, currentQuestionData.id]));
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {answeredCount}/{totalQuestions} answered • {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main question card */}
        <div className="space-y-4">
          <div className="space-y-4 rounded-lg border border-border/60 bg-card p-6">
            <div className="flex items-center gap-2">
              <Badge className={categoryColors[currentQuestion.category] || ''} variant="secondary">
                {currentQuestion.category}
              </Badge>
              <span className="text-xs text-muted-foreground">Question {currentIndex + 1}</span>
              {answeredQuestionIds.has(currentQuestionData.id) && (
                <Badge variant="outline" className="gap-1 text-green-700 dark:text-green-400">
                  <Check className="h-3 w-3" />
                  Answered
                </Badge>
              )}
            </div>

            <div className="text-lg font-medium leading-relaxed">{currentQuestion.questionText}</div>

            {currentQuestion.context && (
              <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Context</div>
                {currentQuestion.context}
              </div>
            )}

            {(currentQuestion.targetGap || currentQuestion.targetStrength) && (
              <div className="flex flex-wrap gap-2 text-xs">
                {currentQuestion.targetGap && (
                  <Badge variant="outline" className="text-red-700 dark:text-red-400">
                    Targets gap: {currentQuestion.targetGap}
                  </Badge>
                )}
                {currentQuestion.targetStrength && (
                  <Badge variant="outline" className="text-green-700 dark:text-green-400">
                    Leverages: {currentQuestion.targetStrength}
                  </Badge>
                )}
              </div>
            )}

            {/* Rubric toggle */}
            <div className="border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => setShowRubric(!showRubric)}>
                {showRubric ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Rubric
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Rubric
                  </>
                )}
              </Button>

              {showRubric && (
                <div className="mt-4 space-y-4 rounded-md bg-muted/20 p-4">
                  <div>
                    <div className="mb-2 text-xs font-medium">Scoring Guide</div>
                    <p className="text-sm text-muted-foreground">{currentQuestion.rubric.scoringGuide}</p>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-medium text-green-700 dark:text-green-400">
                      Good Signals
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentQuestion.rubric.goodSignals.map((signal, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-600 dark:text-green-500">✓</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-medium text-red-700 dark:text-red-400">Bad Signals</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentQuestion.rubric.badSignals.map((signal, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-600 dark:text-red-500">✗</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {currentQuestion.rubric.expectedDuration && (
                    <div className="text-xs text-muted-foreground">
                      Expected duration: {currentQuestion.rubric.expectedDuration}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Answer input */}
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <AnswerInput
              sessionId={sessionId}
              questionId={currentQuestionData.id}
              initialAnswer={currentQuestionData.answer?.answer_text}
              evaluation={currentQuestionData.answer?.evaluation_result}
              submitAction={submitAnswerAction}
              onSubmitSuccess={handleAnswerSubmitSuccess}
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              disabled={currentIndex === totalQuestions - 1}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timeline sidebar */}
        <div className="space-y-4">
          <div className="sticky top-4 rounded-lg border border-border/60 bg-card p-4">
            <div className="mb-3 text-sm font-medium">Timeline</div>
            <div className="space-y-2">
              {plan.questions.map((question, index) => {
                const questionData = questionsWithAnswers[index];
                const isAnswered = answeredQuestionIds.has(questionData.id);

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'flex w-full flex-col gap-1 rounded-md border p-3 text-left transition',
                      currentIndex !== index && 'cursor-pointer hover:bg-muted/30',
                      currentIndex === index
                        ? 'border-primary/30 bg-muted'
                        : 'border-border/60 bg-background',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Q{index + 1}</span>
                      <Badge
                        className={cn('text-[10px]', categoryColors[question.category] || '')}
                        variant="secondary"
                      >
                        {question.category}
                      </Badge>
                      {isAnswered && <Check className="ml-auto h-3 w-3 text-green-600 dark:text-green-400" />}
                      {questionData.answer?.evaluation_score !== null && questionData.answer?.evaluation_score !== undefined && (
                        <Pill tone={getScoreTone(questionData.answer.evaluation_score)} className="ml-auto text-[10px]">
                          {questionData.answer.evaluation_score}
                        </Pill>
                      )}
                    </div>
                    <div className="line-clamp-2 text-xs">{question.questionText}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overview section */}
      <div className="rounded-lg border border-border/60 bg-card p-6">
        <div className="mb-3 text-sm font-medium">Interview Overview</div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">Focus</div>
            <p className="text-muted-foreground">{plan.overview.focusRationale}</p>
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">Balance</div>
            <p className="text-muted-foreground">{plan.overview.balanceRationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
