/**
 * @file fix-context-utils.ts
 * @description Codex Edition v4.1.3 – Structured trace logging for the debugging pipeline.
 * Appends human-readable and machine-readable entries to `.canai-context/fix.log`.
 * Supports both string and JSON logs. Async I/O with optional debug echo.
 */

import { appendFile, existsSync, mkdirSync } from "fs";
import { promisify } from "util";
import { join } from "path";

const CONTEXT_DIR = ".canai-context";
const DEFAULT_FILENAME = "fix.log";
const DEBUG_MODE = process.env.DEBUG_MODE === "true";

const appendFileAsync = promisify(appendFile);

// Allows test overrides for fs methods
export const testOverrides = {
  appendFileAsync,
  mkdirSync,
  existsSync,
};

/**
 * Ensures the logging directory exists.
 * Safe to call multiple times.
 */
function ensureContextDir(): void {
  if (!testOverrides.existsSync(CONTEXT_DIR)) {
    testOverrides.mkdirSync(CONTEXT_DIR, { recursive: true });
  }
}

/**
 * Replaces newlines and redundant whitespace in a log message.
 */
function sanitizeMessage(message: string): string {
  return message
    .replace(/[\r\n]+/g, " ") // Collapse newlines
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Appends a timestamped message to the fix context file.
 *
 * @param message - Human-readable message or status update
 * @param filename - Optional override (defaults to fix.log)
 * @param traceId - Optional trace ID for inline tagging
 */
export async function appendToFixContextAsync(
  message: string,
  filename: string = DEFAULT_FILENAME,
  traceId?: string
): Promise<void> {
  try {
    ensureContextDir();
    const timestamp = new Date().toISOString();
    const trace = traceId ? `[${traceId}]` : "";
    const entry = `[${timestamp}] ${trace} ${sanitizeMessage(message)}\n`;

    const filePath = join(CONTEXT_DIR, filename);
    await testOverrides.appendFileAsync(filePath, entry, { encoding: "utf-8" });

    if (DEBUG_MODE) console.log(entry.trim());
  } catch (err: any) {
    const error = new Error(`Failed to write context: ${err.message}`);
    error.name = "FixContextError";
    throw error;
  }
}

/**
 * Appends a JSON object to the fix context file, serialized as one line.
 *
 * @param data - Any object to log
 * @param filename - Optional override
 * @param traceId - Optional trace ID for correlation
 */
export async function appendJsonToContextAsync(
  data: Record<string, unknown>,
  filename: string = DEFAULT_FILENAME,
  traceId?: string
): Promise<void> {
  try {
    ensureContextDir();
    const timestamp = new Date().toISOString();
    const trace = traceId ? `[${traceId}]` : "";
    const json = JSON.stringify(data);
    const entry = `[${timestamp}] ${trace} ${json}\n`;

    const filePath = join(CONTEXT_DIR, filename);
    await testOverrides.appendFileAsync(filePath, entry, { encoding: "utf-8" });

    if (DEBUG_MODE) console.log(entry.trim());
  } catch (err: any) {
    const error = new Error(`Failed to write JSON context: ${err.message}`);
    error.name = "FixContextError";
    throw error;
  }
}
