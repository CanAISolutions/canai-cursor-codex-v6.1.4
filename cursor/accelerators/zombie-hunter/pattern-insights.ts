# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/zombie-hunter/pattern-insights.ts`  
@purpose: Detects repeated zombie triggers, recovery failures, or session stagnation trends  
@drop-type: Codex copy/paste-safe, audit-safe

// File: /cursor/accelerators/zombie-hunter/pattern-insights.ts
// Evaluates recent zombie traces to detect fatigue loops, escalation needs, or QA drift

import { getStateHistory } from '../../_shared/acceleratorState'

type ZombieEvent = {
  sessionId: string
  matchedPattern: string
  emotionScore: number
  outputDelta: number
  revisionCount: number
  timestamp: string
}

type PatternInsight = {
  status: 'stable' | 'repeat-trigger' | 'recovery-failure'
  notes: string[]
  recommendations: string[]
}

export async function analyzeZombiePatterns(): Promise<PatternInsight> {
  const history: ZombieEvent[] = await getStateHistory<ZombieEvent>(
    'zombie-hunter:lastTrace',
    10
  )

  const notes: string[] = []
  const recommendations: string[] = []

  if (history.length < 4) {
    return {
      status: 'stable',
      notes: ['Insufficient zombie history for pattern detection.'],
      recommendations: []
    }
  }

  const repeatSessions = countRepeats(history.map(h => h.sessionId))
  const flatEmotionEvents = history.filter(e => e.emotionScore < 0.2).length
  const lowDeltaEvents = history.filter(e => e.outputDelta < 0.05).length

  if (repeatSessions > 2) {
    notes.push('Zombie recovery has been triggered in the same session multiple times.')
    recommendations.push('Trigger Copilot escalation or enforce session reset.')
  }

  if (flatEmotionEvents > 4) {
    notes.push('Frequent emotional flatlines detected in zombie traces.')
    recommendations.push('Triage tone-override-agent thresholds.')
  }

  if (lowDeltaEvents > 4) {
    notes.push('Prompt outputs repeatedly show no evolution (drift deadzone).')
    recommendations.push('Suggest prompt-genetics mutation or Copilot reroute.')
  }

  const status: PatternInsight['status'] =
    repeatSessions > 2 ? 'recovery-failure' :
    flatEmotionEvents > 4 || lowDeltaEvents > 4 ? 'repeat-trigger' :
    'stable'

  return { status, notes, recommendations }
}

function countRepeats(arr: string[]): number {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.values(counts).filter(count => count > 1).length
}

