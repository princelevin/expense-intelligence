import Papa from 'papaparse';
import { sanitizeRow } from '../middleware/sanitizer.js';
import { logger } from '../utils/logger.js';

export interface CsvParseResult {
  data: Record<string, unknown>[];
  errors: string[];
  totalRows: number;
}

export function parseCsv(buffer: Buffer, encoding?: string): CsvParseResult {
  const content = buffer.toString((encoding as BufferEncoding) || 'utf-8');
  const errors: string[] = [];

  const result = Papa.parse<Record<string, unknown>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      logger.warn('CSV parse warning', { row: error.row, message: error.message });
      errors.push(`Row ${error.row}: ${error.message}`);
    }
  }

  const sanitizedData = result.data.map(sanitizeRow);

  return {
    data: sanitizedData,
    errors,
    totalRows: result.data.length,
  };
}
