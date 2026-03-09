import type { RawTransaction } from '../../schemas/transaction.js';
import type { SpendingSummary, ChatMessage } from '../../schemas/index.js';

export interface LLMProvider {
  categorize(transactions: RawTransaction[]): Promise<Array<{ category: string; confidence: number; merchant: string }>>;
  generateInsights(data: SpendingSummary): Promise<string[]>;
  chat(messages: ChatMessage[], systemPrompt: string): Promise<string>;
}
