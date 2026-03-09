import { createLLMProvider } from './llm/index.js';
import type { SpendingSummary } from '../schemas/index.js';
import { logger } from '../utils/logger.js';

export async function generateInsights(summary: SpendingSummary): Promise<string[]> {
  try {
    const provider = createLLMProvider();
    return await provider.generateInsights(summary);
  } catch (error) {
    logger.error('Failed to generate insights', { error: String(error) });
    return ['Unable to generate insights at this time. Your spending data has been analyzed successfully.'];
  }
}
