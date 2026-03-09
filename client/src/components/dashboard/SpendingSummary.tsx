interface SpendingSummaryProps {
  totalCredits: number;
  totalDebits: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SpendingSummary({ totalCredits, totalDebits }: SpendingSummaryProps) {
  const netBalance = totalCredits - totalDebits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <p className="text-sm text-green-600 font-medium">Money In (Credits)</p>
        <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalCredits)}</p>
        <p className="text-xs text-green-500 mt-1">Total deposits & transfers received</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <p className="text-sm text-red-600 font-medium">Money Out (Debits)</p>
        <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(totalDebits)}</p>
        <p className="text-xs text-red-500 mt-1">Total spending & withdrawals</p>
      </div>
      <div className={`border rounded-xl p-5 ${netBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
        <p className={`text-sm font-medium ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Net Balance</p>
        <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
          {formatCurrency(netBalance)}
        </p>
        <p className={`text-xs mt-1 ${netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
          Credits minus debits
        </p>
      </div>
    </div>
  );
}
