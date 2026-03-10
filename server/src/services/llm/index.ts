import type { LLMProvider } from './types.js';
import { GeminiProvider } from './gemini.js';
import { OpenAIProvider } from './openai.js';
import type { AzureOpenAIConfig } from './openai.js';

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
    return new OpenAIProvider(config);
  }

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
