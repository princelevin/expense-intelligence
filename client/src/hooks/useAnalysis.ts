import { useReducer, useCallback } from 'react';
import type { AppState, AnalysisResult } from '../types';
import { analyzeFile } from '../services/api';

type Action =
  | { type: 'START_UPLOAD'; fileName: string }
  | { type: 'PROCESSING'; message: string }
  | { type: 'SUCCESS'; data: AnalysisResult }
  | { type: 'ERROR'; error: { code: string; message: string } }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_UPLOAD':
      return { status: 'uploading', fileName: action.fileName };
    case 'PROCESSING':
      if (state.status === 'uploading' || state.status === 'processing') {
        return { status: 'processing', fileName: (state as { fileName: string }).fileName, message: action.message };
      }
      return state;
    case 'SUCCESS':
      return { status: 'dashboard', data: action.data };
    case 'ERROR':
      return { status: 'error', error: action.error, retry: () => {} };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}

export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  const upload = useCallback(async (file: File, password?: string) => {
    dispatch({ type: 'START_UPLOAD', fileName: file.name });
    dispatch({ type: 'PROCESSING', message: 'Parsing bank statement...' });

    try {
      const data = await analyzeFile(file, password);
      dispatch({ type: 'SUCCESS', data });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      dispatch({
        type: 'ERROR',
        error: {
          code: err.code ?? 'UNKNOWN_ERROR',
          message: err.message ?? 'An unexpected error occurred. Please try again.',
        },
      });
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { state, upload, reset };
}
