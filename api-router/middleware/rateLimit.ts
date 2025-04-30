/**
 * @codex-purpose: Dream-State aligned, in-memory rate limiting middleware for early-stage platform protection.
 * @codex-system: API Router Rate Limit Layer
 * @codex-critical: Prevents overload-based UX fractures, operational decay, and enables future Redis scaling.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { handleRateLimitExceeded } from "./handleRateLimitExceeded";

type RateLimitOptions = {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum allowed requests per window
};

const requestCounters = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip; // Basic IP-based rate limiting

    const now = Date.now();
    const counter = requestCounters.get(key);

    if (!counter || now > counter.resetTime) {
      requestCounters.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (counter.count < maxRequests) {
      counter.count += 1;
      return next();
    }

    const retryAfterSeconds = Math.ceil((counter.resetTime - now) / 1000);

    handleRateLimitExceeded(req, res, next, {
      retryAfter: retryAfterSeconds,
      limit: maxRequests,
      remaining: 0
    });
  };
}

// 🛡 Expansion Path (future-proofed):
// - At 10K+ active users: migrate `requestCounters` to Redis (global memory-safe tracking).
// - At multi-plan monetization: inject dynamic `maxRequests` based on user plan tier metadata.
// - At enterprise scale: integrate predictive auto-tuning (dynamic maxRequests per IP/session).
