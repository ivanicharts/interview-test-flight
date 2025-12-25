import { z } from 'zod';

import { validationConfig } from '../config.js';

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
    latencyMs: z.number().optional(),
    model: z.string().optional(),
  }),
});

export type MatchReport = z.infer<typeof MatchReportSchema>;
