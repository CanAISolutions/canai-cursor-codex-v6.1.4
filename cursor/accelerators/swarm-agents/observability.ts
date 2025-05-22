// Purpose: Emits execution telemetry, agent confidence logs, fallback flags, and quorum status
// Codex: Codex copy/paste-safe, Cursor-auditable
// Logs quorum outcomes, fallback use, decision spread, and error handling

import { Logger } from '../../../utils/logger'

const CONTEXT = 'swarm-agents'
const logger = new Logger(CONTEXT)

export const emitSwarmObservability = {
  onQuorumComplete: (
    mode: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade',
    consensusScore: number,
    selectedAgent: string,
    quorumPassed: boolean,
    fallbackUsed: boolean
  ) => {
    logger.info('[observability] Swarm completed', {
      selectedAgent,
      mode,
      consensusScore,
      quorumPassed,
      fallbackUsed
    })
  },

  onAgentFailure: (agentId: string, reason: string) => {
    logger.warn('[observability] Agent failed in swarm run', {
      agentId,
      reason
    })
  },

  onAnomaly: (note: string, trace?: Record<string, any>) => {
    logger.warn('[observability] Swarm anomaly detected', {
      note,
      ...trace
    })
  }
}
