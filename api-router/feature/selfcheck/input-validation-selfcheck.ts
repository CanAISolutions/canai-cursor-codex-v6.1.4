/**
 * @codex-purpose: Detect missing input validation in POST and PUT routes at static check time.
 * @codex-system: Dream-State Selfcheck Enforcement Engine
 * @codex-critical: Prevents operational decay, UX damage, and security vulnerabilities caused by missing input validation.
 * @codex-verified: v1.0.0
 */

import { routesManifest } from "./routes-manifest";

/**
 * Structure for validation selfcheck results.
 */
interface InputValidationSelfcheckResult {
  success: boolean;
  missingValidationRoutes: { method: string; path: string }[];
}

/**
 * Detects if any POST or PUT routes are missing input validation.
 * Flags manifest entries that do not declare validation requirement.
 */
export function runInputValidationSelfcheck(): InputValidationSelfcheckResult {
  const missingValidationRoutes: { method: string; path: string }[] = [];

  routesManifest.forEach((route) => {
    if ((route.method === "POST" || route.method === "PUT") && !route.requiresValidation) {
      missingValidationRoutes.push({ method: route.method, path: route.path });
    }
  });

  return {
    success: missingValidationRoutes.length === 0,
    missingValidationRoutes
  };
}
