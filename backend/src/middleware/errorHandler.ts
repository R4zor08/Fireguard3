import { Request, Response, NextFunction } from 'express';

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

// Global error handling middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle Prisma errors
  if (err instanceof Error && 'code' in err) {
    const prismaError = err as Error & { code: string; meta?: { target?: string[] } };
    
    switch (prismaError.code) {
      case 'P2002':
        // Unique constraint violation
        res.status(409).json({
          success: false,
          message: `Duplicate field value: ${prismaError.meta?.target?.join(', ') || 'field'}`,
        });
        return;
      case 'P2014':
        // Invalid relation
        res.status(400).json({
          success: false,
          message: 'Invalid relation provided.',
        });
        return;
      case 'P2003':
        // Foreign key constraint
        res.status(400).json({
          success: false,
          message: 'Invalid reference to related record.',
        });
        return;
      case 'P2025':
        // Record not found
        res.status(404).json({
          success: false,
          message: 'Record not found.',
        });
        return;
    }
  }

  // Handle API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
};
