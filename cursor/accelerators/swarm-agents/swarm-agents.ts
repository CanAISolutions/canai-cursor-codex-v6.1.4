// Purpose: Canonical entry file used by Codex agents, Copilots, and test runners
// Codex: Codex copy/paste-safe, Cursor-auditable
// Entry point to invoke swarm execution based on declared config

import { runSwarmAgents as runSwarmCoordinator } from './swarm-coordinator-engine'
// TODO: Ensure config import and types are aligned with coordinator engine
// import config from './swarm-agent-config.jsonc'

type SwarmInput = {
  promptContext: string
  intentLabel: string
  mode?: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
  agentIds?: string[]
  fallbackAllowed?: boolean
}

type SwarmResult = {
  finalOutput: string
  agentOutputs: Array<{
    agentId: string
    role: string
    result: string
    error?: string
  }>
}

export async function runSwarmAgents(input: SwarmInput): Promise<SwarmResult> {
  // TODO: Pass correct config and input shape to coordinator
  const selectedMode = input.mode || 'parallel-vote'

  return await runSwarmCoordinator(input.promptContext, selectedMode)
}
