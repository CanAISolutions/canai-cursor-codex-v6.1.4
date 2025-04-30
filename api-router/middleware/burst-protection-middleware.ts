/**
 * @codex-purpose: Detect and gracefully respond to burst traffic patterns separately from standard rate limiting.
 * @codex-system: Dream-State Burst Protection Engine
 * @codex-critical: Prevents mechanical throttling and preserves emotional UX during sudden load spikes.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";

type BurstProtectionOptions = {
  maxBurstRequests: number;
  burstWindowMs: number;
  responseMessage?: string;
};

const defaultOptions: BurstProtectionOptions = {
  maxBurstRequests: 10,
  burstWindowMs: 3000,
  responseMessage: "You're making a lot of requests! Let's pace them out for better service."
};

const burstRequestTracker: Record<string, { count: number; firstRequestTimestamp: number }> = {};

/**
 * Dream-State Burst Protection Middleware
 * @param options Optional override settings
 */
export function burstProtectionMiddleware(options: Partial<BurstProtectionOptions> = {}) {
  const config = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || "unknown"; // Future: support API key or user ID if available
    const now = Date.now();

    if (!burstRequestTracker[identifier]) {
      burstRequestTracker[identifier] = { count: 1, firstRequestTimestamp: now };
      return next();
    }

    const record = burstRequestTracker[identifier];

    if (now - record.firstRequestTimestamp < config.burstWindowMs) {
      record.count++;

      if (record.count > config.maxBurstRequests) {
        res.setHeader("Retry-After", Math.ceil(config.burstWindowMs / 1000).toString());
        return res.status(429).json({
          success: false,
          error: {
            code: "BURST_PROTECTION",
            message: config.responseMessage
          }
        });
      }

      return next();
    } else {
      // Reset burst tracker for new window
      burstRequestTracker[identifier] = { count: 1, firstRequestTimestamp: now };
      return next();
    }
  };
}
