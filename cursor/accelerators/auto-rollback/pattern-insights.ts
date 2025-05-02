# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/auto-rollback/pattern-insights.ts`  
@purpose: Detects behavioral anomalies across rollback sessions  
@drop-type: Copy/paste-safe (Cursor compliant)


// File: /cursor/accelerators/auto-rollback/pattern-insights.ts
// Detects signal clusters and abnormal rollback behavior across sessions

import { getStateHistory } from '../../_shared/acceleratorState'

type RollbackSession = {
  timestamp: string
  triggered: boolean
  reason?: string
}

type InsightResult = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeRollbackPatterns(): Promise<InsightResult> {
  const keyPrefix = 'auto-rollback:lastRun'
  const history: RollbackSession[] = await getStateHistory<RollbackSession>(keyPrefix, 5)

  const triggeredCount = history.filter(s => s.triggered).length
  const lastRun = history.at(-1)

  if (!lastRun) {
    return {
      anomalyDetected: false,
      summary: 'No rollback history found.'
    }
  }

  if (triggeredCount >= 3) {
    return {
      anomalyDetected: true,
      summary: `Rollback was triggered ${triggeredCount} times in recent runs.`,
      recommendations: [
        'Investigate upstream failures (promptFixSuggestor, emotionalDrift)',
        'Escalate to hybrid rollback or manual QA',
        'Log deltaLog replay status for recent failures'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Rollback activity is within normal limits.'
  }
}