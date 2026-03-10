import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { upload } from './middleware/fileUpload.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { parseFile } from './parsers/index.js';
import { ruleCategorizer } from './categorizers/index.js';
import { createLLMProvider } from './services/llm/index.js';
import { aggregateTransactions } from './services/aggregator.js';
import { generateInsights } from './services/insightGenerator.js';
import { chatRequestSchema } from './schemas/apiResponse.js';
import { logger } from './utils/logger.js';
import type { CategorizedTransaction } from './schemas/transaction.js';
import type { ComparisonResult } from './schemas/apiResponse.js';

const app = express();
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN.split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/api/analyze', upload.single('file'), async (req, res, next) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      throw new AppError('NO_FILE', 'No file uploaded. Please select a bank statement file.', 400);
    }

    // 1. Parse file (with optional password for encrypted Excel files)
    const password = typeof req.body?.password === 'string' ? req.body.password : undefined;
    const parseResult = await parseFile(req.file.buffer, req.file.originalname, password);
    const parseTime = Date.now() - startTime;
    logger.info('File parsed', { bank: parseResult.bankName, transactions: parseResult.processedRows, parseTimeMs: parseTime });

    // 2. Run both categorization engines in parallel
    const llmProvider = createLLMProvider();
    const catStart = Date.now();
    const [aiResults, ruleResults] = await Promise.all([
      llmProvider.categorize(parseResult.transactions),
      Promise.resolve(parseResult.transactions.map(t => ruleCategorizer.categorize(t))),
    ]);
    const catTime = Date.now() - catStart;
    logger.info('Categorization complete', { catTimeMs: catTime });

    // 3. Merge results into CategorizedTransaction[]
    const transactions: CategorizedTransaction[] = parseResult.transactions.map((t, i) => ({
      ...t,
      aiCategory: aiResults[i]?.category ?? 'Uncategorized',
      aiConfidence: aiResults[i]?.confidence ?? 0,
      ruleCategory: ruleResults[i]?.category ?? 'Uncategorized',
      merchant: aiResults[i]?.merchant ?? ruleResults[i]?.merchant ?? 'Unknown',
    }));

    // 4. Aggregate
    const summary = aggregateTransactions(transactions);

    // 5. Generate insights
    const insightStart = Date.now();
    const insights = await generateInsights(summary);
    logger.info('Insights generated', { insightTimeMs: Date.now() - insightStart });

    // 6. Build comparison
    const comparison: ComparisonResult = buildComparison(transactions);

    const processingTimeMs = Date.now() - startTime;

    res.json({
      transactions,
      categories: summary.categories,
      merchants: summary.merchants,
      insights,
      comparison,
      meta: {
        totalRows: parseResult.totalRows,
        processedRows: parseResult.processedRows,
        skippedRows: parseResult.skippedRows,
        processingTimeMs,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res, next) => {
  try {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('INVALID_REQUEST', 'Invalid chat request format.', 400, {
        errors: parsed.error.issues.map(i => i.message),
      });
    }

    const { messages, summary, transactions } = parsed.data;

    const systemPrompt = buildChatSystemPrompt(summary, transactions);

    const llmProvider = createLLMProvider();
    logger.info('Chat request', { messageCount: messages.length, promptLength: systemPrompt.length });
    const response = await llmProvider.chat(messages, systemPrompt);

    res.json({ response });
  } catch (error) {
    next(error);
  }
});

function buildComparison(transactions: CategorizedTransaction[]): ComparisonResult {
  let matches = 0;
  const details = transactions.map(t => {
    const matched = t.aiCategory === t.ruleCategory;
    if (matched) matches++;
    return {
      description: t.description,
      aiCategory: t.aiCategory,
      ruleCategory: t.ruleCategory,
      matched,
    };
  });

  return {
    matchRate: transactions.length > 0 ? Math.round((matches / transactions.length) * 10000) / 100 : 0,
    totalCompared: transactions.length,
    matches,
    mismatches: transactions.length - matches,
    details,
  };
}

function truncateDescription(desc: string): string {
  // SBI UPI descriptions are very long; extract the meaningful part
  // e.g. "WDL TFR   UPI/DR/.../Zepto/YESB/ZEPTOONLIN/Paym\n ent   009769..." → "UPI Zepto"
  const upiMatch = desc.match(/UPI\/(?:DR|CR)\/\d+\/([^/]+)/);
  if (upiMatch) {
    const prefix = desc.includes('UPI/CR') ? 'UPI-CR' : 'UPI-DR';
    return `${prefix} ${upiMatch[1]!.trim()}`;
  }
  const neftMatch = desc.match(/NEFT\*[^*]*\*[^*]*\*(.+?)(?:\s{2,}|$)/);
  if (neftMatch) return `NEFT ${neftMatch[1]!.trim()}`;
  // Fallback: first 40 chars
  return desc.slice(0, 40).trim();
}

function buildChatSystemPrompt(
  summary: { totalCredits: number; totalDebits: number; netBalance: number },
  transactions?: CategorizedTransaction[],
): string {
  let prompt = `You are a helpful personal finance assistant analyzing Indian bank statement data.

Spending Summary:
- Total Money In (Credits): ₹${summary.totalCredits.toLocaleString('en-IN')}
- Total Money Out (Debits): ₹${summary.totalDebits.toLocaleString('en-IN')}
- Net Balance: ₹${summary.netBalance.toLocaleString('en-IN')}`;

  if (transactions && transactions.length > 0) {
    const sampleTxns = transactions.slice(0, 30).map(t =>
      `${t.date} | ${truncateDescription(t.description)} | ${t.type} ₹${t.amount} | ${t.aiCategory}`,
    ).join('\n');
    prompt += `\n\nRecent Transactions (sample of ${Math.min(30, transactions.length)} out of ${transactions.length}):\n${sampleTxns}`;
  }

  prompt += `\n\nAnswer questions about spending patterns, provide saving tips, and help the user understand their finances. Use ₹ for amounts. Be concise and helpful.

IMPORTANT: Respond in plain text only. Do NOT use markdown formatting like **bold**, *italic*, or # headings. Use simple dashes (-) for lists and plain text for emphasis.`;

  return prompt;
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info('Server started', { port: PORT, cors: CORS_ORIGIN });
});

export default app;
