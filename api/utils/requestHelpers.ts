/**
 * @file requestHelpers.ts
 * @description Common safe parsing and method enforcement utilities for API requests.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest } from "next";
import { throwApiError } from "../errors/errorResponses";

/**
 * Enforces HTTP method for API endpoints
 * @param req - Next.js API request object
 * @param allowedMethods - Array of allowed HTTP methods
 * @throws Error if method not allowed
 */
export function enforceHttpMethod(req: NextApiRequest, allowedMethods: string[]): void {
  if (!req.method || !allowedMethods.includes(req.method)) {
    throw new Error(`Method ${req.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`);
  }
}

/**
 * Safely parses JSON with fallback
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeParseJson<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
}

/**
 * Safely trims string input with null/undefined handling
 * @param input - Input string to trim
 * @returns Trimmed string or empty string if input is null/undefined
 */
export function safeTrim(input: string | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  return String(input).trim();
}

/**
 * Retrieves a specific header safely.
 * 
 * @param req - The incoming Next.js API request.
 * @param headerKey - The name of the header to retrieve.
 * @returns - The header value or throws if missing.
 */
export function getHeaderOrThrow(req: NextApiRequest, headerKey: string): string {
  const value = req.headers[headerKey.toLowerCase()];
  
  if (!value || typeof value !== "string") {
    throwApiError("VALIDATION_FAILED");
  }

  return value;
}
