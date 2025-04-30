/**
 * @file common.ts
 * @description Lightweight reusable utilities for general-purpose operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Safely trims a string, returning undefined if input is not a string.
 *
 * @param input - Raw input to be trimmed.
 * @returns - Trimmed string or undefined.
 */
export function safeTrim(input: unknown): string | undefined {
    if (typeof input !== "string") {
      return undefined;
    }
    return input.trim();
  }
  
  /**
   * Returns the current timestamp in ISO8601 format.
   *
   * @returns - Current timestamp string.
   */
  export function getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
  
  /**
   * Safely compares two strings using constant time to prevent timing attacks.
   *
   * @param a - First string.
   * @param b - Second string.
   * @returns - True if strings are equal, false otherwise.
   */
  export function safeStringCompare(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
  
    if (bufferA.length !== bufferB.length) {
      return false;
    }
  
    return crypto.timingSafeEqual(bufferA, bufferB);
  }
  