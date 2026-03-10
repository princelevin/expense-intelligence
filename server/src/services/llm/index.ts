import type { LLMProvider } from './types.js';
import { GeminiProvider } from './gemini.js';
import { OpenAIProvider } from './openai.js';
import { FallbackProvider } from './fallback.js';
import type { AzureOpenAIConfig } from './openai.js';
import { logger } from '../../utils/logger.js';

function createGeminiFallback(): GeminiProvider | null {
  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) return null;
  const model = process.env['GEMINI_MODEL'];
  return new GeminiProvider(apiKey, model);
}

export function createLLMProvider(): LLMProvider {
  const provider = process.env['LLM_PROVIDER'] ?? 'gemini';

  if (provider === 'azure-openai') {
    const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
    const apiKey = process.env['AZURE_OPENAI_API_KEY'];
    const deploymentName = process.env['AZURE_OPENAI_DEPLOYMENT'];
    if (!endpoint || !apiKey || !deploymentName) {
      throw new Error('Azure OpenAI requires AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT');
    }
    const config: AzureOpenAIConfig = {
      endpoint,
      apiKey,
      deploymentName,
      apiVersion: process.env['AZURE_OPENAI_API_VERSION'],
    };
    const primary = new OpenAIProvider(config);
    const fallback = createGeminiFallback();
    if (fallback) {
      logger.info('Using Azure OpenAI with Gemini fallback', { deployment: deploymentName });
      return new FallbackProvider(primary, fallback, 'Azure OpenAI', 'Gemini');
    }
    logger.info('Using Azure OpenAI (no fallback configured)', { deployment: deploymentName });
    return primary;
  }

  if (provider === 'openai') {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is required');
    const primary = new OpenAIProvider(apiKey);
    const fallback = createGeminiFallback();
    if (fallback) {
      logger.info('Using OpenAI with Gemini fallback');
      return new FallbackProvider(primary, fallback, 'OpenAI', 'Gemini');
    }
    logger.info('Using OpenAI (no fallback configured)');
    return primary;
  }

  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required');
  const model = process.env['GEMINI_MODEL'];
  logger.info('Using Gemini provider', { model });
  return new GeminiProvider(apiKey, model);
}

export type { LLMProvider } from './types.js';
