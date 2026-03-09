import { z } from 'zod';
import { categorizedTransactionSchema, categorySummarySchema, merchantSummarySchema } from './transaction.js';

export const comparisonResultSchema = z.object({
  matchRate: z.number(),
  totalCompared: z.number(),
  matches: z.number(),
  mismatches: z.number(),
  details: z.array(z.object({
    description: z.string(),
    aiCategory: z.string(),
    ruleCategory: z.string(),
    matched: z.boolean(),
  })),
});

export type ComparisonResult = z.infer<typeof comparisonResultSchema>;

export const analysisMetaSchema = z.object({
  totalRows: z.number(),
  processedRows: z.number(),
  skippedRows: z.number(),
  processingTimeMs: z.number(),
});

export type AnalysisMeta = z.infer<typeof analysisMetaSchema>;

export const analysisResultSchema = z.object({
  transactions: z.array(categorizedTransactionSchema),
  categories: z.array(categorySummarySchema),
  merchants: z.array(merchantSummarySchema),
  insights: z.array(z.string()),
  comparison: comparisonResultSchema,
  meta: analysisMetaSchema,
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema),
  summary: z.object({
    totalCredits: z.number(),
    totalDebits: z.number(),
    netBalance: z.number(),
  }),
  transactions: z.array(categorizedTransactionSchema).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  response: z.string(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
