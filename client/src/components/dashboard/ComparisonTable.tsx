import type { ComparisonResult } from '../../types';

interface ComparisonTableProps {
  comparison: ComparisonResult;
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI vs Rule-Based Comparison</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{comparison.matchRate}%</p>
          <p className="text-xs text-blue-600">Match Rate</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{comparison.matches}</p>
          <p className="text-xs text-green-600">Matches</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">{comparison.mismatches}</p>
          <p className="text-xs text-orange-600">Mismatches</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{comparison.totalCompared}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm" role="table">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600">Description</th>
              <th className="text-left py-2 px-3 text-gray-600">AI Category</th>
              <th className="text-left py-2 px-3 text-gray-600">Rule Category</th>
              <th className="text-center py-2 px-3 text-gray-600">Match</th>
            </tr>
          </thead>
          <tbody>
            {comparison.details.map((d, i) => (
              <tr key={i} className={`border-b border-gray-100 ${!d.matched ? 'bg-orange-50' : ''}`}>
                <td className="py-2 px-3 max-w-xs truncate" title={d.description}>{d.description}</td>
                <td className="py-2 px-3">{d.aiCategory}</td>
                <td className="py-2 px-3">{d.ruleCategory}</td>
                <td className="py-2 px-3 text-center">{d.matched ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
