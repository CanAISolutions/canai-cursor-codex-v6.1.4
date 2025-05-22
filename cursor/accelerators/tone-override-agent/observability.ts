// Purpose: Logs override activity, suppression signals, profile matches, and emotional drift triggers
// Codex: Codex copy/paste-safe, Cursor-auditable
// Logs all override events and emotional recovery signals to analytics layer

import { Logger } from '../../../utils/logger'

const CONTEXT = 'tone-override-agent'
const logger = new Logger(CONTEXT)

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
    logger.info('[override] Tone override suggested', {
      matchedProfile,
      reason,
      ...trace
    })
  },

  onOverrideSuppressed: (reason: string) => {
    logger.warn('[override] Suggestion skipped due to suppression logic', {
      reason
    })
  },

  onOverrideRejected: () => {
    logger.info('[override] User rejected tone scaffold')
  },

  onOverrideAccepted: () => {
    logger.info('[override] User accepted tone scaffold')
  }
}
