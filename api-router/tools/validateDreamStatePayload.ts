/**
 * @codex-purpose: Local development utility to validate Dream-State API payloads for emotional UX and structural integrity.
 * @codex-system: Dream-State Inline Validation Layer
 * @codex-critical: Catches output drift before tests/CI, preserves Codex emotional standards across all scaling phases.
 * @codex-verified: v1.0.0
 */

/**
 * Validates a DreamState payload
 * @param payload The payload to validate
 * @returns Object containing validation result and any issues found
 */
export function validateDreamStatePayload(payload: any): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check if payload is a non-null object
  if (!payload || typeof payload !== 'object') {
    issues.push('Payload must be a non-null object');
    return { valid: false, issues };
  }

  // Check if success field exists and is boolean
  if (typeof payload.success !== 'boolean') {
    issues.push('Missing or invalid success field');
    return { valid: false, issues };
  }

  // Check success payload structure
  if (payload.success === true) {
    if (!payload.data || typeof payload.data !== 'object') {
      issues.push('Success payload must have a data object');
    }
  }

  // Check error payload structure
  if (payload.success === false) {
    if (!payload.error || typeof payload.error !== 'object') {
      issues.push('Error payload must have an error object');
    } else {
      if (!payload.error.code || typeof payload.error.code !== 'string') {
        issues.push('Error object must have a code string');
      }
      if (!payload.error.message || typeof payload.error.message !== 'string') {
        issues.push('Error object must have a message string');
      }
    }

    // Check meta field if present
    if (payload.meta !== undefined && typeof payload.meta !== 'object') {
      issues.push('meta field must be an object if present');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
