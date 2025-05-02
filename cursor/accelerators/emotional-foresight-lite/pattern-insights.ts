# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/emotional-foresight-lite/pattern-insights.ts`  
@purpose: Detects long-term foresight signal drift, over-prediction, and fallback abuse  
@drop-type: Codex-compliant, Cursor-safe

// File: /cursor/accelerators/emotional-foresight-lite/pattern-insights.ts
// Analyzes foresight prediction history to detect misfires or trigger overuse

import { getStateHistory } from '../../_shared/acceleratorState'

type ForesightLog = {
  timestamp: string
  foresightLabel: 'low-risk' | 'at-risk' | 'degrading'
  fallbackType?: 'soft' | 'hard' | 'warn'
  triggeredBy?: string[]
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeForesightPatterns(): Promise<InsightReport> {
  const key = 'emotional-foresight-lite:lastPrediction'
  const history: ForesightLog[] = await getStateHistory<ForesightLog>(key, 10)

  const degradations = history.filter(h => h.foresightLabel === 'degrading')
  const falsePositives = history.filter(
    h => h.foresightLabel === 'degrading' && !h.fallbackType
  )

  if (degradations.length >= 4) {
    return {
      anomalyDetected: true,
      summary: 'Multiple consecutive degrading predictions detected.',
      recommendations: [
        'Review clarity and emotion thresholds in config.',
        'Add Copilot pre-response soft nudge before fallback.',
        'Enable revalidation with SmartPromptScore before intervention.'
      ]
    }
  }

  if (falsePositives.length >= 3) {
    return {
      anomalyDetected: true,
      summary:
        'Degrading predictions triggered without fallback — possible false positives.',
      recommendations: [
        'Tighten signal thresholds in `emotion-signal-spec.jsonc`.',
        'Log fallback suppression reason in foresight state trace.',
        'Review impact of “manualBypass” toggle if used.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Foresight prediction pattern is stable and within acceptable variance.'
  }
}
