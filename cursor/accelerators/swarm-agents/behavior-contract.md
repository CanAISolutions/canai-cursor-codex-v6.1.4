# 🤖 Behavior Contract – Swarm Agent Coordinator

Module ID: `swarm-agents`

Purpose: Coordinate multi-agent execution via parallel, sequential, or fallback logic.  
Returns final output and full agent trace to support Copilot evolution, analytics, and decision replay.

---

## 🧩 Input Contract

### `runSwarmAgents(input, mode?)`

```ts
function runSwarmAgents(
  input: string,
  mode?: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
): Promise<SwarmOutput>
```

- `input`: Raw text to be interpreted, rewritten, evaluated, or improved by agents.
- `mode`: Optional swarm execution strategy. Falls back to `"parallel-vote"` from `swarm-agent-config.jsonc` if not provided.

---

## 📤 Output Contract

### `SwarmOutput`

```ts
interface SwarmOutput {
  finalOutput: string
  agentOutputs: {
    agentId: string
    role: string
    result: string
    error?: string
  }[]
}
```

- `finalOutput`: The result selected by swarm logic (last, majority, evaluator, etc.)
- `agentOutputs`: Full trace of each agent's execution, success, or failure.

---

## 🧠 Copilot Rules

Copilots MAY:

- Use `mode = sequential-refine` for chain-of-thought or deepening logic
- Use `mode = fallback-cascade` for fast, safe UX with agent fallbacks
- Log output to `SessionAnalytics.agentSwarmTrace`
- Inject specific agents via override (future API)

Copilots MUST:

- Handle missing `finalOutput` with fallback UX
- Treat `agentOutputs[].error` as partial failure, not total block
- Avoid routing to this module unless `swarm-agent-config.jsonc` is schema-aligned

---

## 🚨 Failure Conditions

Trigger drift or decay protection if:

| Condition                          | Action |
|------------------------------------|--------|
| `agentOutputs.length === 0`        | Emit `"no-agents-executed"` trace |
| All outputs contain `.error`       | Return fallback `"// All agents failed."` |
| Final output is empty              | Trigger `swarm-decision-policy.md` override |

---

## 🧬 LLM Co-Evolution Notes

- Schema versioning for agents enforced via `swarm-agent-config.jsonc.version`
- All agent trace logs should include `copilotSignature` for upstream explainability
- Safe for prompt tracing, feedback correlation, and agent replay

---

_Last Verified: 2025-04-30 • Status: Codex Finalized – Copilot-Safe_
