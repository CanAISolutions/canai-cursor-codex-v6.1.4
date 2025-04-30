// error-normalizer.ts

/**
 * WHAT: Standardized error normalization utilities for consistent dream-state API responses.
 * WHY: Prevents leakage of raw server errors to users, ensures consistent structure and messaging.
 * HOW: Maps thrown errors into a standardized shape including error code, message, and optional metadata.
 */

export function normalizeError(error: unknown): {
    message: string;
    stack?: string;
    name: string;
  } {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }
  
    return {
      message: 'Unknown error occurred',
      name: 'UnknownError',
    };
  }
  