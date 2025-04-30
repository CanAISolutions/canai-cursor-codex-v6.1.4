// cursor/accelerators/swarm-agents/swarm-coordinator-engine.ts
// ✅ Codex Locked – Swarm Coordination Engine
// Executes multiple AI agents in parallel or sequence and returns final result based on configured policy.

import config from './swarm-agent-config.jsonc'
import { emitDeltaLog } from '@/cursor/core/logging/emitters' // Swap for your actual logging utility

type SwarmMode = 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'

interface AgentOutput {
  agentId: string
  role: string
  result: string
  error?: string
}

export async function runSwarmAgents(input: string, mode: SwarmMode = config.defaultMode): Promise<{
  finalOutput: string
  agentOutputs: AgentOutput[]
}> {
  const agentOutputs: AgentOutput[] = []
  let currentInput = input

  for (const agent of config.agents) {
    let result: string = ''
    let error: string | undefined = undefined

    try {
      // 🧪 TODO: Replace with real agent function call
      result = `// Mock result from ${agent.role} agent for "${currentInput}"`
    } catch (err) {
      error = `Agent ${agent.id} failed: ${(err as Error).message}`
    }

    agentOutputs.push({
      agentId: agent.id,
      role: agent.role,
      result,
      error
    })

    if (mode === 'sequential-refine' && !error) {
      currentInput = result
    }

    // Optional early exit for fallback cascade
    if (mode === 'fallback-cascade' && result && !error) break
  }

  const finalOutput = selectSwarmResult(agentOutputs, mode)

  emitDeltaLog('swarm-coordinator', {
    mode,
    input,
    agentCount: config.agents.length,
    outputs: agentOutputs,
    finalOutput
  })

  return { finalOutput, agentOutputs }
}

function selectSwarmResult(outputs: AgentOutput[], mode: SwarmMode): string {
  if (mode === 'parallel-vote') {
    const nonErrorOutputs = outputs.filter(o => !o.error)
    return nonErrorOutputs.at(-1)?.result || '// No valid outputs from agents.'
  }

  if (mode === 'fallback-cascade') {
    return outputs.find(o => o.result && !o.error)?.result || '// All fallbacks failed.'
  }

  if (mode === 'sequential-refine') {
    return outputs.at(-1)?.result || '// Refinement incomplete.'
  }

  return '// No swarm mode matched.'
}
