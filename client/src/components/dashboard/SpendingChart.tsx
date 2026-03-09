import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategorySummary } from '../../types';

interface SpendingChartProps {
  categories: CategorySummary[];
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6',
  '#E11D48', '#84CC16', '#0EA5E9',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SpendingChart({ categories }: SpendingChartProps) {
  const data = categories.map(c => ({
    name: c.category,
    value: c.totalAmount,
    percentage: c.percentage,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(1)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Accessible data table alternative */}
      <details className="mt-4">
        <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
          View data as table
        </summary>
        <table className="w-full mt-2 text-sm" role="table">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-600">Category</th>
              <th className="text-right py-2 text-gray-600">Amount</th>
              <th className="text-right py-2 text-gray-600">%</th>
              <th className="text-right py-2 text-gray-600">Txns</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.category} className="border-b border-gray-100">
                <td className="py-2">{c.category}</td>
                <td className="text-right py-2">{formatCurrency(c.totalAmount)}</td>
                <td className="text-right py-2">{c.percentage}%</td>
                <td className="text-right py-2">{c.transactionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
