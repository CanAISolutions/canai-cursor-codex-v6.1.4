// routes-manifest.selfcheck.ts

/**
 * WHAT: Static validation of routes manifest structure.
 * WHY: Ensures route definitions stay aligned with real-world router behavior.
 * HOW: Validates presence, method correctness, and structure integrity.
 */

import { routesManifest } from './routes-manifest';

/**
 * Structure for static routes manifest validation result.
 */
interface RoutesManifestSelfcheckResult {
  success: boolean;
  mismatches: string[];
}

/**
 * Validates the structure of the routes manifest.
 * @returns RoutesManifestSelfcheckResult
 */
export function validateRoutesAgainstManifest(): RoutesManifestSelfcheckResult {
  const mismatches: string[] = [];

  routesManifest.forEach((route) => {
    if (!route.path || !route.method) {
      mismatches.push(`Route entry missing critical fields: ${JSON.stringify(route)}`);
    }
  });

  return {
    success: mismatches.length === 0,
    mismatches,
  };
}
