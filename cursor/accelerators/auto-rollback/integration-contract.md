```md
# 📡 Integration Contract – Auto-Rollback

@agent: auto-rollback  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Schema ⬌ State ⬌ Safety  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { AutoRollbackConfigSchema } from '../../../schemas/accelerators/auto-rollback.schema';
```

| Field                   | Type                 | Required | Description                                               |
|-------------------------|----------------------|----------|-----------------------------------------------------------|
| `enabled`               | `boolean`            | ✅       | Master switch for the accelerator                         |
| `fallbackMode`          | `"soft" \| "hard"`   | ✅       | Determines enforcement style                              |
| `logLevel`              | `string`             | ✅       | Logger verbosity                                          |
| `policyPath`            | `string`             | ✅       | Path to `rollback-policy.md`                              |
| `triggerConditionsPath` | `string`             | ✅       | Path to `trigger-conditions.jsonc`                        |
| `metricsEnabled`        | `boolean`            | ⬛       | Toggle observability logging                              |
| `feedbackCapture`       | `object`             | ⬛       | Enables cost + feedback logging                           |

> **Fail-Closed**: On missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and aborts immediately, logging the incident.

---

## 🧠 Parsed Runtime Triggers (from `trigger-conditions.jsonc`)

| Field                  | Type        | Description                                                   |
|------------------------|-------------|---------------------------------------------------------------|
| `deltaScoreThreshold`  | `number`    | Percent divergence threshold (> 0.25 triggers rollback)       |
| `emotionalDrift`       | `boolean`   | Emotional anomaly flag (from `emotionalDriftPredictor.ts`)    |
| `modularityBreak`      | `boolean`   | System modularity failure detected                            |
| `selfCheckFailure`     | `string[]`  | Components that failed internal self-checks                   |
| `manualOverride`       | `boolean`   | Bypass flag (force rollback regardless of criteria)           |

> All trigger fields are validated via Zod. Missing or invalid values → `systemReadiness()` marks `observability: red` and skips execution.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `auto-rollback:*`; payloads include an optional `version` for schema evolution.

| Key                             | Interface                     | Description                                          |
|---------------------------------|-------------------------------|------------------------------------------------------|
| `auto-rollback:trigger-state`   | `AutoRollbackTriggerState`    | Records last rollback evaluation and trigger result  |
| `auto-rollback:rollback-target` | `AutoRollbackTargetState`     | Indicates which session/version to revert to         |

### Interfaces
```ts
export interface AutoRollbackTriggerState {
  timestamp: string;
  triggered: boolean;
  reason?: string;
  version?: string;
}

export interface AutoRollbackTargetState {
  sessionId: string;
  versionTag: string;
  rollbackPolicy: string;
  version?: string;
}
```

**Read Dependencies:**

| Key                        | Module & Export                                                     | Purpose                                       |
|----------------------------|---------------------------------------------------------------------|-----------------------------------------------|
| `prompt-score:final-score` | `/cursor/accelerators/smart-prompt-score/prompt-score-engine.ts#getFinalScore` | Compare against `deltaScoreThreshold`         |
| `tone-override:result`     | `/cursor/accelerators/tone-override-agent/tone-overrider.ts#getResult`         | Assess emotional context for rollback         |

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Smart Prompt Score**  
  `/cursor/accelerators/smart-prompt-score/prompt-score-engine.ts#getFinalScore`  
  Reads `prompt-score:final-score` via `getAcceleratorState()`.

- **Tone Override Agent**  
  `/cursor/accelerators/tone-override-agent/tone-overrider.ts#getResult`  
  Reads `tone-override:result`.

- **Output Delta Log**  
  `/logs/prompt_output_delta.json`  
  Provides output divergence data.

- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('auto-rollback')`  
  Loads Zod-validated thresholds.

- **State Manager**  
  `/shared/acceleratorState.ts#getAcceleratorState`  
  Reads global state keys.

### Emits To:
- **State Writes**  
  `setAcceleratorState('auto-rollback:trigger-state', …)`  
  `setAcceleratorState('auto-rollback:rollback-target', …)`

- **Feedback Log**  
  Appends structured entry to `/logs/feedback_log.json`.

- **Copilot Feedback**  
  Indirectly notifies `copilot-feedback-agent` via log entry.

### Invokes:
- `promptReplay(sessionId: string, versionTag: string)`  
  `/shared/replay-engine.ts#promptReplay`

- `getAcceleratorState(key: string)` / `setAcceleratorState(key: string, value: any)`  
  `/shared/acceleratorState.ts`

- `loadConfig('auto-rollback')`  

- `logger.info(...)`  
  `/shared/logger.ts`

- `appendFeedbackLog(entry: object)`  
  `/shared/logger.ts#appendFeedbackLog`

---

## ⚙️ Error Handling & Retry Semantics

- **Primary action**: `promptReplay()` on trigger → if it throws, catch, `logger.error(...)`, retry up to **3 times**.  
- **On persistent error**: set `observability: red`, write error payload to `/logs/feedback_log.json`, escalate to `fallback-handler-agent`.

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/auto-rollback/future-integration.md` for planned hooks into:

- **Analytics Dashboard**: session health metrics  
- **Emergency Alerting**: real-time notifications on rollback storms  
- **Version-Delta Engine**: automatic patch selection  

---

## 🧾 Audit References

| File                                                                                     | Role                                                      | Traceability Type     |
|------------------------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------|
| `/cursor/accelerators/auto-rollback/rollback-policy.md`                                  | Human-readable rules and fallback policies                | `policy-doc`          |
| `/cursor/accelerators/auto-rollback/trigger-conditions.jsonc`                            | JSON-based trigger definitions (runtime-parsed)           | `json-rule`           |
| `/logs/feedback_log.json`                                                                | Captures all rollback events for downstream analysis      | `system-log`          |
| `/logs/prompt_output_delta.json`                                                         | Delta log used by `deltaScoreThreshold` logic             | `signal-log`          |
| `/config/accelerators/auto-rollback.config.jsonc`                                        | Active config loaded at startup                           | `config`              |
| `/cursor/accelerators/auto-rollback/self-check-blocks.md`                                | Declares required keys, files, and validation checks      | `assertion-contract`  |
| `/cursor/accelerators/auto-rollback/folder-checklist.md`                                 | 10-minute human audit checklist                           | `manual-audit`        |
| `/cursor/accelerators/auto-rollback/future-integration.md`                               | Strategic roadmap and next-phase hooks                   | `strategic-plan`      |

---

```
