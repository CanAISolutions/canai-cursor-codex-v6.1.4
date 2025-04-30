// middleware-manifest.ts

/**
 * WHAT: Explicit registry of all middleware layers in the system.
 * WHY: Enforces consistent activation order, auditability, and dream-state integrity.
 * HOW: Each entry maps to a middleware module with meta info for versioning and criticality tracking.
 */

import { burstProtectionMiddleware } from './burst-protection-middleware';
import { dynamicTierBurstMiddleware } from './dynamic-tier-burst';
import { handleRateLimitExceededMiddleware } from './handleRateLimitExceeded';
import { rateLimitMiddleware } from './rateLimit';

/**
 * Strong typing for Middleware Registry entries.
 * Supports AI copilots, snapshot safety, and future expansion.
 */
export interface MiddlewareRegistryEntry {
  name: string;
  handler: Function;
  version: string;
  critical: boolean;
}

/**
 * Golden source of truth for all middleware layers.
 * All active middleware must be registered here with correct meta.
 */
export const middlewareManifest: MiddlewareRegistryEntry[] = [
  {
    name: 'burstProtectionMiddleware',
    handler: burstProtectionMiddleware,
    version: 'v1.0.0',
    critical: true,
  },
  {
    name: 'dynamicTierBurstMiddleware',
    handler: dynamicTierBurstMiddleware,
    version: 'v1.0.0',
    critical: true,
  },
  {
    name: 'rateLimitMiddleware',
    handler: rateLimitMiddleware,
    version: 'v1.0.0',
    critical: true,
  },
  {
    name: 'handleRateLimitExceededMiddleware',
    handler: handleRateLimitExceededMiddleware,
    version: 'v1.0.0',
    critical: false,
  },
];
