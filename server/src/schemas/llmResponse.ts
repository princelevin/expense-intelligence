import { z } from 'zod';

export const llmCategoryResponseSchema = z.object({
  category: z.string(),
  confidence: z.number().min(0).max(1),
  merchant: z.string(),
});

export const llmBatchResponseSchema = z.object({
  results: z.array(llmCategoryResponseSchema),
});

export type LLMCategoryResponse = z.infer<typeof llmCategoryResponseSchema>;
export type LLMBatchResponse = z.infer<typeof llmBatchResponseSchema>;

export const llmInsightResponseSchema = z.object({
  insights: z.array(z.string()),
});

export type LLMInsightResponse = z.infer<typeof llmInsightResponseSchema>;
