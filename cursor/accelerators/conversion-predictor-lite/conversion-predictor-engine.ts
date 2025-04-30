// cursor/accelerators/conversion-predictor-lite/conversion-predictor-engine.ts
// ✅ Codex Final – Conversion Scoring Engine
// Evaluates output quality by scoring conversion likelihood from tone, CTA, and signal patterns.

import signalMap from './conversion-signals.jsonc'

export interface ConversionScoreResult {
  score: number                  // normalized [0.0–1.0]
  verdict: 'strong' | 'weak' | 'neutral'
  matchedSignals: string[]      // names of triggered signals
  riskFactors: string[]         // names of negative signals hit
  trace: {
    snippet: string
    reasoning: string
  }
}

/**
 * Scores a generated string for conversion potential.
 * Uses pattern matching against signal weights to determine confidence.
 */
export function scoreConversionLikelihood(output: string): ConversionScoreResult {
  const lower = output.toLowerCase()
  const matchedSignals: string[] = []
  const riskFactors: string[] = []
  let rawScore = 0

  for (const signal of signalMap.positiveSignals) {
    const regex = new RegExp(signal.match, 'i')
    if (regex.test(lower)) {
      rawScore += signal.weight
      matchedSignals.push(signal.name)
    }
  }

  for (const signal of signalMap.negativeSignals) {
    const regex = new RegExp(signal.match, 'i')
    if (regex.test(lower)) {
      rawScore += signal.weight // subtractive
      riskFactors.push(signal.name)
    }
  }

  const normalized = Math.max(0, Math.min(1, parseFloat(rawScore.toFixed(3))))

  let verdict: 'strong' | 'weak' | 'neutral' = 'neutral'
  if (normalized >= 0.7) verdict = 'strong'
  else if (normalized <= 0.4) verdict = 'weak'

  return {
    score: normalized,
    verdict,
    matchedSignals,
    riskFactors,
    trace: {
      snippet: output.slice(0, 120) + (output.length > 120 ? '...' : ''),
      reasoning:
        matchedSignals.length > 0
          ? `Matched ${matchedSignals.length} positive signal(s)`
          : riskFactors.length > 0
          ? `Negative signal(s) suggest low actionability`
          : 'No actionable signal detected'
    }
  }
}
