# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/swarm-agents/pattern-insights.ts`  
@purpose: Analyzes swarm health, agent reliability, and fallback overuse patterns  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/swarm-agents/pattern-insights.ts
// Detects quorum instability, fallback overuse, agent volatility, and mode imbalance

import { getStateHistory } from '../../_shared/acceleratorState'

type SwarmLogEntry = {
  timestamp: string
  selectedAgent: string
  consensusScore: number
  fallbackUsed: boolean
  mode: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
  quorumPassed: boolean
}

type SwarmInsightReport = {
  status: 'stable' | 'degrading' | 'high-risk'
  notes: string[]
  recommendations: string[]
}

export async function analyzeSwarmPatterns(): Promise<SwarmInsightReport> {
  const history: SwarmLogEntry[] = await getStateHistory<SwarmLogEntry>(
    'swarm-agents:quorumLog',
    10
  )

  if (history.length < 5) {
    return {
      status: 'stable',
      notes: ['Not enough swarm history for long-term trend detection.'],
      recommendations: []
    }
  }

  const fallbackRate = history.filter(h => h.fallbackUsed).length / history.length
  const failedQuorum = history.filter(h => !h.quorumPassed).length
  const mostUsedMode = modeFrequency(history)

  const notes: string[] = []
  const recommendations: string[] = []

  if (fallbackRate > 0.4) {
    notes.push('Fallback used in over 40% of recent swarm runs.')
    recommendations.push('Audit agent config weights for gaps.')
    recommendations.push('Run prompt confidence booster when fallback > 40%.')
  }

  if (failedQuorum >= 3) {
    notes.push('Quorum failed 3 or more times in recent history.')
    recommendations.push('Inject Copilot explanation layer post-swarm.')
    recommendations.push('Escalate to solo-agent deterministic retry if needed.')
  }

  if (mostUsedMode === 'fallback-cascade') {
    notes.push('Swarm defaulting to fallback mode frequently.')
    recommendations.push('Try parallel-vote for broader variation coverage.')
  }

  const status: SwarmInsightReport['status'] =
    fallbackRate > 0.5 || failedQuorum >= 4 ? 'high-risk'
    : fallbackRate > 0.3 || failedQuorum >= 2 ? 'degrading'
    : 'stable'

  return { status, notes, recommendations }
}

function modeFrequency(history: SwarmLogEntry[]): string {
  const counts = history.reduce(
    (acc, h) => ({ ...acc, [h.mode]: (acc[h.mode] || 0) + 1 }),
    {} as Record<string, number>
  )
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}
