import type { RawTransaction } from '../schemas/transaction.js';

export interface CategorizerResult {
  category: string;
  confidence: number;
  merchant: string;
}

export interface Categorizer {
  categorize(transaction: RawTransaction): CategorizerResult;
}
