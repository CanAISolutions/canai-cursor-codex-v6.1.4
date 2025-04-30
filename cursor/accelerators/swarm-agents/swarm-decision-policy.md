# 🧠 Swarm Agent Decision Policy

**Module:** `swarm-agents`  
**Purpose:** Defines how outputs are scored, selected, and retried based on swarm agent behavior and configuration.

---

## 🛠️ Swarm Execution Modes

| Mode                | Behavior |
|---------------------|----------|
| `parallel-vote`     | All agents run → `output-evaluator` selects best result based on scoring |
| `sequential-refine` | Agents run in series → each modifies previous output |
| `fallback-cascade`  | Primary agent runs → if error or low confidence, fallback is triggered |

> Default mode is set via `swarm-agent-config.jsonc.defaultMode`

---

## ✅ Quorum & Decision Rules

| Condition                         | Resolution                          |
|-----------------------------------|--------------------------------------|
| `parallel-vote` requires quorum   | Majority or `output-evaluator` score wins |
| Scores within 5% margin           | Prefer output with higher tone-resonance |
| `sequential-refine` agent fails   | Use last known valid result, mark error |
| `fallback-cascade` fails twice    | Trigger `copilot-suggestion` override agent |

---

## 🔐 Confidence & Score Tags

Each agent output must be enriched with:

- `agentId`
- `score`: `0.0 – 1.0` (normalized confidence or quality signal)
- `toneMatch`: `"low" | "medium" | "high"`
- `deltaDrift`: optional comparison to original input (e.g. % change or sentiment shift)

---

## 🧪 Safety & Recovery Protocol

| Failure Condition                        | Recovery Action |
|------------------------------------------|------------------|
| All agents fail                          | Return fallback output and emit `swarm.all-failed` event |
| Evaluator missing in `parallel-vote`     | Use most recent successful agent |
| Drift exceeds threshold                  | Reroute to `recursive-thinker` agent |
| Repeated fallback triggers (≥ 2)         | Escalate to `copilot.revision-suggester` |

> All decisions and fallbacks must be logged to `SessionAnalytics.swarmDecisionLog`

---

## 🔁 Log Emission Format

```ts
interface SwarmDecisionLog {
  mode: 'parallel-vote' | 'sequential-refine' | 'fallback-cascade'
  selectedOutput: string
  agentTraces: {
    agentId: string
    score?: number
    toneMatch?: 'low' | 'medium' | 'high'
    error?: string
  }[]
  fallbackTriggered: boolean
  decisionRationale: string
}
```

Emitted via:
```ts
emitDeltaLog("swarm-decision", <SwarmDecisionLog>)
```

---

## 🔮 Future Enhancements

- Dynamic swarm size based on input ambiguity or UX fatigue
- Weighted agent voting via `priorityWeight` from config
- Integration with `feedbackAnalyzer` to pre-select agent set
- Multi-round swarm negotiation (for creative divergence)

---

_Last Verified: 2025-04-30 • Status: Codex Finalized – Decision Layer Stable_
