// Purpose: Detects inference instability, frequent fallback usage, and drift decay over time
// Codex: Copy/paste-safe, Cursor-auditable
// Analyzes recent traces for pattern instability or systemic inference failure

// Codex Stub: getStateHistory should be implemented in a shared utility. This stub returns an empty array for compilation/testing.
async function getStateHistory<T>(key: string, count: number): Promise<T[]> {
  // TODO: Replace with real state/history retrieval logic
  return [];
}

type SynthesisTrace = {
  timestamp: string
  matchedPatterns: string[]
  confidenceScore: number
  fallbackTriggered: boolean
  driftScore: number
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeReverseSynthesisTrends(): Promise<InsightReport> {
  const key = 'reverse-synthesis-core:lastTrace'
  const history: SynthesisTrace[] = await getStateHistory<SynthesisTrace>(key, 10)

  const fallbackRate = history.filter(h => h.fallbackTriggered).length / history.length
  const avgDrift = history.reduce((acc, h) => acc + h.driftScore, 0) / history.length
  const lowConfidenceHits = history.filter(h => h.confidenceScore < 0.4)

  if (fallbackRate > 0.4) {
    return {
      anomalyDetected: true,
      summary: 'High fallback usage in reverse synthesis inference.',
      recommendations: [
        'Expand `synthesis-patterns.jsonc` with more resilient patterns.',
        'Review pattern regex overlap or over-narrow scopes.',
        'Enable LLM fallback scoring to reduce hard misses.'
      ]
    }
  }

  if (avgDrift > 0.6) {
    return {
      anomalyDetected: true,
      summary: 'Average drift score indicates major output divergence.',
      recommendations: [
        'Audit output tone vs intended tone logs.',
        'Inject emotional recovery using `tone-override-agent` or Copilot fallback.',
        'Enable scoring loop with `smart-prompt-score` to enforce alignment.'
      ]
    }
  }

  if (lowConfidenceHits.length >= 4) {
    return {
      anomalyDetected: true,
      summary: 'Multiple low-confidence inferences suggest unstable pattern matching.',
      recommendations: [
        'Add pattern hints to outputs (optional hidden tags).',
        'Co-train Copilot regeneration on weak outputs for resilience.',
        'Enable manual flagging of outputs with unclear lineage.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Reverse synthesis engine trends are stable and healthy.'
  }
}
