# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/copilot-feedback-agent/pattern-insights.ts`  
@purpose: Detects session anomalies and overuse patterns in feedback triggers  
@drop-type: Cursor-safe, Codex-standard

// File: /cursor/accelerators/copilot-feedback-agent/pattern-insights.ts
// Analyzes session patterns for repeated drift or fatigue triggers

import { getStateHistory } from '../../_shared/acceleratorState'

type FeedbackTrigger = {
  timestamp: string
  reason: 'emotionalDrift' | 'fatigue' | 'copilotHint'
  severity: 'info' | 'warn' | 'critical'
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeFeedbackPatterns(): Promise<InsightReport> {
  const key = 'copilot-feedback-agent:lastTriggered'
  const history: FeedbackTrigger[] = await getStateHistory<FeedbackTrigger>(key, 10)

  const fatigueTriggers = history.filter(h => h.reason === 'fatigue')
  const driftTriggers = history.filter(h => h.reason === 'emotionalDrift')

  if (fatigueTriggers.length >= 5) {
    return {
      anomalyDetected: true,
      summary: 'High number of fatigue triggers in recent sessions.',
      recommendations: [
        'Consider revising prompt structure to reduce edit loops',
        'Enable Copilot fast-restart option after 3+ revisions',
        'Review tone hints in drift-triggering prompts'
      ]
    }
  }

  if (driftTriggers.length >= 4) {
    return {
      anomalyDetected: true,
      summary: 'Repeated emotional drift detected across sessions.',
      recommendations: [
        'Adjust tone presets or prompt templates',
        'Review feedback rules config thresholds',
        'Enable Copilot tone alignment guidance'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Feedback triggers are within normal engagement parameters.'
  }
}
