import { z } from 'zod';

export const rawTransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
  balance: z.number().optional(),
  reference: z.string().optional(),
});

export type RawTransaction = z.infer<typeof rawTransactionSchema>;

export const categorizedTransactionSchema = rawTransactionSchema.extend({
  aiCategory: z.string(),
  aiConfidence: z.number().min(0).max(1),
  ruleCategory: z.string(),
  merchant: z.string(),
});

export type CategorizedTransaction = z.infer<typeof categorizedTransactionSchema>;

export const categorySummarySchema = z.object({
  category: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
  percentage: z.number(),
});

export type CategorySummary = z.infer<typeof categorySummarySchema>;

export const merchantSummarySchema = z.object({
  merchant: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
  category: z.string(),
});

export type MerchantSummary = z.infer<typeof merchantSummarySchema>;

export const spendingSummarySchema = z.object({
  totalCredits: z.number(),
  totalDebits: z.number(),
  netBalance: z.number(),
  categories: z.array(categorySummarySchema),
  merchants: z.array(merchantSummarySchema),
});

export type SpendingSummary = z.infer<typeof spendingSummarySchema>;
