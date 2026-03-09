import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider } from './types.js';
import type { RawTransaction } from '../../schemas/transaction.js';
import type { SpendingSummary, ChatMessage } from '../../schemas/index.js';
import { llmBatchResponseSchema, llmInsightResponseSchema } from '../../schemas/llmResponse.js';
import { logger } from '../../utils/logger.js';

const MAX_BATCH_SIZE = 25;

const CATEGORIZATION_PROMPT = `You are a financial transaction categorizer for Indian bank statements.

For each transaction, provide:
1. category: One of: Food & Dining, Shopping, Transport, Bills & Utilities, Entertainment, Health & Medical, Education, Rent & Housing, Insurance, Investments, Transfer, ATM Withdrawal, EMI & Loans, Salary, Refund, Uncategorized
2. confidence: 0.0 to 1.0
3. merchant: The recognized merchant/brand name, or "Unknown"

Consider Indian payment patterns: UPI transactions, NEFT/IMPS transfers, POS purchases, and common Indian merchants (Swiggy, Zomato, Amazon India, Flipkart, etc.)

Respond with ONLY valid JSON: { "results": [{ "category": "...", "confidence": 0.95, "merchant": "..." }] }
The results array must have exactly the same number of elements as the input transactions, in the same order.`;

const INSIGHTS_PROMPT = `You are a personal finance analyst for an Indian user. Based on the spending summary below, generate 3-5 concise, actionable insights in plain language.

Guidelines:
- Use Indian Rupee (₹) for all amounts
- Reference specific categories and merchants
- Include at least one saving tip
- Keep each insight to 1-2 sentences
- Be encouraging, not judgmental

Respond with ONLY valid JSON: { "insights": ["insight1", "insight2", ...] }`;

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName?: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName ?? 'gemini-2.5-flash';
  }

  async categorize(transactions: RawTransaction[]): Promise<Array<{ category: string; confidence: number; merchant: string }>> {
    const batches: RawTransaction[][] = [];
    for (let i = 0; i < transactions.length; i += MAX_BATCH_SIZE) {
      batches.push(transactions.slice(i, i + MAX_BATCH_SIZE));
    }

    const allResults: Array<{ category: string; confidence: number; merchant: string }> = [];

    const batchPromises = batches.map(async (batch, index) => {
      const input = batch.map((t, i) => `${i + 1}. ${t.date} | ${t.description} | ${t.type} | ${t.amount}`).join('\n');

      try {
        const result = await this.callModel(`${CATEGORIZATION_PROMPT}\n\nTransactions:\n${input}`);
        const parsed = llmBatchResponseSchema.safeParse(JSON.parse(result));

        if (parsed.success) {
          return parsed.data.results;
        }

        logger.warn('LLM response validation failed for batch', { batchIndex: index });
        return batch.map(() => ({ category: 'Uncategorized', confidence: 0, merchant: 'Unknown' }));
      } catch (error) {
        logger.warn('LLM batch failed, retrying once', { batchIndex: index });

        // Retry once
        try {
          const retryResult = await this.callModel(`${CATEGORIZATION_PROMPT}\n\nTransactions:\n${input}`);
          const parsed = llmBatchResponseSchema.safeParse(JSON.parse(retryResult));
          if (parsed.success) return parsed.data.results;
        } catch {
          // Skip batch on second failure
        }

        return batch.map(() => ({ category: 'Uncategorized', confidence: 0, merchant: 'Unknown' }));
      }
    });

    const batchResults = await Promise.all(batchPromises);
    for (const results of batchResults) {
      allResults.push(...results);
    }

    return allResults;
  }

  async generateInsights(data: SpendingSummary): Promise<string[]> {
    const summaryText = JSON.stringify({
      totalCredits: data.totalCredits,
      totalDebits: data.totalDebits,
      topCategories: data.categories.slice(0, 5).map(c => ({
        category: c.category,
        amount: c.totalAmount,
        percentage: c.percentage,
      })),
      topMerchants: data.merchants.slice(0, 5).map(m => ({
        merchant: m.merchant,
        amount: m.totalAmount,
        category: m.category,
      })),
    });

    try {
      const result = await this.callModel(`${INSIGHTS_PROMPT}\n\nSpending Summary:\n${summaryText}`);
      const parsed = llmInsightResponseSchema.safeParse(JSON.parse(result));

      if (parsed.success) {
        return parsed.data.insights;
      }

      logger.warn('Insight response validation failed');
      return ['Unable to generate insights. Please try again.'];
    } catch {
      return ['Unable to generate insights at this time.'];
    }
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return 'No message provided.';
    }

    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  }

  private async callModel(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
