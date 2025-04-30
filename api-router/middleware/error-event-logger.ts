/**
 * @codex-purpose: Global error event logger middleware for Dream-State platform.
 * @codex-system: Dream-State Error Intelligence Layer
 * @codex-critical: Captures, standardizes, and buffers error events for observability and monitoring.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";

/**
 * Structure of an error event.
 */
interface ErrorEvent {
  timestamp: number;
  path: string;
  method: string;
  statusCode: number;
  errorCodes: string[];
  errorMessages: string[];
  errorOrigin?: string;
  ip?: string;
  userId?: string; // If available via req.user.id
}

/**
 * Attach an in-memory error buffer to the app.
 */
export function attachErrorEventBuffer(app: any) {
  app.locals.errorEventBuffer = [];
}

/**
 * Middleware to capture and log error responses.
 */
export function errorEventLogger(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (body) {
    try {
      if (body?.success === false && body?.errors) {
        const errorEvent: ErrorEvent = {
          timestamp: Date.now(),
          path: req.path,
          method: req.method,
          statusCode: res.statusCode,
          errorCodes: body.errors.map((e: any) => e.code),
          errorMessages: body.errors.map((e: any) => e.message),
          errorOrigin: body.meta?.errorOrigin || undefined,
          ip: req.ip,
          userId: req.user?.id
        };

        req.app.locals.errorEventBuffer.push(errorEvent);

        // Optional: limit buffer size to prevent memory overflow
        if (req.app.locals.errorEventBuffer.length > 1000) {
          req.app.locals.errorEventBuffer.shift(); // remove oldest
        }
      }
    } catch (err) {
      console.error("Error buffering error event:", err);
    }

    return originalJson.call(this, body);
  };

  next();
}
