// Purpose: Detects tone override overuse, fatigue patterns, emotional failure loops, and profile instability
// Codex: Codex copy/paste-safe, Cursor-auditable
// Evaluates recent override history to detect fatigue or profile mismatch trends

// Codex Stub: getStateHistory should be implemented in a shared utility. This stub returns an empty array for compilation/testing.
async function getStateHistory<T>(key: string, count: number): Promise<T[]> {
  // TODO: Replace with real state/history retrieval logic
  return [];
}

type OverrideLog = {
  timestamp: string
  profile: string
  accepted: boolean
  emotionScore: number
  outputDrift: number
}

type InsightReport = {
  status: 'stable' | 'fatigue-risk' | 'misalignment'
  notes: string[]
  recommendations: string[]
}

export async function analyzeToneOverridePatterns(): Promise<InsightReport> {
  const history: OverrideLog[] = await getStateHistory<OverrideLog>(
    'tone-override:lastOverrideTrace',
    10
  )

  const notes: string[] = []
  const recommendations: string[] = []

  if (history.length < 5) {
    return {
      status: 'stable',
      notes: ['Insufficient override events for trend analysis.'],
      recommendations: []
    }
  }

  const rejectionRate = history.filter(h => !h.accepted).length / history.length
  const highDriftEvents = history.filter(h => h.outputDrift > 0.85).length
  const recurringProfile = mostFrequent(history.map(h => h.profile))

  if (rejectionRate > 0.5) {
    notes.push('Tone overrides frequently rejected by users.')
    recommendations.push('Apply override suppression for 2 sessions.')
    recommendations.push('Evaluate if profile `' + recurringProfile + '` is misaligned.')
  }

  if (highDriftEvents > 4) {
    notes.push('High emotional drift occurred repeatedly.')
    recommendations.push('Trigger Copilot tone review or genetic trait mutation.')
  }

  const status: InsightReport['status'] =
    rejectionRate > 0.5 ? 'fatigue-risk' :
    highDriftEvents > 3 ? 'misalignment' :
    'stable'

  return { status, notes, recommendations }
}

function mostFrequent(arr: string[]): string {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}
