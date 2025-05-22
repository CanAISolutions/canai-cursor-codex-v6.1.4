// Purpose: Detects score drift patterns, signal imbalance, and Copilot coaching needs
// Codex: Codex copy/paste-safe, Cursor-auditable
// Analyzes score history for drift, emotional flattening, and prompt decay signals

// Codex Stub: getStateHistory should be implemented in a shared utility. This stub returns an empty array for compilation/testing.
async function getStateHistory<T>(key: string, count: number): Promise<T[]> {
  // TODO: Replace with real state/history retrieval logic
  return [];
}

type ScoreSnapshot = {
  timestamp: string
  compositeScore: number
  emotionScore: number
  clarityScore: number
  revisionCount: number
  grade: 'gold' | 'pass' | 'fallback'
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzeScoreTrends(): Promise<InsightReport> {
  const history: ScoreSnapshot[] = await getStateHistory<ScoreSnapshot>(
    'smart-prompt-score:gradeLog',
    10
  )

  if (history.length < 5) {
    return {
      anomalyDetected: false,
      summary: 'Not enough score data to assess trend stability.'
    }
  }

  const fallbackCount = history.filter(h => h.grade === 'fallback').length
  const avgEmotion = history.reduce((sum, h) => sum + h.emotionScore, 0) / history.length
  const avgRevisions = history.reduce((sum, h) => sum + h.revisionCount, 0) / history.length

  if (fallbackCount >= 4) {
    return {
      anomalyDetected: true,
      summary: 'High fallback grade frequency detected in recent outputs.',
      recommendations: [
        'Inject Copilot coaching when score < 72.',
        'Audit prompt tone presets for mismatches.',
        'Enable tone-first rewriter or emotional scaffolding.'
      ]
    }
  }

  if (avgEmotion < 0.3) {
    return {
      anomalyDetected: true,
      summary: 'Low emotional resonance across recent prompts.',
      recommendations: [
        'Tune tone enhancer signals in `scoring-signals.jsonc`.',
        'Favor outputs with emotive verbs and clarity.',
        'Run tone recovery agent if score < 72 and emotionScore < 0.3.'
      ]
    }
  }

  if (avgRevisions > 3.5) {
    return {
      anomalyDetected: true,
      summary: 'Prompt revision count is trending too high.',
      recommendations: [
        'Run prompt decay detection and re-evaluate reuse loop.',
        'Improve prompt defaults or Smart Defaults fallback tuning.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Score signals are within healthy ranges.'
  }
}
