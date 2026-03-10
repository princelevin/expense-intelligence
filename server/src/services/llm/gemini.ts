import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider } from './types.js';
import type { RawTransaction } from '../../schemas/transaction.js';
import type { SpendingSummary, ChatMessage } from '../../schemas/index.js';
import { llmBatchResponseSchema, llmInsightResponseSchema } from '../../schemas/llmResponse.js';
import { logger } from '../../utils/logger.js';

const MAX_BATCH_SIZE = 50;
const MAX_CONCURRENT_BATCHES = 3;

const CATEGORIZATION_PROMPT = `You are a financial transaction categorizer for Indian bank statements.

For each transaction, provide:
1. category: One of: Food & Dining, Shopping, Transport, Bills & Utilities, Entertainment, Health & Medical, Education, Rent & Housing, Insurance, Investments, Transfer, ATM Withdrawal, EMI & Loans, Salary, Refund, Uncategorized
2. confidence: 0.0 to 1.0
3. merchant: The recognized merchant/brand name, or "Unknown"

Key rules:
- NEFT/RTGS credits from companies (e.g. "MICROSOFT", "TCS", "INFOSYS") are "Salary" — extract company name as merchant
- UPI debits to food apps (Swiggy, Zomato, hungerbox, etc.) are "Food & Dining"
- UPI debits to individuals (person names) are "Transfer"
- Amazon/Flipkart purchases are "Shopping"
- Zepto, BigBasket, Blinkit, DMart are "Food & Dining" (groceries)
- MUNCHMAR is a food/snack merchant → "Food & Dining"
- Decathlon is "Shopping"
- RedBus is "Transport"
- Only use "Uncategorized" as a last resort when you truly cannot determine the category

Consider Indian payment patterns: UPI (WDL TFR UPI/DR/...), NEFT (DEP TFR NEFT*...), IMPS, POS purchases.

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

    logger.info('Starting AI categorization', { transactions: transactions.length, batches: batches.length });
    const allResults: Array<{ category: string; confidence: number; merchant: string }> = [];

    // Process batches in chunks to avoid rate limits
    for (let c = 0; c < batches.length; c += MAX_CONCURRENT_BATCHES) {
      const chunk = batches.slice(c, c + MAX_CONCURRENT_BATCHES);
      const chunkPromises = chunk.map(async (batch, idx) => {
        const batchIndex = c + idx;
        const input = batch.map((t, i) => {
          // Truncate long SBI UPI descriptions
          let desc = t.description;
          const upiMatch = desc.match(/UPI\/(?:DR|CR)\/\d+\/(.+?)(?:\/[A-Z]{4}\/|$)/);
          if (upiMatch) desc = `UPI ${upiMatch[1]!.trim()}`;
          else if (desc.length > 60) desc = desc.slice(0, 60);
          return `${i + 1}. ${t.date} | ${desc} | ${t.type} | ${t.amount}`;
        }).join('\n');

      try {
        const result = await this.callModel(`${CATEGORIZATION_PROMPT}\n\nTransactions:\n${input}`);
        const parsed = llmBatchResponseSchema.safeParse(JSON.parse(result));

        if (parsed.success) {
          return parsed.data.results;
        }

        logger.warn('LLM response validation failed for batch', { batchIndex });
        return batch.map(() => ({ category: 'Uncategorized', confidence: 0, merchant: 'Unknown' }));
      } catch (error) {
        logger.warn('LLM batch failed, retrying once', { batchIndex });

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

      const chunkResults = await Promise.all(chunkPromises);
      for (const results of chunkResults) {
        allResults.push(...results);
      }
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
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
      });

      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({ history });

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        return 'No message provided.';
      }

      const result = await chat.sendMessage(lastMessage.content);
      return result.response.text();
    } catch (error) {
      logger.error('Gemini chat error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
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
