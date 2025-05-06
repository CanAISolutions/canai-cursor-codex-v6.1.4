/**
 * @codex-purpose: Dream-State aligned, in-memory rate limiting middleware for early-stage platform protection.
 * @codex-system: API Router Rate Limit Layer
 * @codex-critical: Prevents overload-based UX fractures, operational decay, and enables future Redis scaling.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitCounter {
  count: number;
  resetTime: number;
}

const requestCounters = new Map<string, RateLimitCounter>();

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100
};

/**
 * Middleware to implement rate limiting
 * @param config Rate limit configuration
 * @returns Express middleware function
 */
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const { windowMs, maxRequests } = { ...defaultConfig, ...config };

  return function(req: Request, res: Response, next: NextFunction): void {
    const key = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const now = Date.now();

    const counter = requestCounters.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > counter.resetTime) {
      requestCounters.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }

    if (counter.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: 'RateLimitExceeded',
          message: 'Too many requests',
          meta: {
            retryAfter: Math.ceil((counter.resetTime - now) / 1000)
          }
        }
      });
      return;
    }

    counter.count++;
    requestCounters.set(key, counter);
    next();
  };
}

// 🛡 Expansion Path (future-proofed):
// - At 10K+ active users: migrate `requestCounters` to Redis (global memory-safe tracking).
// - At multi-plan monetization: inject dynamic `maxRequests` based on user plan tier metadata.
// - At enterprise scale: integrate predictive auto-tuning (dynamic maxRequests per IP/session).
