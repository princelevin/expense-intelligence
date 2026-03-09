export function PrivacyNotice() {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-xl mx-auto">
      <div className="flex items-start gap-2">
        <span className="text-green-600 text-lg">🔒</span>
        <div>
          <p className="text-sm font-medium text-green-800">Your data stays private</p>
          <p className="text-xs text-green-600 mt-1">
            Your bank statement is processed in memory and never stored on our servers.
            No data is saved to any database, logs, or cookies. The AI provider processes
            your transactions with zero-retention mode.
          </p>
        </div>
      </div>
    </div>
  );
}
