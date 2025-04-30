/**
 * @codex-purpose: Enforce Dream-State compliant error responses across all API handlers.
 * @codex-system: API Router Output Standardization Layer
 * @codex-critical: Prevents emotional UX fractures and enables Copilot-safe error handling structures.
 * @codex-verified: v1.0.0
 */

type ErrorResponse = {
    success: false;
    error: {
      code: string;
      message: string;
    };
  };
  
  export function standardizeError(code: string, message: string): ErrorResponse {
    return {
      success: false,
      error: {
        code,
        message
      }
    };
  }
  