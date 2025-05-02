```md
# 📡 Integration Contract – Federated Memory Lite

@agent: federated-memory-lite  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Memory ⬌ Conflict Resolution ⬌ Routing  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { FederatedMemoryConfigSchema } from '../../../schemas/accelerators/federated-memory-lite.schema';
```

| Field                | Type                          | Required | Description                                                |
|----------------------|-------------------------------|----------|------------------------------------------------------------|
| `enabled`            | `boolean`                     | ✅       | Master switch for memory federation engine                |
| `routingMode`        | `"strict" \| "fallback"`      | ✅       | Controls how routing conflicts are handled                |
| `logLevel`           | `string`                      | ⬛       | Logger verbosity                                           |
| `conflictPolicyPath` | `string`                      | ✅       | Path to `memory-conflict-policy.md`                        |
| `metricsEnabled`     | `boolean`                     | ⬛       | Toggle detailed metric emission                            |
| `feedbackCapture`    | `object`                      | ⬛       | Optional conflict‐logging settings                         |

> **Fail-Closed**: Missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and engine halts immediately.

---

## 📡 Memory Routing Spec (from `memory-routing-spec.jsonc`)

| Field            | Type              | Description                                                     |
|------------------|-------------------|-----------------------------------------------------------------|
| `memoryType`     | `string`          | Category of memory (e.g., "user-profile", "session")            |
| `sourcePriority` | `string[]`        | Ordered list of memory sources to query                         |
| `fallbacks`      | `Record<string, any>` | Map of source to fallback value or rule                     |
| `requireFresh`   | `boolean`         | Reject stale data if true                                       |

> Spec fields validated via Zod; malformed → `systemReadiness()` marks `observability: red` and skips routing.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `federated-memory-lite:*`

| Key                                   | Interface                          | Description                                                  |
|---------------------------------------|------------------------------------|--------------------------------------------------------------|
| `federated-memory-lite:conflict-state`| `MemoryConflictResolutionState`    | Records conflict outcome and resolution path                |

### Interface

```ts
export interface MemoryConflictResolutionState {
  memoryType: string;
  sourcesEvaluated: string[];
  resolutionUsed: string;
  fallbackUsed?: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Memory Routing Spec**  
  `/cursor/accelerators/federated-memory-lite/memory-routing-spec.jsonc`
- **Policy File**  
  `/cursor/accelerators/federated-memory-lite/memory-conflict-policy.md`
- **Federation Engine**  
  `/cursor/accelerators/federated-memory-lite/memory-federation-engine.ts`
- **Session Memory Accessors**  
  `/cursor/session/sessionMemory.ts`  
  `/cursor/session/userMemory.ts`
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('federated-memory-lite')`

### Emits To:
- **State Writes**  
  `setAcceleratorState('federated-memory-lite:conflict-state', …)`
- **Feedback Log**  
  Appends to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Memory Consumers**  
  Exposes `resolveMemoryConflict()` for reuse by other modules

### Invokes:
- `resolveMemoryConflict(memoryType: string)`
- `getAcceleratorState()` / `setAcceleratorState()`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry)`

---

## ⚙️ Error Handling & Retry Semantics

- Missing spec or invalid config → log warning, skip resolution  
- Memory accessor failures → retry up to **2** times, else use configured fallback  
- Unresolvable conflict → mark state `memory: unresolved` and escalate

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/federated-memory-lite/future-integration.md`:

- **Memory Provenance Tagging**  
- **Time-Decayed Routing Filters**  
- **Conflict Escalation Agent**  
- **Federated Memory Audit Trail**

---

## 🧾 Audit References

| File                                                                                | Role                                                | Traceability Type     |
|-------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------|
| `/cursor/accelerators/federated-memory-lite/memory-routing-spec.jsonc`             | Defines memory routing priorities                   | `json-routing`        |
| `/cursor/accelerators/federated-memory-lite/memory-conflict-policy.md`             | Human-readable conflict resolution policies         | `policy-doc`          |
| `/cursor/accelerators/federated-memory-lite/memory-federation-engine.ts`           | Core federation engine logic                        | `engine-core`         |
| `/config/accelerators/federated-memory-lite-config.jsonc`                          | Active JSONC config loaded at startup               | `config`              |
| `/schemas/accelerators/federated-memory-lite.schema.ts`                             | Zod schema validating config                        | `schema`              |
| `/cursor/accelerators/federated-memory-lite/self-check-blocks.md`                  | Validates presence and correctness of required files| `assertion-contract`  |
| `/cursor/accelerators/federated-memory-lite/folder-checklist.md`                   | 10-minute human audit checklist                     | `manual-audit`        |
| `/logs/feedback_log.json`                                                           | Logs conflict-resolution events                     | `system-log`          |
| `/cursor/accelerators/federated-memory-lite/future-integration.md`                 | Strategic roadmap and next-phase hooks              | `strategic-plan`      |

---

✅ **This contract ensures robust, conflict‐aware memory resolution with fallback ethics, detailed observability, and full Codex compliance under the Dream‐State Directive.**
```
