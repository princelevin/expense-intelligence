import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  if (err.message === 'UNSUPPORTED_FORMAT') {
    res.status(400).json({
      error: {
        code: 'UNSUPPORTED_FORMAT',
        message: 'Unsupported file format. Please upload a CSV or Excel (.xls, .xlsx) file.',
        details: { supportedFormats: ['.csv', '.xls', '.xlsx'] },
      },
    });
    return;
  }

  if (err.message?.includes('File too large')) {
    res.status(400).json({
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds the 5MB limit. Please upload a smaller file.',
      },
    });
    return;
  }

  logger.error('Unhandled error', { error: err.message });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    },
  });
}
