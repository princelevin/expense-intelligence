interface InsightPanelProps {
  insights: string[];
}

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 AI Insights</h3>
      {insights.length === 0 ? (
        <p className="text-gray-500 text-sm">No insights available.</p>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
              <span className="text-purple-500 mt-0.5">•</span>
              <p className="text-sm text-gray-700">{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
