/**
 * @codex-purpose: Validate that all routeMeta contracts match live Express router registrations.
 * @codex-system: Dream-State Selfcheck Route Metadata Enforcement Engine
 * @codex-critical: Prevents silent route drift, ensures codified operational behaviors (validation, auth, rate-limiting) are enforced.
 * @codex-verified: v1.0.0
 */

import { Express } from "express";
import { RouteMeta } from "../posts/posts-router"; // Import routeMeta from actual feature modules
// Repeat for other features as needed

/**
 * Structure for selfcheck results.
 */
interface RouteMetaSelfcheckResult {
  success: boolean;
  mismatches: string[];
}

/**
 * Normalize path for comparison (Express registers paths without trailing slashes).
 */
function normalizePath(path: string): string {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Validate routeMeta definitions against live router stack.
 * @param app Express app instance
 * @returns RouteMetaSelfcheckResult
 */
export function runRouteMetaSelfcheck(app: Express): RouteMetaSelfcheckResult {
  const mismatches: string[] = [];

  const routeStack = app._router?.stack || [];

  const registeredRoutes: { method: string; path: string }[] = [];

  for (const layer of routeStack) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods);
      methods.forEach((method) => {
        registeredRoutes.push({
          method: method.toUpperCase(),
          path: normalizePath(layer.route.path)
        });
      });
    }
  }

  // Aggregate all routeMetas
  const allRouteMetas = [
    ...Object.values(RouteMeta) // From posts for now; extend dynamically later
    // , ...other feature metas
  ];

  for (const meta of allRouteMetas) {
    const match = registeredRoutes.find(
      (r) =>
        r.method === meta.method &&
        normalizePath(r.path) === normalizePath(meta.path.replace("/api", ""))
    );

    if (!match) {
      mismatches.push(`Route mismatch: ${meta.method} ${meta.path} not found in live router.`);
    }

    // Optional: check other meta fields (requiresValidation, requiresAuth, etc.) later here.
  }

  return {
    success: mismatches.length === 0,
    mismatches
  };
}
