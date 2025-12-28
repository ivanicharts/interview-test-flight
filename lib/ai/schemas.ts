import { z } from 'zod';

import { validationConfig } from '../config';

// Schema for the analyze request payload
export const AnalyzeRequestSchema = z.object({
  jdText: z.string().min(validationConfig.minJdLength).max(validationConfig.maxJdLength),
  cvText: z.string().min(validationConfig.minCvLength).max(validationConfig.maxCvLength),
});

// Schema for the match report returned by the AI analysis
export const MatchReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z
    .array(
      z.object({
        category: z.string(),
        score: z.number().min(0).max(100),
        weight: z.number().min(0).max(1),
        rationale: z.string(),
      }),
    )
    .min(3),
  matchedEvidence: z.array(
    z.object({
      requirement: z.string(),
      evidence: z.string(),
      confidence: z.number().min(0).max(1),
    }),
  ),
  gaps: z.array(
    z.object({
      requirement: z.string(),
      whyItMatters: z.string(),
      suggestion: z.string(),
    }),
  ),
  rewriteSuggestions: z.array(
    z.object({
      improvedBullet: z.string(),
      targetRequirement: z.string(),
    }),
  ),
  metadata: z.object({
    createdAt: z.string(), // ISO
    latencyMs: z.number().optional().nullable(),
    model: z.string().optional().nullable(),
  }),
});

export type MatchReport = z.infer<typeof MatchReportSchema>;

export const AnalysisResultSchema = z.object({
  version: z.literal('1.0'),

  overallScore: z.number().int().min(0).max(100),
  summary: z.string().min(1).max(1200),
  strengths: z.array(z.string().min(1).max(200)).max(12),

  evidence: z
    .array(
      z.object({
        requirement: z.string().min(1).max(240),
        importance: z.enum(['must', 'should', 'nice']),
        jdEvidence: z.string().min(1).max(500),

        match: z.enum(['strong', 'partial', 'missing']),
        cvEvidence: z.string().max(600).nullable(),
        notes: z.string().max(400).optional().nullable(),
      }),
    )
    .max(40),

  gaps: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        whyItMatters: z.string().min(1).max(500),
        priority: z.enum(['high', 'medium', 'low']),
        suggestions: z.array(z.string().min(1).max(200)).min(1).max(8),
      }),
    )
    .max(20),

  rewriteSuggestions: z.object({
    headline: z.string().max(160).optional().nullable(),
    summaryBullets: z.array(z.string().min(1).max(220)).min(3).max(8),
    experienceBullets: z
      .array(
        z.object({
          section: z.string().min(1).max(120),
          after: z.string().min(1).max(260),
          rationale: z.string().min(1).max(220),
        }),
      )
      .min(2)
      .max(12),
    keywordAdditions: z.array(z.string().min(1).max(60)).max(30),
  }),

  meta: z.object({
    model: z.string(),
    inputChars: z.object({
      jd: z.number().int().nonnegative(),
      cv: z.number().int().nonnegative(),
    }),
    generatedAt: z.string(), // ISO timestamp
    warnings: z.array(z.string().max(200)),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ==================== Interview Schemas ====================

export const RubricItemSchema = z.object({
  signal: z.string().min(1).max(200),
  tone: z.enum(['good', 'bad', 'neutral']),
});

export const QuestionRubricSchema = z.object({
  scoringGuide: z.string().min(1).max(600),
  goodSignals: z.array(z.string().min(1).max(200)).min(2).max(8),
  badSignals: z.array(z.string().min(1).max(200)).min(2).max(8),
  expectedDuration: z.string().max(60).optional().nullable(),
});

export const InterviewQuestionSchema = z.object({
  category: z.enum(['technical', 'behavioral', 'situational', 'strength-based', 'gap-based']),
  questionText: z.string().min(10).max(800),
  context: z.string().max(400).optional().nullable(),
  rubric: QuestionRubricSchema,
  targetGap: z.string().max(120).optional().nullable(),
  targetStrength: z.string().max(200).optional().nullable(),
});

export const InterviewPlanSchema = z.object({
  version: z.literal('1.0'),
  roleTitle: z.string().min(1).max(200),
  difficulty: z.enum(['entry', 'mid', 'senior', 'lead']),
  questions: z.array(InterviewQuestionSchema).min(8).max(12),
  overview: z.object({
    focusRationale: z.string().min(1).max(800),
    balanceRationale: z.string().min(1).max(600),
  }),
  meta: z.object({
    model: z.string(),
    generatedAt: z.string(),
    basedOnAnalysisScore: z.number().int().min(0).max(100),
  }),
});

export type RubricItem = z.infer<typeof RubricItemSchema>;
export type QuestionRubric = z.infer<typeof QuestionRubricSchema>;
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;
export type InterviewPlan = z.infer<typeof InterviewPlanSchema>;

export const CreateInterviewRequestSchema = z.object({
  analysisId: z.string().uuid(),
  mode: z.enum(['text', 'audio']).optional().default('text'),
  focusAreas: z.array(z.string()).optional(),
});

// ==================== Interview Answer Schemas ====================

export const SubmitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerText: z.string().min(10, 'Answer must be at least 10 characters').max(5000, 'Answer too long'),
  answerMode: z.enum(['text', 'audio']).default('text'),
});

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;

// ==================== Answer Evaluation Schemas ====================

export const DetectedSignalSchema = z.object({
  signal: z.string().min(1).max(200),
  tone: z.enum(['good', 'bad']),
  evidence: z.string().max(400).optional().nullable(), // Quote from answer
});

export const AnswerEvaluationSchema = z.object({
  version: z.literal('1.0'),

  // Overall assessment
  score: z.number().int().min(0).max(100),
  tier: z.enum(['strong', 'adequate', 'weak', 'insufficient']),

  // Detailed feedback
  summary: z.string().min(10).max(600),

  // Signal detection
  detectedGoodSignals: z.array(DetectedSignalSchema).max(8),
  detectedBadSignals: z.array(DetectedSignalSchema).max(8),
  missedSignals: z.array(z.string().min(1).max(200)).max(8),

  // Actionable suggestions
  improvements: z
    .array(
      z.object({
        area: z.string().min(1).max(120),
        suggestion: z.string().min(1).max(400),
        priority: z.enum(['high', 'medium', 'low']),
      }),
    )
    .max(5),

  // Metadata
  meta: z.object({
    model: z.string(),
    evaluatedAt: z.string(), // ISO timestamp
    answerLength: z.number().int().nonnegative(),
    rubricBasedEvaluation: z.boolean().default(true),
  }),
});

export type DetectedSignal = z.infer<typeof DetectedSignalSchema>;
export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;
