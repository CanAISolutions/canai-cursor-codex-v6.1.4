/**
 * @file convert-metrics.ts
 * @description Converts metrics.jsonl (line-by-line JSON) into metrics.json (full JSON array).
 * Used for dashboards, audit snapshots, or import workflows.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CONTEXT_DIR = ".canai-context";
const INPUT_FILE = "metrics.jsonl";
const OUTPUT_FILE = "metrics.json";

const inputPath = join(CONTEXT_DIR, INPUT_FILE);
const outputPath = join(CONTEXT_DIR, OUTPUT_FILE);

function convert() {
  if (!existsSync(inputPath)) {
    console.error(`❌ [convert-metrics] No metrics.jsonl file found at ${inputPath}`);
    process.exit(1);
  }

  const raw = readFileSync(inputPath, "utf-8").trim();
  if (!raw) {
    console.warn("⚠️  [convert-metrics] metrics.jsonl is empty. Writing empty array.");
    writeFileSync(outputPath, "[]", { encoding: "utf-8" });
    process.exit(0);
  }

  const lines = raw.split("\n");
  const result: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const parsed = JSON.parse(line);
      result.push(parsed);
    } catch (err) {
      console.warn(`⚠️  [convert-metrics] Skipping invalid JSON at line ${i + 1}`);
    }
  }

  try {
    writeFileSync(outputPath, JSON.stringify(result, null, 2), { encoding: "utf-8" });
    console.log(`✅ [convert-metrics] Exported ${result.length} metric(s) to ${OUTPUT_FILE}`);
  } catch (err: any) {
    console.error(`❌ Failed to write ${OUTPUT_FILE}: ${err.message}`);
    process.exit(1);
  }
}

convert();
