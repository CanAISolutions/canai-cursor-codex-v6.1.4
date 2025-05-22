/**
 * @codex-purpose: Enforce Dream-State compliant success responses across all API handlers.
 * @codex-system: API Router Output Standardization Layer
 * @codex-critical: Prevents output drift and guarantees Copilot-extensible, emotionally trustworthy API responses.
 * @codex-verified: v1.0.0
 *
 * WHAT: Standardizes all API success responses to include success, payload, errors, and meta fields.
 * WHY: Ensures emotional UX safety, structural predictability, and Codex auditability across all success pathways.
 * HOW: Returns a consistent object with required fields, defaulting to empty objects/arrays as needed. Accepts optional meta argument.
 */

export type StandardizeSuccessResponse<T> = {
  success: true;
  payload: T;
  errors: any[];
  meta: Record<string, any>;
};

export function standardizeSuccess<T extends object>(payload?: T, meta: Record<string, any> = {}): StandardizeSuccessResponse<T> {
  // Always return a Codex-compliant success payload with emotional UX safety and auditability
  return {
    success: true,
    payload: (payload ?? ({} as T)),
    errors: [],
    meta: meta ?? {}
  };
}
  