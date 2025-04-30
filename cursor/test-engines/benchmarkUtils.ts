/**
 * benchmarkUtils.ts
 *
 * Purpose:
 * Utility module for computing benchmark scores between AI output and human references,
 * using modular evaluation metrics including emotional tone via output-emotion-score.ts.
 *
 * Status: Codex-Hardened | AI-Compatible | Emotionally Aligned
 */

import { scoreEmotionalOutput } from '../vision-injection/output-emotion-score'

type BenchmarkMetric = 'clarity' | 'depth' | 'emotion' | 'facts' | 'codex'

type ScoreMap = Record<BenchmarkMetric, number>

interface BenchmarkResult {
  sessionId: string
  promptType: string
  metricsEvaluated: BenchmarkMetric[]
  scores: ScoreMap
  snapshot: boolean
  timestamp: string
}

// Core entry: score all selected metrics
export function computeDeltaScore(ai: string, human: string, metrics: BenchmarkMetric[]): ScoreMap {
  const results: Partial<ScoreMap> = {}

  for (const metric of metrics) {
    switch (metric) {
      case 'clarity':
        results.clarity = compareByLengthProximity(ai, human)
        break
      case 'depth':
        results.depth = compareByKeywordDensity(ai, human, ['strategy', 'insight', 'analysis'])
        break
      case 'emotion':
        results.emotion = compareByEmotionalAlignment(ai)
        break
      case 'facts':
        results.facts = compareByFactualOverlap(ai, human)
        break
      case 'codex':
        results.codex = compareByStructurePattern(ai, human)
        break
    }
  }

  return results as ScoreMap
}

// ---------------- Metric Implementations ---------------- //

function compareByLengthProximity(a: string, b: string): number {
  const diff = Math.abs(a.length - b.length)
  return Math.max(1, 10 - Math.floor(diff / 200))
}

function compareByKeywordDensity(text: string, reference: string, keywords: string[]): number {
  const count = (str: string) =>
    keywords.reduce((acc, kw) => acc + (str.match(new RegExp(kw, 'gi')) || []).length, 0)
  const aiScore = count(text)
  const refScore = count(reference)
  return Math.max(1, Math.min(10, Math.floor((aiScore / (refScore || 1)) * 10)))
}

// ✅ Replaces stub with real tone alignment from emotion scorer
function compareByEmotionalAlignment(text: string): number {
  const { alignment } = scoreEmotionalOutput(text)
  return alignment
}

function compareByFactualOverlap(ai: string, ref: string): number {
  const aiFacts = (ai.match(/\b(20\d{2}|\d+%|AI|data|user|growth)\b/g) || []).length
  const refFacts = (ref.match(/\b(20\d{2}|\d+%|AI|data|user|growth)\b/g) || []).length
  return Math.min(10, Math.floor((aiFacts / (refFacts || 1)) * 10))
}

function compareByStructurePattern(ai: string, ref: string): number {
  const aiBlocks = ai.split('\n\n').length
  const refBlocks = ref.split('\n\n').length
  const delta = Math.abs(aiBlocks - refBlocks)
  return Math.max(1, 10 - delta)
}

// ---------------- Benchmark Logging ---------------- //

export async function logBenchmarkResult(result: BenchmarkResult) {
  const path = `./evolution-triggers/benchmark-logs/${result.sessionId}.json`
  const fs = await import('fs/promises')
  await fs.writeFile(path, JSON.stringify(result, null, 2))
  console.log(`✅ Benchmark result saved: ${path}`)
}
