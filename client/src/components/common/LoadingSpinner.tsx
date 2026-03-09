interface LoadingSpinnerProps {
  message?: string;
  fileName?: string;
}

export function LoadingSpinner({ message = 'Processing...', fileName }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
      <p className="text-lg font-medium text-gray-700">{message}</p>
      {fileName && <p className="text-sm text-gray-500 mt-1">{fileName}</p>}
    </div>
  );
}
