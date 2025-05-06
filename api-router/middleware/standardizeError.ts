import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to standardize error responses
 * @param code Error code
 * @param message Error message
 * @returns Standardized error response
 */
export function standardizeError(code: string, message: string): { success: false; error: { code: string; message: string } } {
  return {
    success: false,
    error: {
      code,
      message
    }
  };
}

/**
 * Middleware to standardize error responses
 * @param err Error object
 * @param req Express request object
 * @param res Express response object
 * @param next Next middleware function
 */
export function standardizeErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.name || 'InternalServerError',
      message: err.message || 'An unexpected error occurred',
      meta: {
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    }
  });
} 