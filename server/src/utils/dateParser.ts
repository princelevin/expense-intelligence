// Indian date format patterns:
// DD/MM/YYYY, DD-MM-YYYY, DD/MM/YY, DD-MM-YY, DD MMM YYYY

const DATE_PATTERNS: Array<{ regex: RegExp; parse: (match: RegExpMatchArray) => Date | null }> = [
  {
    // DD/MM/YYYY or DD-MM-YYYY
    regex: /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/,
    parse: (m) => createDate(parseInt(m[3]!, 10), parseInt(m[2]!, 10), parseInt(m[1]!, 10)),
  },
  {
    // DD/MM/YY or DD-MM-YY
    regex: /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2})$/,
    parse: (m) => {
      const year = parseInt(m[3]!, 10);
      const fullYear = year >= 50 ? 1900 + year : 2000 + year;
      return createDate(fullYear, parseInt(m[2]!, 10), parseInt(m[1]!, 10));
    },
  },
  {
    // DD MMM YYYY (e.g., "15 Jan 2026")
    regex: /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/,
    parse: (m) => {
      const monthIndex = MONTH_MAP[m[2]!.toLowerCase()];
      if (monthIndex === undefined) return null;
      return createDate(parseInt(m[3]!, 10), monthIndex + 1, parseInt(m[1]!, 10));
    },
  },
  {
    // YYYY-MM-DD (ISO format)
    regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    parse: (m) => createDate(parseInt(m[1]!, 10), parseInt(m[2]!, 10), parseInt(m[3]!, 10)),
  },
  {
    // MM/DD/YYYY (US format — only as fallback)
    regex: /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/,
    parse: (m) => createDate(parseInt(m[3]!, 10), parseInt(m[1]!, 10), parseInt(m[2]!, 10)),
  },
];

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function createDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return null;
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function parseIndianDate(dateStr: string): string {
  const trimmed = dateStr.trim();

  for (const pattern of DATE_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      const date = pattern.parse(match);
      if (date) {
        return date.toISOString().split('T')[0]!;
      }
    }
  }

  // Fallback: try native Date parsing
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    return fallback.toISOString().split('T')[0]!;
  }

  return trimmed;
}
