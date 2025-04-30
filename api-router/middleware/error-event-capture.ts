/**
 * @codex-purpose: Automatically capture structured error events for Dream-State devtools dashboard.
 * @codex-system: Middleware - Error Telemetry Capture
 * @codex-critical: Enables live developer observability without leaking sensitive system data.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { errorEventStore } from "../devtools/errors/error-event.store";

/**
 * Error Event Capture Middleware
 * Captures major system errors into the devtools error telemetry store.
 */
export function errorEventCapture(err: any, req: Request, res: Response, next: NextFunction) {
  try {
    // Only capture in non-production for security reasons
    if (process.env.NODE_ENV !== "production") {
      const code = err?.code || "INTERNAL_ERROR";
      const message = err?.message || "An unknown error occurred.";

      errorEventStore.captureError(code, message);
    }
  } catch (captureErr) {
    // Silent fail - do not allow error telemetry failure to block main app
    console.error("[Error Capture Failure]", captureErr);
  }

  // Always continue to next error handler
  next(err);
}
