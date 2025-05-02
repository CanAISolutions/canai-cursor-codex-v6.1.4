# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/conversion-predictor-lite/pattern-insights.ts`  
@purpose: Detects anomalies and patterns in score distributions and verdict drift  
@drop-type: Codex copy/paste-safe, AI-ready

// File: /cursor/accelerators/conversion-predictor-lite/pattern-insights.ts
// Detects drift in verdict patterns and confidence score distribution over time

import { getStateHistory } from '../../_shared/acceleratorState'

type ScoreEntry = {
  confidence: number
  verdict: 'strong' | 'neutral' | 'weak'
  timestamp: string
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeConversionPatterns(): Promise<InsightReport> {
  const keyPrefix = 'conversion-predictor-lite:score'
  const history: ScoreEntry[] = await getStateHistory<ScoreEntry>(keyPrefix, 10)

  const verdicts = history.map(h => h.verdict)
  const avgScore = history.reduce((sum, h) => sum + h.confidence, 0) / (history.length || 1)

  const weakCount = verdicts.filter(v => v === 'weak').length
  const strongCount = verdicts.filter(v => v === 'strong').length

  if (weakCount >= 6 && avgScore < 0.45) {
    return {
      anomalyDetected: true,
      summary: 'Weak conversion signals are dominating recent scores.',
      recommendations: [
        'Review recent prompt tone or CTA phrasing',
        'Tune signal weights in conversion-signals.jsonc',
        'Escalate to prompt tuning Copilot if persistent'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Conversion score trends are within normal ranges.'
  }
}
