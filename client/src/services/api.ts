import type { AnalysisResult, ChatMessage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export async function analyzeFile(file: File, password?: string): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (password) {
    formData.append('password', password);
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const code = errorData?.error?.code ?? 'UNKNOWN_ERROR';
    const message = errorData?.error?.message ?? 'An unexpected error occurred.';
    throw { code, message };
  }

  return response.json();
}

export async function sendChatMessage(
  messages: ChatMessage[],
  summary: { totalCredits: number; totalDebits: number; netBalance: number },
  transactions?: AnalysisResult['transactions'],
): Promise<string> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, summary, transactions }),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  const data = await response.json();
  return data.response;
}
