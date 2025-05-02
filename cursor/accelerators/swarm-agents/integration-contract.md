```md
# 📡 Integration Contract – Swarm Agents

@agent: swarm-agents  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Multi-Agent Coordination ⬌ Decision Voting ⬌ Ensemble Strategy  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { SwarmAgentConfigSchema } from '../../../schemas/accelerators/swarm-agents.schema';
```

| Field                 | Type           | Required | Description                                                      |
|-----------------------|----------------|----------|------------------------------------------------------------------|
| `enabled`             | `boolean`      | ✅       | Master switch for multi-agent swarm coordination                 |
| `agentTypes`          | `string[]`     | ✅       | List of sub-agent IDs to coordinate (e.g., ["tone", "rewrite"])  |
| `decisionPolicyPath`  | `string`       | ✅       | Path to `swarm-decision-policy.md`                               |
| `logLevel`            | `string`       | ⬛       | Logging verbosity                                                |
| `consensusThreshold`  | `number`       | ⬛       | Override for agreement threshold (default: 0.6)                  |
| `metricsEnabled`      | `boolean`      | ⬛       | Toggle detailed metric emission                                  |
| `feedbackCapture`     | `object`       | ⬛       | Optional voting‐trace logging settings                            |

> **Fail-Closed**: Missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and aborts orchestration.

---

## 🧠 Swarm Agent Config (from `swarm-agent-config.jsonc`)

| Field           | Type        | Description                                                        |
|-----------------|-------------|--------------------------------------------------------------------|
| `agentId`       | `string`    | Unique identifier of sub-agent (e.g., "tone-checker-1")           |
| `role`          | `string`    | Decision domain of the sub-agent (e.g., "structure", "tone")       |
| `weight`        | `number`    | Relative importance weight for consensus voting (0–1)              |
| `enabled`       | `boolean`   | Whether this sub-agent is active in the swarm                      |

> Parsed and Zod-validated at runtime; malformed entries → fallback to quorum mode with reduced participant set.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `swarm-agents:*`

| Key                         | Interface            | Description                                              |
|-----------------------------|----------------------|----------------------------------------------------------|
| `swarm-agents:vote-state`   | `SwarmVoteState`     | Tracks participant votes, consensus outcome, and metadata |

### Interface

```ts
export interface SwarmVoteState {
  participants: string[];
  votes: Record<string, string>;
  consensusReached: boolean;
  winningDecision: string;
  thresholdUsed: number;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Master Config**  
  `/config/accelerators/swarm-agents-config.jsonc`
- **Sub-Agent Configs**  
  `/cursor/accelerators/swarm-agents/swarm-agent-config.jsonc`
- **Decision Policy**  
  `/cursor/accelerators/swarm-agents/swarm-decision-policy.md`
- **Coordinator Engine**  
  `/cursor/accelerators/swarm-agents/swarm-coordinator-engine.ts`
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('swarm-agents')`

### Emits To:
- **State Vote Log**  
  `setAcceleratorState('swarm-agents:vote-state', …)`
- **Feedback Log**  
  Appends voting trace to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Fallback/Override Agents**  
  Notifies on consensus failure via state change

### Invokes:
- `loadConfig('swarm-agents')`
- `loadSwarmAgents()`
- `runSwarmVote(agentInputs: Record<string, any>)`
- `calculateConsensus(votes, threshold)`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry: object)`
- `setAcceleratorState()` / `getAcceleratorState()`

---

## ⚙️ Error Handling & Retry Semantics

- Missing or broken sub-agent modules → log warning, fallback to quorum-only mode  
- Consensus failures → log `consensus: false`, trigger override strategies  
- Vote mismatches → retry once if `retryable=true`, else record failure  

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/swarm-agents/future-integration.md` for:

- **Confidence-Weighted Voting**  
- **Auto-Agent Rebalancer**  
- **Meta-Agent Overseer Coordination Layer**  

---

## 🧾 Audit References

| File                                                                                          | Role                                                | Traceability Type     |
|-----------------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------|
| `/config/accelerators/swarm-agents-config.jsonc`                                             | Master JSONC config loaded at startup               | `config`              |
| `/cursor/accelerators/swarm-agents/swarm-agent-config.jsonc`                                 | Definitions of sub-agent IDs, roles, and weights    | `json-config`         |
| `/cursor/accelerators/swarm-agents/swarm-decision-policy.md`                                 | Human-readable decision resolution policies         | `policy-doc`          |
| `/cursor/accelerators/swarm-agents/swarm-coordinator-engine.ts`                              | Core multi-agent coordination logic                 | `engine-core`         |
| `/schemas/accelerators/swarm-agents.schema.ts`                                               | Zod schema for master config validation             | `schema`              |
| `/cursor/accelerators/swarm-agents/self-check-blocks.md`                                     | Validates presence and shape of required files      | `assertion-contract`  |
| `/cursor/accelerators/swarm-agents/folder-checklist.md`                                      | 10-minute manual audit checklist                    | `manual-audit`        |
| `/logs/feedback_log.json`                                                                     | Captures voting trace events                        | `system-log`          |
| `/cursor/accelerators/swarm-agents/future-integration.md`                                    | Strategic roadmap for ensemble evolution            | `strategic-plan`      |

---

✅ **This contract enforces robust swarm coordination, fault-tolerant consensus, detailed traceability, and Codex-aligned observability under the Dream-State Directive.**
```
