/**
 * @file validate-metrics.ts
 * @description Codex QA Utility – Validates the structure and completeness of all metric entries.
 * Ensures .canai-context/metrics.jsonl is well-formed, trace-safe, and CI-ready.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const CONTEXT_DIR = ".canai-context";
const METRICS_FILE = "metrics.jsonl";
const filePath = join(CONTEXT_DIR, METRICS_FILE);

let invalidCount = 0;

function logError(message: string) {
  console.error(`❌ [validate-metrics] ${message}`);
  invalidCount += 1;
}

function logWarning(message: string) {
  console.warn(`⚠️  [validate-metrics] ${message}`);
}

function validateMetric(line: string, index: number) {
  try {
    const parsed = JSON.parse(line);

    if (!parsed.timestamp) logError(`Missing 'timestamp' at line ${index + 1}`);
    if (!parsed.event) logError(`Missing 'event' at line ${index + 1}`);

    if (!parsed.traceId) {
      logWarning(`Missing 'traceId' at line ${index + 1}`);
    }

    if (typeof parsed.data !== "object") {
      logWarning(`No 'data' object found at line ${index + 1}`);
    }

  } catch {
    logError(`Invalid JSON at line ${index + 1}`);
  }
}

function runValidation() {
  if (!existsSync(filePath)) {
    console.log("✅ No metrics file found. Skipping validation.");
    process.exit(0);
  }

  const raw = readFileSync(filePath, "utf-8").trim();
  if (!raw) {
    console.log("✅ Metrics file is empty. Nothing to validate.");
    process.exit(0);
  }

  const lines = raw.split("\n");
  lines.forEach((line, idx) => validateMetric(line, idx));

  if (invalidCount > 0) {
    console.error(`❌ Validation failed: ${invalidCount} invalid metric(s).`);
    process.exit(1);
  } else {
    console.log(`✅ All ${lines.length} metric(s) passed validation.`);
  }
}

runValidation();
