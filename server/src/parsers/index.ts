import { parseCsv } from './csvParser.js';
import { parseExcel } from './excelParser.js';
import { detectBankFormat, mapRowToTransaction } from './bankFormats.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import type { RawTransaction } from '../schemas/transaction.js';

const MAX_ROWS = 10000;

export interface ParseResult {
  transactions: RawTransaction[];
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  bankName: string;
  errors: string[];
}

export async function parseFile(buffer: Buffer, filename: string): Promise<ParseResult> {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));

  let rawData: Record<string, unknown>[];
  let parseErrors: string[];
  let totalRows: number;

  if (ext === '.csv') {
    const result = parseCsv(buffer);
    rawData = result.data;
    parseErrors = result.errors;
    totalRows = result.totalRows;
  } else if (ext === '.xls' || ext === '.xlsx') {
    const result = await parseExcel(buffer);
    rawData = result.data;
    parseErrors = result.errors;
    totalRows = result.totalRows;
  } else {
    throw new AppError('UNSUPPORTED_FORMAT', `Unsupported file format: ${ext}`, 400, {
      supportedFormats: ['.csv', '.xls', '.xlsx'],
    });
  }

  if (rawData.length === 0) {
    throw new AppError('EMPTY_FILE', 'The uploaded file contains no data.', 400);
  }

  if (rawData.length > MAX_ROWS) {
    throw new AppError('TOO_MANY_ROWS', `File contains ${rawData.length} rows. Maximum allowed is ${MAX_ROWS}.`, 400, {
      maxRows: MAX_ROWS,
      actualRows: rawData.length,
    });
  }

  // Detect bank format from headers
  const headers = Object.keys(rawData[0]!);
  const format = detectBankFormat(headers);

  if (!format) {
    throw new AppError('UNKNOWN_FORMAT', 'Could not detect bank statement format. Supported banks: HDFC, SBI.', 400, {
      supportedBanks: ['HDFC', 'SBI'],
      detectedHeaders: headers.slice(0, 10),
    });
  }

  // Map rows to transactions
  const transactions: RawTransaction[] = [];
  let skippedRows = 0;

  for (const row of rawData) {
    const transaction = mapRowToTransaction(row, format);
    if (transaction) {
      transactions.push(transaction);
    } else {
      skippedRows++;
    }
  }

  if (transactions.length === 0) {
    throw new AppError('NO_TRANSACTIONS', 'No valid transactions found in the file.', 400);
  }

  logger.info('File parsed successfully', {
    bank: format.name,
    totalRows,
    processed: transactions.length,
    skipped: skippedRows,
  });

  return {
    transactions,
    totalRows,
    processedRows: transactions.length,
    skippedRows,
    bankName: format.name,
    errors: parseErrors,
  };
}
