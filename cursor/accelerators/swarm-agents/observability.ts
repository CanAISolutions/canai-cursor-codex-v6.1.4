# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/swarm-agents/observability.ts`  
@purpose: Emits execution telemetry, agent confidence logs, fallback flags, and quorum status  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/swarm-agents/observability.ts
// Logs quorum outcomes, fallback use, decision spread, and error handling

import { logger } from '../../_shared/logger'

const CONTEXT = 'swarm-agents'

export const emitSwarmObservability = {
  onQuorumComplete: (
    mode: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade',
    consensusScore: number,
    selectedAgent: string,
    quorumPassed: boolean,
    fallbackUsed: boolean
  ) => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.metric(CONTEXT, `mode.${mode}`, 1)
    logger.metric(CONTEXT, 'consensus.score', consensusScore)
    logger.metric(CONTEXT, 'quorum.passed', quorumPassed ? 1 : 0)
    logger.metric(CONTEXT, 'fallback.used', fallbackUsed ? 1 : 0)
    logger.info(CONTEXT, '[observability] Swarm completed', {
      selectedAgent,
      mode,
      consensusScore,
      quorumPassed,
      fallbackUsed
    })
  },

  onAgentFailure: (agentId: string, reason: string) => {
    logger.metric(CONTEXT, 'agent.error.count', 1)
    logger.warn(CONTEXT, '[observability] Agent failed in swarm run', {
      agentId,
      reason
    })
  },

  onAnomaly: (note: string, trace?: Record<string, any>) => {
    logger.metric(CONTEXT, 'anomaly.count', 1)
    logger.warn(CONTEXT, '[observability] Swarm anomaly detected', {
      note,
      ...trace
    })
  }
}
