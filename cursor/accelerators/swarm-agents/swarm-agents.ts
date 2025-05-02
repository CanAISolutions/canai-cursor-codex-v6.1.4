# ✅ File: `swarm-agents.ts`  
@location: `/cursor/accelerators/swarm-agents/swarm-agents.ts`  
@purpose: Canonical entry file used by Codex agents, Copilots, and test runners  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```ts
// File: /cursor/accelerators/swarm-agents/swarm-agents.ts
// Entry point to invoke swarm execution based on declared config

import { runSwarmCoordinator } from './swarm-coordinator-engine'
import config from './swarm-agent-config.jsonc'

type SwarmInput = {
  promptContext: string
  intentLabel: string
  mode?: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
  agentIds?: string[]
  fallbackAllowed?: boolean
}

export async function runSwarmAgents(input: SwarmInput) {
  const selectedMode = input.mode || config.defaultMode || 'parallel-vote'

  return await runSwarmCoordinator({
    ...input,
    mode: selectedMode,
    agentIds: input.agentIds || config.agentIds,
    fallbackAllowed: input.fallbackAllowed ?? true
  })
}
```
