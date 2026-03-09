import * as XLSX from 'xlsx';
import officeCrypto from 'officecrypto-tool';
import { sanitizeRow } from '../middleware/sanitizer.js';
import { logger } from '../utils/logger.js';

export interface ExcelParseResult {
  data: Record<string, unknown>[];
  errors: string[];
  totalRows: number;
}

const HEADER_KEYWORDS = ['date', 'description', 'narration', 'amount', 'debit', 'credit', 'balance', 'withdrawal', 'deposit', 'ref', 'transaction'];
const MAX_HEADER_SCAN_ROWS = 20;

function findHeaderRow(sheet: XLSX.WorkSheet): number {
  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1');
  const maxRow = Math.min(range.e.r, MAX_HEADER_SCAN_ROWS - 1);

  for (let r = range.s.r; r <= maxRow; r++) {
    let matchCount = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellAddress] as XLSX.CellObject | undefined;
      if (cell?.v !== undefined) {
        const value = String(cell.v).toLowerCase().trim();
        if (HEADER_KEYWORDS.some(keyword => value.includes(keyword))) {
          matchCount++;
        }
      }
    }
    if (matchCount >= 2) return r;
  }

  return 0;
}

async function decryptBuffer(buffer: Buffer): Promise<Buffer> {
  try {
    const decrypted = await officeCrypto.decrypt(buffer, { password: '' });
    return decrypted as Buffer;
  } catch {
    // Not encrypted or decryption failed — return original buffer
    return buffer;
  }
}

export async function parseExcel(buffer: Buffer): Promise<ExcelParseResult> {
  const errors: string[] = [];

  // Attempt decryption (handles password-protected SBI YONO files)
  const decryptedBuffer = await decryptBuffer(buffer);

  const workbook = XLSX.read(decryptedBuffer, { type: 'buffer', cellDates: true });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { data: [], errors: ['No sheets found in workbook'], totalRows: 0 };
  }

  const sheet = workbook.Sheets[sheetName]!;
  const headerRow = findHeaderRow(sheet);

  if (headerRow > 0) {
    logger.info('Smart header detection', { headerRow: headerRow + 1 });
  }

  // Convert to JSON starting from the detected header row
  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    range: headerRow,
    defval: '',
  });

  const sanitizedData = rawData.map(sanitizeRow);

  return {
    data: sanitizedData,
    errors,
    totalRows: rawData.length,
  };
}
