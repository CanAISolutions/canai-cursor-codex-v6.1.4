/**
 * @codex-purpose: Local development utility to validate Dream-State API payloads for emotional UX and structural integrity.
 * @codex-system: Dream-State Inline Validation Layer
 * @codex-critical: Catches output drift before tests/CI, preserves Codex emotional standards across all scaling phases.
 * @codex-verified: v1.0.0
 */

export type DreamStatePayload =
  | { success: true; data: Record<string, any> }
  | { success: false; error: { code: string; message: string }; meta?: Record<string, any> };

export function validateDreamStatePayload(payload: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (typeof payload !== "object" || payload === null) {
    issues.push("Payload must be a non-null object.");
    return { valid: false, issues };
  }

  if (typeof payload.success !== "boolean") {
    issues.push("Missing or invalid 'success' field (must be boolean).");
  }

  if (payload.success === true) {
    if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      issues.push("Success payload must have a 'data' object.");
    }
  } else {
    if (!payload.error || typeof payload.error !== "object") {
      issues.push("Error payload must have an 'error' object.");
    } else {
      if (typeof payload.error.code !== "string") {
        issues.push("Error object missing 'code' (string required).");
      }
      if (typeof payload.error.message !== "string") {
        issues.push("Error object missing 'message' (string required).");
      }
    }

    if (payload.meta && typeof payload.meta !== "object") {
      issues.push("Optional 'meta' field must be an object if present.");
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
