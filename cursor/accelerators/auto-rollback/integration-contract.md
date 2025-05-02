# 📡 Integration Contract – Auto-Rollback

@agent: auto-rollback  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Schema ⬌ State ⬌ Safety  

---

## 🔌 Required Upstream Fields (from config)

These fields are loaded from `/config/accelerators/auto-rollback.config.json`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | `boolean` | ✅ | Master switch for agent |
| `fallbackMode` | `"soft" | "hard"` | ✅ | Determines rollback enforcement style |
| `logLevel` | `string` | ✅ | Logger verbosity |
| `policyPath` | `string` | ✅ | Path to `rollback-policy.md` |
| `triggerConditionsPath` | `string` | ✅ | Path to `trigger-conditions.jsonc` |
| `metricsEnabled` | `boolean` | ⬛ optional | Toggle observability logging |
| `feedbackCapture` | `object` | ⬛ optional | Enables cost + feedback logging |

These are Zod-enforced in `auto-rollback.schema.ts`.

---

## 🧠 Parsed Runtime Triggers (from `trigger-conditions.jsonc`)

| Field | Type | Description |
|-------|------|-------------|
| `deltaScoreThreshold` | `number` | Percent divergence threshold |
| `modularityBreak` | `boolean` | Failed modular repair |
| `emotionalDrift` | `boolean` | Emotional state anomaly |
| `selfCheckFailure[]` | `string[]` | System components that failed |
| `manualOverride` | `boolean` | Force-true bypass |

---

## 🔐 Persistent State Keys (via acceleratorState.set)

All keys are namespaced as `auto-rollback:*`

| Key | Type | Description |
|-----|------|-------------|
| `auto-rollback:lastRun` | `object` | Tracks last rollback attempt and result |
| → `.timestamp` | `string (ISO)` | When rollback was evaluated |
| → `.triggered` | `boolean` | Whether it executed |
| → `.reason` | `string?` | (future) Cause of rollback |

---

## 🧩 Contracts with Other Accelerators

| Module | Link |
|--------|------|
| `rollback-engine.ts` | Executes core rollback trigger logic |
| `output-delta-analyzer.ts` | Provides drift score input |
| `self-check-blocks.md` | Source of readiness failure signals |
| `SessionAnalytics.json` | Logs outcome for audit + recovery |
| `promptReplay.ts` | Invoked in hybrid/hard rollback |

---

✅ This file is required for schema alignment, traceability, and fail-safe state scoping.  