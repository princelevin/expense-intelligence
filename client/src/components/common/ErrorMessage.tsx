interface ErrorMessageProps {
  code: string;
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ code, message, onRetry }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto text-center p-8" role="alert">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-1">{message}</p>
      <p className="text-xs text-gray-400 mb-6">Error code: {code}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
}
