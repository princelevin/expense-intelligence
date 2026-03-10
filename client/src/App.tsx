import { useAnalysis } from './hooks/useAnalysis';
import { UploadArea } from './components/upload/UploadArea';
import { PrivacyNotice } from './components/upload/PrivacyNotice';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { Disclaimer } from './components/common/Disclaimer';
import { DashboardTabs } from './components/dashboard/DashboardTabs';

function App() {
  const { state, upload, reset } = useAnalysis();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">💰</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Expense Intelligence</h1>
              <p className="text-xs text-gray-500">AI-Powered Bank Statement Analyzer</p>
            </div>
          </div>
          {state.status === 'dashboard' && (
            <button
              onClick={reset}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Upload New
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {state.status === 'idle' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyze Your Spending</h2>
            <p className="text-gray-500 mb-8">Upload your HDFC or SBI bank statement to get started</p>
            <UploadArea onFileSelect={upload} />
            <PrivacyNotice />
          </div>
        )}

        {(state.status === 'uploading' || state.status === 'processing') && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner
              message={state.status === 'processing' ? state.message : 'Uploading file...'}
              fileName={state.fileName}
            />
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <ErrorMessage
              code={state.error.code}
              message={state.error.message}
              onRetry={reset}
            />
          </div>
        )}

        {state.status === 'dashboard' && (
          <DashboardTabs data={state.data} onReset={reset} />
        )}
      </main>

      <Disclaimer />
    </div>
  );
}

export default App;
