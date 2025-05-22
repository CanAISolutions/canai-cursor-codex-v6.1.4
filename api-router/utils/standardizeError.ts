/**
 * @codex-purpose: Enforce Dream-State compliant error responses across all API handlers.
 * @codex-system: API Router Output Standardization Layer
 * @codex-critical: Prevents emotional UX fractures and enables Copilot-safe error handling structures.
 * @codex-verified: v1.0.0
 *
 * WHAT: Standardizes all API error responses to include success, payload, errors, and meta fields.
 * WHY: Ensures emotional UX resilience, structural predictability, and Codex auditability across all error pathways.
 * HOW: Returns a consistent object with required fields, defaulting to null/empty objects/arrays as needed. Accepts optional meta argument.
 */

export type StandardizeErrorResponse = {
  success: false;
  payload: null;
  errors: { code: string; message: string }[];
  meta: Record<string, any>;
};

export function standardizeError(code: string, message: string, meta: Record<string, any> = {}): StandardizeErrorResponse {
  // Always return a Codex-compliant error payload with emotional UX resilience and auditability
  return {
    success: false,
    payload: null,
    errors: [{ code, message }],
    meta: meta ?? {}
  };
}
  