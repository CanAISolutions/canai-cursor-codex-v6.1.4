/**
 * @codex-purpose: Dynamically adjust burst protection thresholds based on user tier and configuration.
 * @codex-system: Dream-State Dynamic Tiered Burst Protection Engine
 * @codex-critical: Prevents mechanical throttling by adjusting burst protection thresholds based on tier dynamically.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";

// Type definition for tiered burst protection
type BurstProtectionOptions = {
  maxBurstRequests: number;
  burstWindowMs: number;
  responseMessage: string;
  tier: string;
};

// Tier configuration profiles
const tierConfigurations: Record<string, BurstProtectionOptions> = {
  free: {
    maxBurstRequests: 5,
    burstWindowMs: 3000,
    responseMessage: "You're making a lot of requests! Let's pace them out together.",
    tier: "free"
  },
  standard: {
    maxBurstRequests: 10,
    burstWindowMs: 3000,
    responseMessage: "Thanks for your activity! Let's just slow it down a touch for better service.",
    tier: "standard"
  },
  premium: {
    maxBurstRequests: 20,
    burstWindowMs: 2000,
    responseMessage: "You're sending a lot of requests — we're pacing it gently to keep your experience smooth.",
    tier: "premium"
  },
  enterprise: {
    maxBurstRequests: 50,
    burstWindowMs: 1000,
    responseMessage: "High activity detected — we're balancing traffic to maintain your service quality.",
    tier: "enterprise"
  }
};

// Default fallback tier
const defaultTier: BurstProtectionOptions = tierConfigurations.standard;

/**
 * Dream-State Dynamic Burst Protection Middleware
 * Returns an Express middleware function.
 */
export function dynamicTierBurstProtection() {
  return function (req: Request, res: Response, next: NextFunction): void {
    const userTier = (req as any).user?.tier || 'standard'; // Assume `req.user.tier` exists
    const config = tierConfigurations[userTier] || defaultTier;

    const identifier = req.ip || "unknown"; // Track by IP or fallback identifier
    const now = Date.now();

    // Initialize burst tracker if missing
    if (!req.app.locals.burstRequestTracker) {
      req.app.locals.burstRequestTracker = {};
    }

    const burstTracker = req.app.locals.burstRequestTracker[identifier] || { count: 0, firstRequestTimestamp: now };

    // Still within burst window
    if (now - burstTracker.firstRequestTimestamp < config.burstWindowMs) {
      burstTracker.count++;

      if (burstTracker.count > config.maxBurstRequests) {
        res.setHeader("Retry-After", Math.ceil(config.burstWindowMs / 1000).toString());
        res.status(429).json({
          success: false,
          error: {
            code: "BURST_PROTECTION",
            message: config.responseMessage
          }
        });
        return;
      }
    } else {
      // Reset burst window
      burstTracker.count = 1;
      burstTracker.firstRequestTimestamp = now;
    }

    req.app.locals.burstRequestTracker[identifier] = burstTracker;
    next();
  };
}

// Attach runtime metadata for introspection and selfchecking
(dynamicTierBurstProtection as any).strategyVersion = 'v1.0.0';
(dynamicTierBurstProtection as any).strategyName = 'dynamic-tier-burst-protection';
(dynamicTierBurstProtection as any).codexVerified = true;
(dynamicTierBurstProtection as any).codexPurpose = 'Dynamically adjust burst protection thresholds based on user tier and configuration.';
(dynamicTierBurstProtection as any).codexCritical = true;

// Codex: Named export for test compatibility
export const dynamicTierBurstMiddleware = dynamicTierBurstProtection;
