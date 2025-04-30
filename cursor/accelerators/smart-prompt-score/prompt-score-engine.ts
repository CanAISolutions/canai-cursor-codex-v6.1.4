// cursor/accelerators/smart-prompt-score/prompt-score-engine.ts

import config from './scoring-signals.jsonc'

type SignalInput = Record<string, number>

interface ScoringResult {
  totalScore: number
  normalizedSignals: Record<string, number>
  reasoning: string[]
  grade: 'fallback' | 'pass' | 'gold'
}

export function scorePrompt(signals: SignalInput): ScoringResult {
  let total = 0
  const norm: Record<string, number> = {}
  const reasoning: string[] = []

  for (const trait of config.signals) {
    const value = signals[trait.name]
    if (value === undefined || value === null) continue

    let normalized = 0

    if (trait.type === 'numerical' || trait.type === 'percentage') {
      const [min, max] = trait.range
      normalized = Math.min(1, Math.max(0, (value - min) / (max - min)))
    } else if (trait.type === 'integer') {
      const [min, max] = trait.range
      normalized = Math.min(1, Math.max(0, 1 - (value - min) / (max - min)))
    }

    norm[trait.name] = parseFloat(normalized.toFixed(3))

    const weighted = normalized * trait.weight
    total += weighted

    reasoning.push(
      `${trait.name}: ${value} → normalized=${normalized.toFixed(2)} × weight=${trait.weight} → +${(weighted * 100).toFixed(1)}`
    )
  }

  const finalScore = parseFloat((total * config.scoring.maxScore).toFixed(1))

  let grade: ScoringResult['grade'] = 'pass'
  if (finalScore >= config.scoring.goldThreshold) grade = 'gold'
  else if (finalScore < config.scoring.fallbackThreshold) grade = 'fallback'

  return {
    totalScore: finalScore,
    normalizedSignals: norm,
    reasoning,
    grade
  }
}
