/**
 * @codex-purpose: Standardize and emotionally protect all rate limit failure responses in the API Router.
 * @codex-system: API Router Rate Limit UX Preservation Layer
 * @codex-critical: Prevents raw 429 leaks, preserves emotional UX during overload, and ensures Copilot snapshot safety.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";

type RateLimitMeta = {
  retryAfter?: number;
  limit?: number;
  remaining?: number;
};

export function handleRateLimitExceeded(req: Request, res: Response, next: NextFunction, meta?: RateLimitMeta) {
  const responsePayload: any = {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "You're sending requests too quickly. Please slow down and try again."
    }
  };

  if (meta) {
    responsePayload.meta = {};
    if (typeof meta.retryAfter === "number") {
      responsePayload.meta.retryAfter = meta.retryAfter;
      res.setHeader("Retry-After", meta.retryAfter);
    }
    if (typeof meta.limit === "number") {
      responsePayload.meta.limit = meta.limit;
    }
    if (typeof meta.remaining === "number") {
      responsePayload.meta.remaining = meta.remaining;
    }
  }

  res.status(429).json(responsePayload);
}
