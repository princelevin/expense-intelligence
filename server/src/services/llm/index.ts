import type { LLMProvider } from './types.js';
import { GeminiProvider } from './gemini.js';
import { OpenAIProvider } from './openai.js';

export function createLLMProvider(): LLMProvider {
  const provider = process.env['LLM_PROVIDER'] ?? 'gemini';

  if (provider === 'openai') {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is required');
    return new OpenAIProvider(apiKey);
  }

  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required');
  const model = process.env['GEMINI_MODEL'];
  return new GeminiProvider(apiKey, model);
}

export type { LLMProvider } from './types.js';
