import OpenAI, { AzureOpenAI } from 'openai';
import type { LLMProvider } from './types.js';
import type { RawTransaction } from '../../schemas/transaction.js';
import type { SpendingSummary, ChatMessage } from '../../schemas/index.js';
import { llmBatchResponseSchema, llmInsightResponseSchema } from '../../schemas/llmResponse.js';
import { logger } from '../../utils/logger.js';

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string | undefined;
}

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

Use Indian Rupee (₹) for amounts. Be encouraging, not judgmental.

Respond with ONLY valid JSON: { "insights": ["insight1", "insight2", ...] }`;

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey: string, modelName?: string);
  constructor(azureConfig: AzureOpenAIConfig);
  constructor(apiKeyOrConfig: string | AzureOpenAIConfig, modelName?: string) {
    if (typeof apiKeyOrConfig === 'string') {
      this.client = new OpenAI({ apiKey: apiKeyOrConfig });
      this.modelName = modelName ?? 'gpt-4o-mini';
    } else {
      this.client = new AzureOpenAI({
        endpoint: apiKeyOrConfig.endpoint,
        apiKey: apiKeyOrConfig.apiKey,
        apiVersion: apiKeyOrConfig.apiVersion ?? '2024-08-01-preview',
        deployment: apiKeyOrConfig.deploymentName,
      });
      this.modelName = apiKeyOrConfig.deploymentName;
    }
  }

  async categorize(transactions: RawTransaction[]): Promise<Array<{ category: string; confidence: number; merchant: string }>> {
    const batches: RawTransaction[][] = [];
    for (let i = 0; i < transactions.length; i += MAX_BATCH_SIZE) {
      batches.push(transactions.slice(i, i + MAX_BATCH_SIZE));
    }

    logger.info('Starting AI categorization', { transactions: transactions.length, batches: batches.length });
    const allResults: Array<{ category: string; confidence: number; merchant: string }> = [];

    // Process batches concurrently in chunks to maximize throughput
    for (let c = 0; c < batches.length; c += MAX_CONCURRENT_BATCHES) {
      const chunk = batches.slice(c, c + MAX_CONCURRENT_BATCHES);
      const chunkPromises = chunk.map(async (batch) => {
        const input = batch.map((t, i) => {
          let desc = t.description;
          const upiMatch = desc.match(/UPI\/(?:DR|CR)\/\d+\/(.+?)(?:\/[A-Z]{4}\/|$)/);
          if (upiMatch) desc = `UPI ${upiMatch[1]!.trim()}`;
          else if (desc.length > 60) desc = desc.slice(0, 60);
          return `${i + 1}. ${t.date} | ${desc} | ${t.type} | ${t.amount}`;
        }).join('\n');

        try {
          const result = await this.callModel(CATEGORIZATION_PROMPT, `Transactions:\n${input}`);
          const parsed = llmBatchResponseSchema.safeParse(JSON.parse(result));

          if (parsed.success) {
            return parsed.data.results;
          }
          return batch.map(() => ({ category: 'Uncategorized', confidence: 0, merchant: 'Unknown' }));
        } catch {
          logger.warn('OpenAI batch failed');
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
      topCategories: data.categories.slice(0, 5),
      topMerchants: data.merchants.slice(0, 5),
    });

    try {
      const result = await this.callModel(INSIGHTS_PROMPT, `Spending Summary:\n${summaryText}`);
      const parsed = llmInsightResponseSchema.safeParse(JSON.parse(result));
      if (parsed.success) return parsed.data.insights;
      return ['Unable to generate insights.'];
    } catch {
      return ['Unable to generate insights at this time.'];
    }
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    });

    return response.choices[0]?.message?.content ?? 'No response generated.';
  }

  private async callModel(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.modelName,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    return response.choices[0]?.message?.content ?? '{}';
  }
}
