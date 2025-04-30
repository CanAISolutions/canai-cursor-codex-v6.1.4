/**
 * @codex-purpose: Auto-generate route manifest from routeMeta exports across features.
 * @codex-system: Dream-State Routing Source of Truth
 * @codex-critical: Prevents silent drift between live routers and manifest declarations, ensures future scalability.
 * @codex-verified: v1.0.0
 */

import { RouteMeta } from "../posts/posts-router"; 
// (Import other feature metas here in the future)

/**
 * Standard route manifest entry structure.
 */
export interface RouteManifestEntry {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  requiresValidation?: boolean;
  requiresAuth?: boolean;
  rateLimited?: boolean;
  description?: string;
}

/**
 * Consolidate all feature route metas into a unified manifest.
 */
export const routesManifest: RouteManifestEntry[] = [
  ...Object.values(RouteMeta)
  // , ...Object.values(OtherFeatureRouteMeta)
];
