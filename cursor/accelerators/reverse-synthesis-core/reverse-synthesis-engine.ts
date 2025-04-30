// cursor/accelerators/reverse-synthesis-core/reverse-synthesis-engine.ts
// ✅ Codex Locked – Reverse Synthesis Core
// Reconstructs likely prompt traits, intent, and seed structure from a generated output.

import synthesisPatterns from './synthesis-patterns.jsonc'

export interface ReverseSynthesisResult {
  detectedIntent: string
  inferredTone: string
  promptTemplateId: string
  score: number
  confidenceTags: string[]
  trace: {
    outputSnippet: string
    matchedPatterns: string[]
    reason: string
  }
}

/**
 * Attempts to reconstruct original prompt traits from a given output string.
 * Applies pattern matching, tone heuristics, and structural inference.
 */
export function reverseSynthesize(output: string): ReverseSynthesisResult {
  const lower = output.toLowerCase()
  const matches: string[] = []

  let detectedIntent = 'unknown'
  let inferredTone = 'neutral'
  let promptTemplateId = 'generic-template'
  let confidenceTags: string[] = []

  for (const pattern of synthesisPatterns.patterns) {
    const regex = new RegExp(pattern.match, 'i')
    if (regex.test(output)) {
      matches.push(pattern.name)

      if (pattern.intent) detectedIntent = pattern.intent
      if (pattern.tone) inferredTone = pattern.tone
      if (pattern.template) promptTemplateId = pattern.template
      if (pattern.tags) confidenceTags.push(...pattern.tags)
    }
  }

  // Score increases based on depth of matches
  const score = parseFloat((matches.length / synthesisPatterns.patterns.length).toFixed(3))

  return {
    detectedIntent,
    inferredTone,
    promptTemplateId,
    score,
    confidenceTags: [...new Set(confidenceTags)],
    trace: {
      outputSnippet: output.slice(0, 120) + (output.length > 120 ? '...' : ''),
      matchedPatterns: matches,
      reason: matches.length
        ? `Matched ${matches.length} pattern(s)`
        : 'No structural patterns matched — fallback to neutral defaults'
    }
  }
}
