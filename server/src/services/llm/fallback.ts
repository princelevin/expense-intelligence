import type { LLMProvider } from './types.js';
import type { RawTransaction } from '../../schemas/transaction.js';
import type { SpendingSummary, ChatMessage } from '../../schemas/index.js';
import { logger } from '../../utils/logger.js';

export class FallbackProvider implements LLMProvider {
  constructor(
    private primary: LLMProvider,
    private fallback: LLMProvider,
    private primaryName: string,
    private fallbackName: string,
  ) {}

  async categorize(transactions: RawTransaction[]) {
    try {
      return await this.primary.categorize(transactions);
    } catch (err) {
      logger.warn(`${this.primaryName} categorize failed, falling back to ${this.fallbackName}`, { error: String(err) });
      return this.fallback.categorize(transactions);
    }
  }

  async generateInsights(data: SpendingSummary) {
    try {
      return await this.primary.generateInsights(data);
    } catch (err) {
      logger.warn(`${this.primaryName} insights failed, falling back to ${this.fallbackName}`, { error: String(err) });
      return this.fallback.generateInsights(data);
    }
  }

  async chat(messages: ChatMessage[], systemPrompt: string) {
    try {
      return await this.primary.chat(messages, systemPrompt);
    } catch (err) {
      logger.warn(`${this.primaryName} chat failed, falling back to ${this.fallbackName}`, { error: String(err) });
      return this.fallback.chat(messages, systemPrompt);
    }
  }
}
