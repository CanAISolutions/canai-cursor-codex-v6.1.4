// cursor/accelerators/swarm-agents/swarm-coordinator-engine.spec.ts
// ✅ Snapshot Unit Tests – Swarm Coordinator Engine
// Ensures safe agent execution, correct final output selection, and log trace integrity.

import { runSwarmAgents } from './swarm-coordinator-engine'

describe('runSwarmAgents', () => {
  const input = 'Write a business summary'

  it('runs agents in parallel-vote mode and returns last valid result', async () => {
    const { finalOutput, agentOutputs } = await runSwarmAgents(input, 'parallel-vote')

    expect(typeof finalOutput).toBe('string')
    expect(finalOutput).toMatch(/Mock result/)
    expect(agentOutputs.length).toBeGreaterThan(0)
    expect(agentOutputs.every(a => a.agentId && a.role)).toBe(true)
  })

  it('runs agents in sequential-refine mode and passes outputs as input', async () => {
    const { finalOutput, agentOutputs } = await runSwarmAgents(input, 'sequential-refine')

    expect(agentOutputs.length).toBeGreaterThan(1)
    expect(finalOutput).toMatch(/Mock result/)
    const chain = agentOutputs.map(a => a.result)
    expect(new Set(chain).size).toBe(chain.length) // each refinement is unique
  })

  it('uses first successful agent result in fallback-cascade mode', async () => {
    const { finalOutput, agentOutputs } = await runSwarmAgents(input, 'fallback-cascade')

    const firstValid = agentOutputs.find(a => !a.error)?.result
    expect(finalOutput).toBe(firstValid)
  })

  it('handles cases where no agents return valid output', async () => {
    const badRun = await runSwarmAgents('', 'fallback-cascade')
    expect(typeof badRun.finalOutput).toBe('string')
    expect(badRun.finalOutput).toMatch(/fallback|failed|incomplete/i)
  })

  it('includes error fields for failed agents', async () => {
    const { agentOutputs } = await runSwarmAgents('cause-error', 'parallel-vote')
    const hasErrorField = agentOutputs.some(a => a.error !== undefined)
    expect(hasErrorField).toBe(true)
  })
})
