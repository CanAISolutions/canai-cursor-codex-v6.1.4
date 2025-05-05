/**
 * @file telemetry.ts
 * @description Codex Edition v4.1.3 – Trace-aware metric logging for the debugging pipeline.
 * Writes structured events to .canai-context/metrics.jsonl in JSONL format. Supports read/reset.
 */

import { appendFile, existsSync, mkdirSync, readFile, writeFile } from "fs";
import { promisify } from "util";
import { join } from "path";

const CONTEXT_DIR = ".canai-context";
const METRICS_FILE = "metrics.jsonl";

const appendFileAsync = promisify(appendFile);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

/**
 * Shape of a single metric record.
 */
type MetricRecord = {
  timestamp: string;
  traceId?: string;
  event: string;
  data?: Record<string, unknown>;
};

// Overrideable for test mocking
export const testOverrides = {
  appendFileAsync,
  readFileAsync,
  writeFileAsync,
  mkdirSync,
  existsSync,
};

/**
 * Ensures that the context directory exists.
 */
function ensureContextDir(): void {
  if (!testOverrides.existsSync(CONTEXT_DIR)) {
    testOverrides.mkdirSync(CONTEXT_DIR, { recursive: true });
  }
}

/**
 * Appends a structured JSON line to metrics.jsonl.
 *
 * @param event - Metric event name (e.g. 'fix_proposed')
 * @param data - Optional context (e.g. { filepath, score })
 */
export async function recordMetric(
  event: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    ensureContextDir();

    const timestamp = new Date().toISOString();
    const traceId = data.traceId as string | undefined;

    const record: MetricRecord = {
      timestamp,
      traceId,
      event,
      data,
    };

    const filePath = join(CONTEXT_DIR, METRICS_FILE);
    const serialized = JSON.stringify(record) + "\n";

    await testOverrides.appendFileAsync(filePath, serialized, { encoding: "utf-8" });
  } catch (err: any) {
    const error = new Error(`Failed to record metric: ${err.message}`);
    error.name = "TelemetryError";
    throw error;
  }
}

/**
 * Reads and parses all stored metric records.
 * Used for debugging, dashboards, and replay logic.
 */
export async function readMetrics(): Promise<MetricRecord[]> {
  try {
    const filePath = join(CONTEXT_DIR, METRICS_FILE);
    if (!testOverrides.existsSync(filePath)) return [];

    const content = await testOverrides.readFileAsync(filePath, "utf-8");
    if (!content.trim()) return [];

    return content
      .trim()
      .split("\n")
      .map((line, index) => {
        try {
          return JSON.parse(line) as MetricRecord;
        } catch {
          console.warn(`[telemetry] Skipping invalid metric at line ${index + 1}`);
          return null;
        }
      })
      .filter((record): record is MetricRecord => record !== null);
  } catch (err: any) {
    const error = new Error(`Failed to read metrics: ${err.message}`);
    error.name = "TelemetryError";
    throw error;
  }
}

/**
 * Wipes all stored metrics (used in tests and CI/CD isolation).
 */
export async function clearMetrics(): Promise<void> {
  try {
    const filePath = join(CONTEXT_DIR, METRICS_FILE);
    await testOverrides.writeFileAsync(filePath, "", { encoding: "utf-8" });
  } catch (err: any) {
    const error = new Error(`Failed to clear metrics: ${err.message}`);
    error.name = "TelemetryError";
    throw error;
  }
}
