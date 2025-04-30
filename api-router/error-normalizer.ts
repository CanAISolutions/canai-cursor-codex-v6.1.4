/**
 * @codex-purpose: Normalize all system, service, and user-thrown errors into a standard emotional UX-safe format.
 * @codex-system: API Router Error Handling Layer
 * @codex-critical: Prevents raw system errors leaking to users; preserves Dream-State emotional UX under failure.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";

export function errorNormalizer(err: any, req: Request, res: Response, next: NextFunction) {
  const normalizedError = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later."
    }
  };

  if (err && typeof err === "object") {
    if (err.code && typeof err.code === "string" && err.message && typeof err.message === "string") {
      normalizedError.error.code = err.code;
      normalizedError.error.message = err.message;
    }
    else if (err.name === "ValidationError") {
      normalizedError.error.code = "VALIDATION_FAILED";
      normalizedError.error.message = "Some required fields are missing or invalid.";
    }
    else if (err.name === "UnauthorizedError") {
      normalizedError.error.code = "AUTH_REQUIRED";
      normalizedError.error.message = "Authentication required to continue.";
    }
  }

  res.status(mapErrorCodeToStatus(normalizedError.error.code)).json(normalizedError);
}

function mapErrorCodeToStatus(code: string): number {
  switch (code) {
    case "VALIDATION_FAILED":
      return 400;
    case "AUTH_REQUIRED":
      return 401;
    case "ACCESS_DENIED":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "RATE_LIMIT_EXCEEDED":
      return 429;
    case "INTERNAL_SERVER_ERROR":
    default:
      return 500;
  }
}
