import { useState, useMemo } from 'react';
import type { AnalysisResult } from '../../types';
import { SpendingSummary } from './SpendingSummary';
import { SpendingChart } from './SpendingChart';
import { CategoryBarChart } from './CategoryBarChart';
import { MerchantList } from './MerchantList';
import { InsightPanel } from './InsightPanel';
import { ComparisonTable } from './ComparisonTable';
import { TransactionTable } from './TransactionTable';
import { ChatBox } from './ChatBox';

interface DashboardTabsProps {
  data: AnalysisResult;
  onReset: () => void;
}

type Tab = 'overview' | 'statement' | 'comparison';

export function DashboardTabs({ data, onReset }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Extract available months from transactions
  const months = useMemo(() => {
    const monthSet = new Set<string>();
    for (const t of data.transactions) {
      const month = t.date.slice(0, 7); // YYYY-MM
      monthSet.add(month);
    }
    return Array.from(monthSet).sort().reverse();
  }, [data.transactions]);

  // Filter transactions by month
  const filteredData = useMemo(() => {
    if (selectedMonth === 'all') return data;

    const filtered = data.transactions.filter(t => t.date.startsWith(selectedMonth));

    // Recalculate categories, merchants from filtered data
    let totalDebits = 0;
    const catMap = new Map<string, { total: number; count: number }>();
    const merchMap = new Map<string, { total: number; count: number; category: string }>();

    for (const t of filtered) {
      if (t.type === 'credit') continue;
      totalDebits += t.amount;
      const cat = catMap.get(t.aiCategory) ?? { total: 0, count: 0 };
      cat.total += t.amount;
      cat.count++;
      catMap.set(t.aiCategory, cat);

      if (t.merchant !== 'Unknown') {
        const m = merchMap.get(t.merchant) ?? { total: 0, count: 0, category: t.aiCategory };
        m.total += t.amount;
        m.count++;
        merchMap.set(t.merchant, m);
      }
    }

    const categories = Array.from(catMap.entries())
      .map(([category, d]) => ({
        category,
        totalAmount: Math.round(d.total * 100) / 100,
        transactionCount: d.count,
        percentage: totalDebits > 0 ? Math.round((d.total / totalDebits) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    const merchants = Array.from(merchMap.entries())
      .map(([merchant, d]) => ({
        merchant,
        totalAmount: Math.round(d.total * 100) / 100,
        transactionCount: d.count,
        category: d.category,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);

    return {
      ...data,
      transactions: filtered,
      categories,
      merchants,
      meta: { ...data.meta, processedRows: filtered.length },
    } satisfies AnalysisResult;
  }, [data, selectedMonth]);

  const totalCredits = filteredData.transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredData.transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'statement', label: 'Statement' },
    { key: 'comparison', label: 'AI vs Rules' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {months.length > 1 && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by month"
            >
              <option value="all">All Months</option>
              {months.map(m => (
                <option key={m} value={m}>
                  {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Upload New
          </button>
        </div>
      </div>

      <SpendingSummary totalCredits={totalCredits} totalDebits={totalDebits} />

      <div className="text-xs text-gray-400 mb-4">
        Processed {filteredData.meta.processedRows} transactions
        {data.meta.skippedRows > 0 && ` (${data.meta.skippedRows} rows skipped)`}
        {' · '}{(data.meta.processingTimeMs / 1000).toFixed(1)}s
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingChart categories={filteredData.categories} />
            <CategoryBarChart categories={filteredData.categories} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MerchantList merchants={filteredData.merchants} />
            <InsightPanel insights={filteredData.insights} />
          </div>
        </div>
      )}

      {activeTab === 'statement' && (
        <TransactionTable transactions={filteredData.transactions} />
      )}

      {activeTab === 'comparison' && (
        <ComparisonTable comparison={filteredData.comparison} />
      )}

      <ChatBox data={data} />
    </div>
  );
}
