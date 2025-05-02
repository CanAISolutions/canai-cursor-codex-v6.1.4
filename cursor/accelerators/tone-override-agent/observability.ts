# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/tone-override-agent/observability.ts`  
@purpose: Logs override activity, suppression signals, profile matches, and emotional drift triggers  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/tone-override-agent/observability.ts
// Logs all override events and emotional recovery signals to analytics layer

import { logger } from '../../_shared/logger'

const CONTEXT = 'tone-override-agent'

export const toneOverrideObservability = {
  onOverrideSuggested: (
    matchedProfile: string,
    reason: string,
    trace: {
      emotionScore: number
      outputDrift: number
      revisionCount: number
    }
  ) => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.metric(CONTEXT, 'override.suggested', 1)
    logger.metric(CONTEXT, `profile.match.${matchedProfile}`, 1)
    logger.gauge(CONTEXT, 'emotion.score', trace.emotionScore)
    logger.gauge(CONTEXT, 'output.drift', trace.outputDrift)
    logger.gauge(CONTEXT, 'revision.count', trace.revisionCount)

    logger.info(CONTEXT, '[override] Tone override suggested', {
      matchedProfile,
      reason,
      ...trace
    })
  },

  onOverrideSuppressed: (reason: string) => {
    logger.metric(CONTEXT, 'override.suppressed', 1)
    logger.warn(CONTEXT, '[override] Suggestion skipped due to suppression logic', {
      reason
    })
  },

  onOverrideRejected: () => {
    logger.metric(CONTEXT, 'override.rejected', 1)
    logger.info(CONTEXT, '[override] User rejected tone scaffold')
  },

  onOverrideAccepted: () => {
    logger.metric(CONTEXT, 'override.accepted', 1)
    logger.info(CONTEXT, '[override] User accepted tone scaffold')
  }
}
