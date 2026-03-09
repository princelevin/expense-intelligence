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
    descriptionColumns: ['Narration', 'Description', 'Particulars', 'Transaction Description'],
    debitColumns: ['Withdrawal Amt.', 'Withdrawal Amount', 'Debit', 'Debit Amount', 'Dr'],
    creditColumns: ['Deposit Amt.', 'Deposit Amount', 'Credit', 'Credit Amount', 'Cr'],
    balanceColumns: ['Closing Balance', 'Balance', 'Available Balance'],
    referenceColumns: ['Chq./Ref.No.', 'Reference No', 'Ref No', 'Chq/Ref Number'],
  },
  {
    name: 'SBI',
    dateColumns: ['Txn Date', 'Transaction Date', 'Date', 'Value Date'],
    descriptionColumns: ['Description', 'Narration', 'Particulars', 'Ref No./Cheque No.'],
    debitColumns: ['Debit', 'Withdrawal', 'Dr', 'Debit Amount'],
    creditColumns: ['Credit', 'Deposit', 'Cr', 'Credit Amount'],
    balanceColumns: ['Balance', 'Closing Balance', 'Available Balance'],
    referenceColumns: ['Ref No./Cheque No.', 'Reference', 'Ref No'],
  },
];

// 4-pass fuzzy column matching
function findColumnValue(row: Record<string, unknown>, candidates: string[]): string | undefined {
  const keys = Object.keys(row);

  // Pass 1: Exact match (case-insensitive)
  for (const candidate of candidates) {
    const exactMatch = keys.find(k => k.toLowerCase() === candidate.toLowerCase());
    if (exactMatch && row[exactMatch] !== undefined && row[exactMatch] !== '') {
      return String(row[exactMatch]);
    }
  }

  // Pass 2: Contains match
  for (const candidate of candidates) {
    const containsMatch = keys.find(k => k.toLowerCase().includes(candidate.toLowerCase()));
    if (containsMatch && row[containsMatch] !== undefined && row[containsMatch] !== '') {
      return String(row[containsMatch]);
    }
  }

  // Pass 3: Normalized match (remove special chars)
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    const normalizedMatch = keys.find(k => normalize(k) === normalizedCandidate);
    if (normalizedMatch && row[normalizedMatch] !== undefined && row[normalizedMatch] !== '') {
      return String(row[normalizedMatch]);
    }
  }

  return undefined;
}

export function detectBankFormat(headers: string[]): BankFormat | null {
  const lowerHeaders = headers.map(h => h.toLowerCase());

  for (const format of BANK_FORMATS) {
    const allCandidates = [
      ...format.dateColumns,
      ...format.descriptionColumns,
      ...format.debitColumns,
      ...format.creditColumns,
    ];

    const matchCount = allCandidates.filter(candidate =>
      lowerHeaders.some(h => h.includes(candidate.toLowerCase())),
    ).length;

    if (matchCount >= 3) {
      logger.info('Detected bank format', { bank: format.name, matchCount });
      return format;
    }
  }

  return null;
}

export function mapRowToTransaction(row: Record<string, unknown>, format: BankFormat): RawTransaction | null {
  const dateStr = findColumnValue(row, format.dateColumns);
  const description = findColumnValue(row, format.descriptionColumns);

  if (!dateStr || !description) return null;

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

  return {
    date: parseIndianDate(dateStr),
    description: description.trim(),
    amount,
    type,
    ...(balanceStr && { balance: parseIndianCurrency(balanceStr) }),
    ...(reference && { reference: reference.trim() }),
  };
}
