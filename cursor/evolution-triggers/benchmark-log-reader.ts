/**
 * benchmark-log-reader.ts
 *
 * Purpose:
 * Scans the /benchmark-logs/ directory, loads all session benchmark JSON files,
 * aggregates key metrics (average scores, drift detection), and flags evolution triggers.
 *
 * Status: Codex-Compliant | Cursor-Ready | Self-Healing
 */

import { readdir, readFile } from 'fs/promises'
import path from 'path'

interface BenchmarkResult {
  sessionId: string
  promptType: string
  metricsEvaluated: string[]
  scores: Record<string, number>
  snapshot: boolean
  timestamp: string
}

const BENCHMARK_DIR = path.resolve(__dirname, 'benchmark-logs')

/**
 * Loads and parses all benchmark session files.
 */
export async function loadBenchmarkLogs(): Promise<BenchmarkResult[]> {
  const files = await readdir(BENCHMARK_DIR)
  const benchmarks: BenchmarkResult[] = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = await readFile(path.join(BENCHMARK_DIR, file), 'utf-8')
      const parsed: BenchmarkResult = JSON.parse(data)
      benchmarks.push(parsed)
    }
  }

  return benchmarks
}

/**
 * Aggregates average scores across all benchmarks.
 */
export function computeBenchmarkSummary(benchmarks: BenchmarkResult[]) {
  const scoreSums: Record<string, number> = {}
  const scoreCounts: Record<string, number> = {}

  for (const entry of benchmarks) {
    for (const [metric, score] of Object.entries(entry.scores)) {
      scoreSums[metric] = (scoreSums[metric] || 0) + score
      scoreCounts[metric] = (scoreCounts[metric] || 0) + 1
    }
  }

  const averages: Record<string, number> = {}
  for (const metric of Object.keys(scoreSums)) {
    averages[metric] = parseFloat((scoreSums[metric] / scoreCounts[metric]).toFixed(2))
  }

  return averages
}

/**
 * Detects any evolution triggers based on current score thresholds.
 */
export function detectEvolutionTriggers(averages: Record<string, number>) {
  const triggerMetrics = Object.entries(averages)
    .filter(([_, score]) => score < 7)
    .map(([metric]) => metric)

  if (triggerMetrics.length > 0) {
    console.warn(`⚠️ Evolution trigger: Low benchmark averages detected in: ${triggerMetrics.join(', ')}`)
  } else {
    console.log('✅ All benchmark averages are healthy.')
  }
}

// Example usage pattern
async function main() {
  const logs = await loadBenchmarkLogs()
  const averages = computeBenchmarkSummary(logs)
  console.table(averages)
  detectEvolutionTriggers(averages)
}

// If running standalone
if (require.main === module) {
  main()
}
