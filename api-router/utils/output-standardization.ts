// output-standardization.ts

/**
 * WHAT: Output standardization utilities for consistent dream-state API responses.
 * WHY: Ensures every API response follows a predictable success/failure structure to improve frontend, AI, and UX reliability.
 * HOW: Wraps raw payloads or errors into a unified format object.
 */

export function standardizeSuccess(payload: any) {
    return {
      success: true,
      payload,
      errors: [],
    };
  }
  
  export function standardizeError(errors: string[]) {
    return {
      success: false,
      payload: null,
      errors,
    };
  }
  