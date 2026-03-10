import { useCallback, useState, useRef } from 'react';

interface UploadAreaProps {
  onFileSelect: (file: File, password?: string) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ['.csv', '.xls', '.xlsx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isExcelFile(name: string): boolean {
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'));
  return ext === '.xls' || ext === '.xlsx';
}

export function UploadArea({ onFileSelect, disabled }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit.');
      return false;
    }
    return true;
  }, []);

  const handleFileChosen = useCallback((file: File) => {
    if (!validateFile(file)) return;
    if (isExcelFile(file.name)) {
      setSelectedFile(file);
      setShowPassword(true);
    } else {
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleSubmitWithPassword = useCallback(() => {
    if (selectedFile) {
      onFileSelect(selectedFile, password || undefined);
    }
  }, [selectedFile, password, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChosen(file);
  }, [handleFileChosen]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChosen(file);
  }, [handleFileChosen]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload bank statement file"
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={disabled ? undefined : handleClick}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) handleClick();
        }}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your bank statement here
        </p>
        <p className="text-sm text-gray-500">
          or click to browse — CSV, XLS, XLSX (max 5MB)
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports HDFC and SBI statements
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={handleChange}
          aria-hidden="true"
        />
      </div>
      {showPassword && selectedFile && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                This file is password-protected. Common formats:
              </p>
              <ul className="text-xs text-gray-400 mt-1 space-y-0.5 list-disc list-inside">
                <li><strong>SBI:</strong> First 5 letters of name (uppercase) + DOB (DDMMYYYY) — e.g. <code className="bg-gray-100 px-1 rounded">RITES09061975</code></li>
                <li><strong>HDFC:</strong> Your Customer ID number</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmitWithPassword(); }}
              placeholder="Enter file password"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              aria-label="File password"
            />
            <button
              onClick={handleSubmitWithPassword}
              disabled={disabled}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Analyze
            </button>
          </div>
          <button
            onClick={() => { setShowPassword(false); setSelectedFile(null); setPassword(''); }}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Choose a different file
          </button>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 text-center" role="alert">{error}</p>
      )}
    </div>
  );
}
