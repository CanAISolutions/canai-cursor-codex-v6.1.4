# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/federated-memory-lite/pattern-insights.ts`  
@purpose: Detects overuse of fallback logic, frequent rejections, or routing decay  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/federated-memory-lite/pattern-insights.ts
// Detects long-term misuse patterns in memory resolution logic

import { getStateHistory } from '../../_shared/acceleratorState'

type MemoryTrace = {
  timestamp: string
  intent: string
  sourceUsed: string
  fallbackTriggered: boolean
  rejectedSources?: string[]
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeMemoryResolutionPatterns(): Promise<InsightReport> {
  const key = 'federated-memory-lite:lastResolution'
  const history: MemoryTrace[] = await getStateHistory<MemoryTrace>(key, 10)

  const fallbackRate = history.filter(h => h.fallbackTriggered).length / history.length
  const repeatedRejects = history.flatMap(h => h.rejectedSources || [])
  const rejectedBySource = repeatedRejects.reduce((acc, source) => {
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (fallbackRate > 0.5) {
    return {
      anomalyDetected: true,
      summary: 'High fallback usage detected in memory federation.',
      recommendations: [
        'Recalibrate routing priorities in `memory-routing-spec.jsonc`.',
        'Lower `minimumConfidence` or refine conflict policy.',
        'Flag Copilot memory sync reliability for review.'
      ]
    }
  }

  const highRejectSource = Object.entries(rejectedBySource).find(([_, count]) => count >= 4)
  if (highRejectSource) {
    return {
      anomalyDetected: true,
      summary: `Memory source "${highRejectSource[0]}" frequently rejected.`,
      recommendations: [
        'Review source confidence scoring.',
        'Run memory drift validation or source audit.',
        'Consider manual override exception rule if safe.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Memory resolution pattern is healthy and stable.'
  }
}

