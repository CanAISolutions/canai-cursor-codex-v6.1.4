# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/copilot-injector/pattern-insights.ts`  
@purpose: Detects systemic misuse, over-injection, and drift patterns  
@drop-type: Cursor-ready, Codex-standard

// File: /cursor/accelerators/copilot-injector/pattern-insights.ts
// Detects abnormal injection patterns or underperformance indicators

import { getStateHistory } from '../../_shared/acceleratorState'

type InjectionRecord = {
  timestamp: string
  triggerId: string
  severity: 'info' | 'warn' | 'critical'
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeInjectionPatterns(): Promise<InsightReport> {
  const key = 'copilot-injector:lastTrigger'
  const history: InjectionRecord[] = await getStateHistory<InjectionRecord>(key, 10)

  const overuseTriggers = history.filter(t => t.triggerId === 'zombie-stallout')
  const criticalEvents = history.filter(t => t.severity === 'critical')

  if (overuseTriggers.length >= 4) {
    return {
      anomalyDetected: true,
      summary: 'Copilot injector is triggering "zombie-stallout" too frequently.',
      recommendations: [
        'Review Copilot tone/timing logic for stale session detection.',
        'Tune `revisionFatigueThreshold` in trigger rules config.',
        'Escalate to UX audit if user experience feels nagging.'
      ]
    }
  }

  if (criticalEvents.length >= 3) {
    return {
      anomalyDetected: true,
      summary: 'Multiple high-severity injections suggest prompt decay or misalignment.',
      recommendations: [
        'Inspect upstream prompt scoring engine.',
        'Cross-check with emotional tone analytics.',
        'Flag prompt type for potential override rule review.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Copilot injection activity is within expected behavioral norms.'
  }
}

