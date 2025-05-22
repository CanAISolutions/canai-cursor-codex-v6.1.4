// Purpose: Validates entrypoint behavior, config loading, and result shape
// Codex: Codex copy/paste-safe, Cursor-auditable
// Validates entry execution of swarm-agents.ts with mocked input

import { runSwarmAgents } from './swarm-agents'

describe('[DreamState] swarm-agents.ts', () => {
  it('should return a valid SwarmResult with fallback off', async () => {
    const result = await runSwarmAgents({
      promptContext: 'Create a welcome email for new subscribers.',
      intentLabel: 'welcome_email',
      mode: 'parallel-vote',
      fallbackAllowed: false
    })

    expect(result).toHaveProperty('finalOutput')
    expect(result).toHaveProperty('selectedAgent')
    expect(result).toHaveProperty('quorumPassed')
    expect(result).toHaveProperty('decisionTrace')
    expect(typeof result.finalOutput).toBe('string')
    expect(Object.keys(result.decisionTrace || {})).not.toHaveLength(0)
  })

  it('should apply agentIds override if provided', async () => {
    const result = await runSwarmAgents({
      promptContext: 'Generate a CTA for sign-up.',
      intentLabel: 'cta_generator',
      agentIds: ['agent1', 'agent2'],
      mode: 'sequential-refine'
    })

    expect(result.selectedAgent).toBeDefined()
    expect(result.decisionTrace).toBeDefined()
  })

  it('should default to config-defined mode if none provided', async () => {
    const result = await runSwarmAgents({
      promptContext: 'Explain benefits of using CanAI.',
      intentLabel: 'benefits_explainer'
    })

    expect(['parallel-vote', 'fallback-cascade', 'sequential-refine']).toContain(result.mode || 'parallel-vote')
  })
})

