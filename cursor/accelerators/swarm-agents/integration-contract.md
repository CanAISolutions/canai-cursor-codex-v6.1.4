# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/swarm-agents/integration-contract.md`  
@purpose: Declares I/O types, agent interface rules, quorum structure, and persistent state keys  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🤖 Integration Contract – Swarm Agents

@agent: swarm-agents  
@version: v1.0.0  
@schema: `swarm-agent-config.jsonc`  
@coordination-mode: parallel-vote | sequential-refine | fallback-cascade

---

## 📥 Input Shape

```ts
type SwarmInput = {
  promptContext: string
  intentLabel: string
  mode: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
  agentIds?: string[]         // Optional override list
  fallbackAllowed?: boolean   // Allow retry if no valid output
}
```

---

## 📤 Output Shape

```ts
type SwarmResult = {
  finalOutput: string
  selectedAgent: string
  consensusScore: number
  decisionTrace: {
    [agentId: string]: {
      output: string
      score: number
      reason: string
    }
  }
  quorumPassed: boolean
  fallbackUsed: boolean
}
```

- `decisionTrace` must be included for auditability  
- `consensusScore` used for confidence display in Copilot

---

## 🧾 State Keys

| Key                             | Purpose |
|----------------------------------|---------|
| `swarm-agents:lastResult`        | Stores most recent output trace |
| `swarm-agents:quorumLog[]`       | Stores decision deltas (last 10) |
| `swarm-agents:fallbackCount`     | Logs fallback events across sessions |
| `swarm-agents:modePreferenceMap` | Future personalization: maps user → preferred execution mode |

---

## 📦 System Consumers

| Module                    | Usage                                  |
|---------------------------|-----------------------------------------|
| `copilot-feedback-agent`  | Uses `decisionTrace` to teach user why output was selected |
| `prompt-fix-suggestor`    | Pulls fallback trace if output was voted down |
| `sessionDeltaLogEmitter`  | Logs all quorum and consensus metadata |
| `revision-loop`           | Switches from `parallel-vote` to `fallback-cascade` on high retry count |

---

```
