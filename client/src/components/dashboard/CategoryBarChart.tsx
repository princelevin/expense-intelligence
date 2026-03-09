import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategorySummary } from '../../types';

interface CategoryBarChartProps {
  categories: CategorySummary[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CategoryBarChart({ categories }: CategoryBarChartProps) {
  const data = categories.slice(0, 8).map(c => ({
    name: c.category.length > 12 ? c.category.slice(0, 12) + '…' : c.category,
    amount: c.totalAmount,
    fullName: c.category,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Spending Categories</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v: number) => formatCurrency(v)} />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            />
            <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
