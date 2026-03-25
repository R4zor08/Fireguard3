import { Request, Response, NextFunction } from 'express';

// Async handler wrapper to catch async errors
// This eliminates the need for try-catch blocks in controllers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
