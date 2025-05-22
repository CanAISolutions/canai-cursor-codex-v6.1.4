// postDeploySelfcheck.ts

/**
 * WHAT: Post-deployment selfcheck to validate live app state against middleware and routes manifests.
 * WHY: Prevent silent operational decay, enforce dream-state integrity, and ensure safe scalability.
 * HOW: Compares live middleware stack and route registrations with source-of-truth manifests.
 */

import { middlewareManifest } from '../../middleware/middleware-manifest';
import { routesManifest } from './routes-manifest';
import { Express } from 'express';

/**
 * Structure for post-deployment selfcheck results.
 */
interface PostDeploySelfcheckResult {
  success: boolean;
  mismatches: string[];
}

type LiveRoute = { path: string; method: string };

/**
 * Perform post-deployment checks.
 * @param app - Express app instance
 * @returns PostDeploySelfcheckResult
 */
export function runPostDeploySelfcheck(app: Express): PostDeploySelfcheckResult {
  const mismatches: string[] = [];

  // === Middleware Validation ===
  const liveMiddlewareNames = app._router.stack
    .filter((layer: any) => layer?.handle?.name)
    .map((layer: any) => layer.handle.name);

  middlewareManifest.forEach((entry, index) => {
    if (!liveMiddlewareNames.includes(entry.handler.name)) {
      mismatches.push(`Missing middleware: ${entry.name}`);
    } else if (liveMiddlewareNames.indexOf(entry.handler.name) !== index) {
      mismatches.push(`Incorrect middleware order: ${entry.name}`);
    }
  });

  // === Routes Validation ===
  const liveRoutes: LiveRoute[] = app._router.stack
    .filter((layer: any) => layer.route)
    .map((layer: any) => ({
      path: layer.route.path,
      method: Object.keys(layer.route.methods)[0],
    }));

  routesManifest.forEach((expectedRoute) => {
    const match = liveRoutes.find(
      (r: LiveRoute) => r.path === expectedRoute.path && r.method.toLowerCase() === expectedRoute.method.toLowerCase()
    );
    if (!match) {
      mismatches.push(`Missing or incorrect route: ${expectedRoute.method.toUpperCase()} ${expectedRoute.path}`);
    }
  });

  return {
    success: mismatches.length === 0,
    mismatches,
  };
}
