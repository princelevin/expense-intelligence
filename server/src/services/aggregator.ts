import type { CategorizedTransaction, CategorySummary, MerchantSummary, SpendingSummary } from '../schemas/index.js';

export function aggregateTransactions(transactions: CategorizedTransaction[]): SpendingSummary {
  let totalCredits = 0;
  let totalDebits = 0;
  const categoryMap = new Map<string, { totalAmount: number; count: number }>();
  const merchantMap = new Map<string, { totalAmount: number; count: number; category: string }>();

  for (const txn of transactions) {
    if (txn.type === 'credit') {
      totalCredits += txn.amount;
    } else {
      totalDebits += txn.amount;
    }

    // Only aggregate debits for category/merchant analysis
    if (txn.type === 'debit') {
      const category = txn.aiCategory || 'Uncategorized';
      const existing = categoryMap.get(category) ?? { totalAmount: 0, count: 0 };
      existing.totalAmount += txn.amount;
      existing.count++;
      categoryMap.set(category, existing);

      if (txn.merchant && txn.merchant !== 'Unknown') {
        const merchantEntry = merchantMap.get(txn.merchant) ?? { totalAmount: 0, count: 0, category };
        merchantEntry.totalAmount += txn.amount;
        merchantEntry.count++;
        merchantMap.set(txn.merchant, merchantEntry);
      }
    }
  }

  const categories: CategorySummary[] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      totalAmount: Math.round(data.totalAmount * 100) / 100,
      transactionCount: data.count,
      percentage: totalDebits > 0 ? Math.round((data.totalAmount / totalDebits) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const merchants: MerchantSummary[] = Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({
      merchant,
      totalAmount: Math.round(data.totalAmount * 100) / 100,
      transactionCount: data.count,
      category: data.category,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  return {
    totalCredits: Math.round(totalCredits * 100) / 100,
    totalDebits: Math.round(totalDebits * 100) / 100,
    netBalance: Math.round((totalCredits - totalDebits) * 100) / 100,
    categories,
    merchants,
  };
}
