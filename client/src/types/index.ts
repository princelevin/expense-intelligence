export interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance?: number;
  reference?: string;
}

export interface CategorizedTransaction extends RawTransaction {
  aiCategory: string;
  aiConfidence: number;
  ruleCategory: string;
  merchant: string;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface MerchantSummary {
  merchant: string;
  totalAmount: number;
  transactionCount: number;
  category: string;
}

export interface ComparisonResult {
  matchRate: number;
  totalCompared: number;
  matches: number;
  mismatches: number;
  details: Array<{
    description: string;
    aiCategory: string;
    ruleCategory: string;
    matched: boolean;
  }>;
}

export interface AnalysisMeta {
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  processingTimeMs: number;
}

export interface AnalysisResult {
  transactions: CategorizedTransaction[];
  categories: CategorySummary[];
  merchants: MerchantSummary[];
  insights: string[];
  comparison: ComparisonResult;
  meta: AnalysisMeta;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AppState =
  | { status: 'idle' }
  | { status: 'uploading'; fileName: string }
  | { status: 'processing'; fileName: string; message: string }
  | { status: 'dashboard'; data: AnalysisResult }
  | { status: 'error'; error: { code: string; message: string }; retry: () => void };
