const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

export function sanitizeValue(value: string): string {
  let sanitized = value;
  for (const prefix of FORMULA_PREFIXES) {
    while (sanitized.startsWith(prefix)) {
      sanitized = sanitized.slice(prefix.length);
    }
  }
  return sanitized.trim();
}

export function sanitizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    sanitized[sanitizeValue(key)] = typeof value === 'string' ? sanitizeValue(value) : value;
  }
  return sanitized;
}
