/**
 * @file errorResponses.ts
 * @description Standardized error response builders for the entire API system.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { errorMap, ErrorCode } from "./errorMap";

interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

/**
 * Builds a standardized error response object.
 * 
 * @param code - A valid ErrorCode from the errorMap.
 * @returns ErrorResponse - A safe, standardized API error response.
 */
export function buildErrorResponse(code: ErrorCode): ErrorResponse {
  const errorEntry = errorMap[code];

  return {
    success: false,
    error: {
      code: errorEntry.code,
      message: errorEntry.message,
    },
  };
}

/**
 * A shortcut for throwing an Error with serialized JSON response.
 * Useful for edge cases where immediate failure is needed.
 *
 * @param code - A valid ErrorCode from the errorMap.
 */
export function throwApiError(code: ErrorCode): never {
  const response = buildErrorResponse(code);
  throw new Error(JSON.stringify(response));
}
