import { parseIndianDate } from '../utils/dateParser.js';
import { parseIndianCurrency } from '../utils/indianCurrency.js';
import { logger } from '../utils/logger.js';
import type { RawTransaction } from '../schemas/transaction.js';

export interface BankFormat {
  name: string;
  dateColumns: string[];
  descriptionColumns: string[];
  debitColumns: string[];
  creditColumns: string[];
  balanceColumns: string[];
  referenceColumns: string[];
  amountColumn?: string; // Single amount column (positive/negative indicates credit/debit)
}

const BANK_FORMATS: BankFormat[] = [
  {
    name: 'HDFC',
    dateColumns: ['Date', 'Transaction Date', 'Txn Date'],
    descriptionColumns: ['Narration', 'Description', 'Particulars', 'Details', 'Transaction Description'],
    debitColumns: ['Withdrawal Amt.', 'Withdrawal Amount', 'Debit', 'Debit Amount', 'Dr'],
    creditColumns: ['Deposit Amt.', 'Deposit Amount', 'Credit', 'Credit Amount', 'Cr'],
    balanceColumns: ['Closing Balance', 'Balance', 'Available Balance'],
    referenceColumns: ['Chq./Ref.No.', 'Reference No', 'Ref No', 'Chq/Ref Number'],
  },
  {
    name: 'SBI',
    dateColumns: ['Txn Date', 'Transaction Date', 'Date', 'Value Date'],
    descriptionColumns: ['Description', 'Details', 'Narration', 'Particulars'],
    debitColumns: ['Debit', 'Withdrawal', 'Dr', 'Debit Amount'],
    creditColumns: ['Credit', 'Deposit', 'Cr', 'Credit Amount'],
    balanceColumns: ['Balance', 'Closing Balance', 'Available Balance'],
    referenceColumns: ['Ref No/Cheque No', 'Ref No./Cheque No.', 'Reference', 'Ref No', 'Chq/Ref No'],
  },
];

// 4-pass fuzzy column matching
function findColumnValue(row: Record<string, unknown>, candidates: string[]): string | undefined {
  const raw = findColumnRawValue(row, candidates);
  return raw !== undefined ? String(raw) : undefined;
}

function findColumnRawValue(row: Record<string, unknown>, candidates: string[]): unknown | undefined {
  const keys = Object.keys(row);

  // Pass 1: Exact match (case-insensitive)
  for (const candidate of candidates) {
    const exactMatch = keys.find(k => k.toLowerCase().trim() === candidate.toLowerCase());
    if (exactMatch && row[exactMatch] !== undefined && row[exactMatch] !== '') {
      return row[exactMatch];
    }
  }

  // Pass 2: Contains match
  for (const candidate of candidates) {
    const containsMatch = keys.find(k => k.toLowerCase().includes(candidate.toLowerCase()) || candidate.toLowerCase().includes(k.toLowerCase()));
    if (containsMatch && row[containsMatch] !== undefined && row[containsMatch] !== '') {
      return row[containsMatch];
    }
  }

  // Pass 3: Normalized match (remove special chars)
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    const normalizedMatch = keys.find(k => normalize(k) === normalizedCandidate);
    if (normalizedMatch && row[normalizedMatch] !== undefined && row[normalizedMatch] !== '') {
      return row[normalizedMatch];
    }
  }

  return undefined;
}

export function detectBankFormat(headers: string[]): BankFormat | null {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  logger.info('Detecting bank format', { headers: lowerHeaders });

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  let bestFormat: BankFormat | null = null;
  let bestScore = 0;

  for (const format of BANK_FORMATS) {
    // Count how many actual headers match (not how many candidates match)
    const headerMatchCount = lowerHeaders.filter(h => {
      const nh = normalize(h);
      const allCols = [
        ...format.dateColumns,
        ...format.descriptionColumns,
        ...format.debitColumns,
        ...format.creditColumns,
        ...format.balanceColumns,
      ];
      return allCols.some(candidate => {
        const lc = candidate.toLowerCase();
        const nc = normalize(candidate);
        return h === lc || nh === nc || h.includes(lc) || lc.includes(h);
      });
    }).length;

    logger.info('Format match score', { bank: format.name, headerMatchCount });

    if (headerMatchCount >= 3 && headerMatchCount > bestScore) {
      bestScore = headerMatchCount;
      bestFormat = format;
    }
  }

  if (bestFormat) {
    logger.info('Detected bank format', { bank: bestFormat.name, score: bestScore });
  } else {
    logger.warn('No bank format matched', { headers: lowerHeaders });
  }

  return bestFormat;
}

export function mapRowToTransaction(row: Record<string, unknown>, format: BankFormat): RawTransaction | null {
  const dateRaw = findColumnRawValue(row, format.dateColumns);
  const description = findColumnValue(row, format.descriptionColumns);

  if (!dateRaw || !description) return null;

  // Handle dates: Excel may parse them as Date objects
  let dateStr: string;
  if (dateRaw instanceof Date) {
    dateStr = `${dateRaw.getDate().toString().padStart(2, '0')}/${(dateRaw.getMonth() + 1).toString().padStart(2, '0')}/${dateRaw.getFullYear()}`;
  } else {
    dateStr = String(dateRaw);
  }

  const debitStr = findColumnValue(row, format.debitColumns);
  const creditStr = findColumnValue(row, format.creditColumns);
  const balanceStr = findColumnValue(row, format.balanceColumns);
  const reference = findColumnValue(row, format.referenceColumns);

  let amount: number;
  let type: 'credit' | 'debit';

  const debitAmount = debitStr ? parseIndianCurrency(debitStr) : 0;
  const creditAmount = creditStr ? parseIndianCurrency(creditStr) : 0;

  if (debitAmount > 0) {
    amount = debitAmount;
    type = 'debit';
  } else if (creditAmount > 0) {
    amount = creditAmount;
    type = 'credit';
  } else {
    return null; // Skip rows with no amount
  }

  const parsedDate = parseIndianDate(dateStr);
  if (!parsedDate) return null; // Skip rows with unparseable dates

  return {
    date: parsedDate,
    description: description.trim(),
    amount,
    type,
    ...(balanceStr && { balance: parseIndianCurrency(balanceStr) }),
    ...(reference && { reference: reference.trim() }),
  };
}
