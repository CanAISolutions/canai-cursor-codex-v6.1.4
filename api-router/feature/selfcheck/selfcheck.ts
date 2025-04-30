/**
 * @codex-purpose: Master orchestrator for all system selfchecks.
 * @codex-system: Dream-State Selfcheck Enforcement Layer
 * @codex-critical: Guarantees operational health, prevents silent decay, enforces codified system standards.
 * @codex-verified: v1.1.0
 */

import { runPostDeploySelfcheck } from "./postDeploySelfcheck";
import { validateRoutesAgainstManifest } from "./routes-manifest.selfcheck";
import { runInputValidationSelfcheck } from "./input-validation-selfcheck";
import { runRouteMetaSelfcheck } from "./selfcheck-route-meta";

import { Express } from "express";

/**
 * Structure for full selfcheck report output.
 */
interface SelfcheckReport {
  success: boolean;
  details: Record<string, boolean>;
  mismatches: Record<string, string[]>;
}

/**
 * Executes all system selfchecks in a unified orchestration flow.
 * @param app Express app instance
 * @returns Promise<SelfcheckReport>
 */
export async function runFullSelfcheck(app: Express): Promise<SelfcheckReport> {
  const mismatches: Record<string, string[]> = {};
  const details: Record<string, boolean> = {};

  // --- 1. Post-Deployment Middleware/Route Health Check ---
  const postDeployResult = runPostDeploySelfcheck(app);
  details["postDeploySelfcheck"] = postDeployResult.success;
  mismatches["postDeploySelfcheck"] = postDeployResult.mismatches;

  // --- 2. Static Routes Manifest Integrity Check ---
  const routesManifestResult = validateRoutesAgainstManifest();
  details["routesManifestSelfcheck"] = routesManifestResult.success;
  mismatches["routesManifestSelfcheck"] = routesManifestResult.mismatches;

  // --- 3. Input Validation Enforcement Check ---
  const inputValidationResult = runInputValidationSelfcheck();
  details["inputValidationSelfcheck"] = inputValidationResult.success;
  mismatches["inputValidationSelfcheck"] = inputValidationResult.missingValidationRoutes.map(
    (route) => `${route.method} ${route.path}`
  );

  // --- 4. Route Meta Contract Consistency Check ---
  const routeMetaResult = runRouteMetaSelfcheck(app);
  details["routeMetaSelfcheck"] = routeMetaResult.success;
  mismatches["routeMetaSelfcheck"] = routeMetaResult.mismatches;

  // --- Final Aggregation ---
  const success = Object.values(details).every(Boolean);

  return {
    success,
    details,
    mismatches,
  };
}
