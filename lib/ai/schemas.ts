import { z } from 'zod';

import { validationConfig } from '../config.ts';

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
