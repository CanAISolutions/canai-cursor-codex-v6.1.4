/**
 * @codex-purpose: Dynamic rate limiting enforcement middleware based on routeMeta.
 * @codex-system: Dream-State Adaptive Rate Limiting Engine
 * @codex-critical: Preserves platform stability and UX under load with traceable rate-limiting events.
 * @codex-verified: v1.1.0
 */

import { Request, Response, NextFunction } from "express";
import { getRouteMeta } from "../utils/route-meta-accessor";

export function rateLimitChecker(req: Request, res: Response, next: NextFunction) {
  const meta = getRouteMeta(req.app, req.method, req.path);

  if (meta?.rateLimited) {
    const now = Date.now();
    const identifier = req.ip || "unknown";

    if (!req.app.locals.requestTracker) {
      req.app.locals.requestTracker = {};
    }

    const tracker = req.app.locals.requestTracker[identifier] || { count: 0, timestamp: now };

    if (now - tracker.timestamp < 3000) {
      tracker.count++;
      if (tracker.count > 10) {
        return res.status(429).json({
          success: false,
          payload: null,
          errors: [
            { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please slow down." }
          ],
          meta: { errorOrigin: "rateLimitChecker" }
        });
      }
    } else {
      tracker.count = 1;
      tracker.timestamp = now;
    }

    req.app.locals.requestTracker[identifier] = tracker;
  }

  return next();
}
