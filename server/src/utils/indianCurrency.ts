const CURRENCY_REGEX = /^[₹Rs.INR\s]*/;
const LAKHS_REGEX = /(\d+),(\d{2}),(\d{3})/;

export function parseIndianCurrency(value: string | number): number {
  if (typeof value === 'number') return value;

  let cleaned = value.trim();

  // Remove currency symbols: ₹, Rs., Rs, INR
  cleaned = cleaned.replace(CURRENCY_REGEX, '').trim();
  cleaned = cleaned.replace(/Rs\.?\s*/gi, '').trim();
  cleaned = cleaned.replace(/INR\s*/gi, '').trim();

  // Handle parentheses for negative values: (1,234.56) → -1234.56
  const isNegative = cleaned.startsWith('(') && cleaned.endsWith(')');
  if (isNegative) {
    cleaned = cleaned.slice(1, -1);
  }

  // Handle lakhs notation: XX,XX,XXX → XXXXXXX
  if (LAKHS_REGEX.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, '');
  } else {
    // Standard comma removal: 1,234.56 → 1234.56
    cleaned = cleaned.replace(/,/g, '');
  }

  // Handle trailing Cr/Dr indicators
  let multiplier = 1;
  if (/\s*(Cr|CR)\.?\s*$/.test(cleaned)) {
    cleaned = cleaned.replace(/\s*(Cr|CR)\.?\s*$/, '');
  } else if (/\s*(Dr|DR)\.?\s*$/.test(cleaned)) {
    cleaned = cleaned.replace(/\s*(Dr|DR)\.?\s*$/, '');
    multiplier = -1;
  }

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;

  return (isNegative ? -parsed : parsed) * multiplier;
}

export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    // Crores: 1,00,00,000+
    return `${sign}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  }

  if (absAmount >= 100000) {
    // Lakhs: 1,00,000+
    return `${sign}₹${(absAmount / 100000).toFixed(2)} L`;
  }

  // Standard formatting with Indian comma placement
  const parts = absAmount.toFixed(2).split('.');
  const intPart = parts[0]!;
  const decPart = parts[1]!;

  let formatted = '';
  if (intPart.length > 3) {
    formatted = intPart.slice(-3);
    let remaining = intPart.slice(0, -3);
    while (remaining.length > 2) {
      formatted = remaining.slice(-2) + ',' + formatted;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      formatted = remaining + ',' + formatted;
    }
  } else {
    formatted = intPart;
  }

  return `${sign}₹${formatted}.${decPart}`;
}
