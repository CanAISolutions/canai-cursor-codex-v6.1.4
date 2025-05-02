# ✅ File: `pattern-insights.ts`  
@location: `/cursor/accelerators/prompt-genetics/pattern-insights.ts`  
@purpose: Detects repeated low-fitness variants, mutation fatigue, or stale trait reuse  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/prompt-genetics/pattern-insights.ts
// Detects output stagnation, ineffective trait mutation, or variant reuse decay

import { getStateHistory } from '../../_shared/acceleratorState'

type VariantTrace = {
  timestamp: string
  variantId: string
  fitnessScore: number
  mutationReason: string
  ignoredTraits?: string[]
}

type InsightReport = {
  anomalyDetected: boolean
  summary: string
  recommendations?: string[]
}

export async function analyzePromptVariantPatterns(): Promise<InsightReport> {
  const key = 'prompt-genetics:lastVariant'
  const history: VariantTrace[] = await getStateHistory<VariantTrace>(key, 10)

  const lowFitnessVariants = history.filter(v => v.fitnessScore < 0.5)
  const reuseCount = history.filter(v => v.mutationReason === 'reused_parent').length
  const ignoredTraitSpikes = history.filter(v => (v.ignoredTraits?.length || 0) > 2)

  if (lowFitnessVariants.length >= 5) {
    return {
      anomalyDetected: true,
      summary: 'Multiple consecutive low-fitness prompt variants detected.',
      recommendations: [
        'Tune mutation weights for high-impact traits in `prompt-trait-schema.jsonc`.',
        'Adjust fitness function scoring for better clarity/emotion detection.',
        'Introduce Copilot-assisted mutation preview to intervene manually.'
      ]
    }
  }

  if (reuseCount >= 4) {
    return {
      anomalyDetected: true,
      summary: 'Prompt variants are being reused too often — mutation cycle likely stalled.',
      recommendations: [
        'Review variant replay conditions and trace triggers.',
        'Force minimum mutation depth if no fitness gain occurs.',
        'Audit lineage log for replay pattern loops.'
      ]
    }
  }

  if (ignoredTraitSpikes.length >= 3) {
    return {
      anomalyDetected: true,
      summary: 'High trait ignore rate — mutation schema may be mismatched.',
      recommendations: [
        'Ensure `goals` fields are mapped correctly to traits in schema.',
        'Refactor traits that conflict or cancel each other.',
        'Snapshot schema drift with test replays.'
      ]
    }
  }

  return {
    anomalyDetected: false,
    summary: 'Prompt variant patterns are stable and effective.'
  }
}

