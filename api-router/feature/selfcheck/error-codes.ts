// error-codes.ts

/**
 * WHAT: Centralized registry of all system error codes.
 * WHY: Enables error standardization, observability, dream-state trust, and AI-safe future handling.
 * HOW: Each error is uniquely identified with a code, message, description, and optional metadata.
 */

export interface ErrorCodeEntry {
    code: string;
    message: string;
    description: string;
    httpStatus?: number;
  }
  
  /**
   * Master error codes catalog.
   */
  export const ErrorCodes: Record<string, ErrorCodeEntry> = {
    ERR1001: {
      code: 'ERR1001',
      message: 'Rate limit exceeded. Please try again later.',
      description: 'Triggered when a user exceeds their allowed request quota within a defined time window.',
      httpStatus: 429,
    },
    ERR1002: {
      code: 'ERR1002',
      message: 'Invalid input detected.',
      description: 'Input payload validation failed due to missing fields, incorrect types, or disallowed values.',
      httpStatus: 400,
    },
    ERR1003: {
      code: 'ERR1003',
      message: 'Authentication failed.',
      description: 'User authentication was unsuccessful due to invalid credentials, token expiration, or missing authorization header.',
      httpStatus: 401,
    },
    ERR1004: {
      code: 'ERR1004',
      message: 'Resource not found.',
      description: 'Requested resource does not exist or has been deleted.',
      httpStatus: 404,
    },
    ERR1005: {
      code: 'ERR1005',
      message: 'Internal server error. Please try again later.',
      description: 'Generic catch-all for unhandled server-side exceptions.',
      httpStatus: 500,
    },
    ERR1006: {
      code: 'ERR1006',
      message: 'Middleware validation failure.',
      description: 'One or more middleware layers failed to initialize or validate correctly.',
      httpStatus: 500,
    },
    ERR1007: {
      code: 'ERR1007',
      message: 'Post-deployment selfcheck failure.',
      description: 'Critical system health check failed during deployment validation.',
      httpStatus: 500,
    },
  };
  