import type { MerchantSummary } from '../../types';

interface MerchantListProps {
  merchants: MerchantSummary[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MerchantList({ merchants }: MerchantListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Merchants</h3>
      {merchants.length === 0 ? (
        <p className="text-gray-500 text-sm">No merchant data available.</p>
      ) : (
        <ul className="space-y-3">
          {merchants.map((m, i) => (
            <li key={m.merchant} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{m.merchant}</p>
                  <p className="text-xs text-gray-500">{m.category} · {m.transactionCount} txn{m.transactionCount > 1 ? 's' : ''}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-700">{formatCurrency(m.totalAmount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
