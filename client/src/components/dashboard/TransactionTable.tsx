import { useState, useMemo } from 'react';
import type { CategorizedTransaction } from '../../types';

interface TransactionTableProps {
  transactions: CategorizedTransaction[];
}

type SortField = 'date' | 'description' | 'amount' | 'aiCategory';
type SortDir = 'asc' | 'desc';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let result = transactions;

    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.aiCategory.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date': cmp = a.date.localeCompare(b.date); break;
        case 'description': cmp = a.description.localeCompare(b.description); break;
        case 'amount': cmp = a.amount - b.amount; break;
        case 'aiCategory': cmp = a.aiCategory.localeCompare(b.aiCategory); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, search, typeFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIcon = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // Group by date
  const grouped = useMemo(() => {
    const groups = new Map<string, CategorizedTransaction[]>();
    for (const t of filtered) {
      const existing = groups.get(t.date) ?? [];
      existing.push(t);
      groups.set(t.date, existing);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Statement</h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search transactions"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as 'all' | 'credit' | 'debit')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="debit">Debits Only</option>
          <option value="credit">Credits Only</option>
        </select>
      </div>

      <p className="text-xs text-gray-500 mb-3">{filtered.length} of {transactions.length} transactions</p>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm" role="table">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSort('date')}>
                Date{sortIcon('date')}
              </th>
              <th className="text-left py-2 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSort('description')}>
                Description{sortIcon('description')}
              </th>
              <th className="text-right py-2 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSort('amount')}>
                Amount{sortIcon('amount')}
              </th>
              <th className="text-left py-2 px-3">Type</th>
              <th className="text-left py-2 px-3 cursor-pointer hover:text-blue-600" onClick={() => handleSort('aiCategory')}>
                Category{sortIcon('aiCategory')}
              </th>
              <th className="text-left py-2 px-3">Merchant</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(grouped.entries()).map(([date, txns]) => (
              <>{txns.map((t, i) => (
                <tr key={`${date}-${i}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{i === 0 ? date : ''}</td>
                  <td className="py-2 px-3 max-w-xs truncate" title={t.description}>{t.description}</td>
                  <td className={`py-2 px-3 text-right font-medium ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${t.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2 px-3">{t.aiCategory}</td>
                  <td className="py-2 px-3 text-gray-500">{t.merchant !== 'Unknown' ? t.merchant : '—'}</td>
                </tr>
              ))}</>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
