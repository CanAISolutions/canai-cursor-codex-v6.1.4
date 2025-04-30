/**
 * @codex-purpose: Enforce Dream-State compliant success responses across all API handlers.
 * @codex-system: API Router Output Standardization Layer
 * @codex-critical: Prevents output drift and guarantees Copilot-extensible, emotionally trustworthy API responses.
 * @codex-verified: v1.0.0
 */

type SuccessResponse<T> = {
    success: true;
    data: T;
  };
  
  export function standardizeSuccess<T extends object>(payload: T): SuccessResponse<T> {
    return {
      success: true,
      data: payload ?? {}
    };
  }
  