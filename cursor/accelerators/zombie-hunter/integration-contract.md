```md
# 📡 Integration Contract – Zombie Hunter

@agent: zombie-hunter  
@version: v1.0.0  
@enforced-by: system-readiness.ts (verifies this file and referenced paths)  
@layer: Activity Monitoring ⬌ Stagnation Detection ⬌ Session Recovery  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { ZombieHunterConfigSchema } from '../../../schemas/accelerators/zombie-hunter.schema';
```

| Field               | Type        | Required | Description                                                   |
|---------------------|-------------|----------|---------------------------------------------------------------|
| `enabled`           | `boolean`   | ✅       | Master switch for zombie session detection                    |
| `maxIdleMinutes`    | `number`    | ✅       | Max minutes of inactivity before intervention                 |
| `rescueStrategy`    | `string`    | ✅       | Strategy to apply (“prompt”, “replay”, “feedback”)            |
| `logLevel`          | `string`    | ⬛       | Verbosity for activity logging                                |
| `metricsEnabled`    | `boolean`   | ⬛       | Toggle detailed metric emission                               |
| `feedbackCapture`   | `object`    | ⬛       | Optional rescue‐event logging settings                         |

> **Fail-Closed**: Missing or invalid config → Zod throws → `systemReadiness()` marks `config: red` and aborts zombie checks.

---

## 🧟 Detection Rules (from `zombie-detection-rules.jsonc`)

| Field              | Type      | Description                                                   |
|--------------------|-----------|---------------------------------------------------------------|
| `minSteps`         | `number`  | Minimum prompt interactions before inactivity is flagged       |
| `maxTimeSinceLast` | `number`  | Max milliseconds since last user action                        |
| `skipIfActive`     | `boolean` | Skip check if other activity detected                          |

> Rules are Zod-validated at runtime; malformed → `systemReadiness()` marks `observability: red` and skips detection.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `zombie-hunter:*`

| Key                           | Interface                       | Description                                        |
|-------------------------------|---------------------------------|----------------------------------------------------|
| `zombie-hunter:session-check`| `ZombieSessionCheckState`       | Last inactivity evaluation & rescue result         |

### Interface

```ts
export interface ZombieSessionCheckState {
  sessionId: string;
  inactivityMinutes: number;
  rescueTriggered: boolean;
  strategyUsed: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Config File**  
  `/config/accelerators/zombie-hunter-config.jsonc`
- **Detection Rules**  
  `/cursor/accelerators/zombie-hunter/zombie-detection-rules.jsonc`
- **Policy File**  
  `/cursor/accelerators/zombie-hunter/stagnation-policy.md`
- **Engine Logic**  
  `/cursor/accelerators/zombie-hunter/zombie-rescue-engine.ts`
- **Session Monitor**  
  `/cursor/session/lastActivity.ts`

### Emits To:
- **State Write**  
  `setAcceleratorState('zombie-hunter:session-check', …)`
- **Feedback Log**  
  Appends to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Fallback Agents**  
  Triggers replay or alert modules based on `rescueStrategy`

### Invokes:
- `evaluateSessionIdleTime(sessionId: string)`
- `applyRescueStrategy(strategy: string)`
- `loadConfig('zombie-hunter')`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry: object)`

---

## ⚙️ Error Handling & Retry Semantics

- Inactivity evaluation failure → skip check, log `observability: yellow`
- Rescue engine error → retry once, then fallback to alert UX
- Incomplete session data → log warning and skip, marking `observability: red`

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/zombie-hunter/future-integration.md` for:

- **Smart UX Nudge Layer**  
- **Session Heartbeat Visualizer**  
- **Activity Pattern AI Clustering**  
- **Proactive Re-engagement Suggestions**

---

## 🧾 Audit References

| File                                                                                   | Role                                              | Traceability Type   |
|----------------------------------------------------------------------------------------|---------------------------------------------------|---------------------|
| `/cursor/accelerators/zombie-hunter/zombie-detection-rules.jsonc`                     | Inactivity detection thresholds                   | `json-rules`        |
| `/cursor/accelerators/zombie-hunter/stagnation-policy.md`                             | Human-readable recovery policy                    | `policy-doc`        |
| `/cursor/accelerators/zombie-hunter/zombie-rescue-engine.ts`                          | Core rescue logic engine                          | `engine-core`       |
| `/config/accelerators/zombie-hunter-config.jsonc`                                     | Master JSONC config loaded at startup             | `config`            |
| `/schemas/accelerators/zombie-hunter.schema.ts`                                       | Zod schema for config validation                  | `schema`            |
| `/cursor/accelerators/zombie-hunter/self-check-blocks.md`                             | Validates presence and correctness of files       | `assertion-contract`|
| `/cursor/accelerators/zombie-hunter/folder-checklist.md`                              | Manual QA and audit checklist                     | `manual-audit`      |
| `/logs/feedback_log.json`                                                              | Logs rescue events                                | `system-log`        |
| `/cursor/accelerators/zombie-hunter/future-integration.md`                            | Strategic roadmap for session recovery            | `strategic-plan`    |

---

✅ **This contract secures session activity resilience, codifies stagnation detection & recovery strategies, enforces observability, and fortifies UX continuity under the CanAI Codex Enforcement Directive.**
```
