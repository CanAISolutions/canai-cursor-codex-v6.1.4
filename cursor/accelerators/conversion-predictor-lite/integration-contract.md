# 📡 Integration Contract – Conversion Predictor Lite

@agent: conversion-predictor-lite  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Signals ⬌ Scoring ⬌ Suggestion  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { ConversionPredictorConfigSchema } from '../../../schemas/accelerators/conversion-predictor-lite.schema';
```

| Field                | Type      | Required | Description                                           |
|----------------------|-----------|----------|-------------------------------------------------------|
| `enabled`            | `boolean` | ✅       | Controls whether the predictor runs                   |
| `scoreThreshold`     | `number`  | ✅       | Minimum score required to proceed                     |
| `fallbackAction`     | `string`  | ✅       | Action on low score (e.g., "halt", "warn")            |
| `logLevel`           | `string`  | ⬛       | Logging verbosity (info, debug, warn, error)          |
| `metricsEnabled`     | `boolean` | ⬛       | Enable detailed metric emission                       |
| `feedbackCapture`    | `object`  | ⬛       | Config for feedback logging                           |

> **Fail-Closed**: Missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and aborts execution.

---

## 📶 Parsed Runtime Signals (from `conversion-signals.jsonc`)

| Field                | Type      | Description                                           |
|----------------------|-----------|-------------------------------------------------------|
| `engagementDepth`    | `number`  | Derived measure of input richness (0–1 scale)         |
| `clarityScore`       | `number`  | NLP evaluation of structural clarity                  |
| `industryMatch`      | `boolean` | Whether industry ID matches high-performing cohort    |
| `inputCompleteness`  | `number`  | % of required fields filled before submit (0–1 scale) |
| `userIntentScore`    | `number`  | Model-inferred confidence in user intent (0–1 scale)  |

> Signals are Zod-validated; malformed → `systemReadiness()` marks `observability: red` and defaults `score = 0`.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

| Key                                     | Interface                | Description                                         |
|-----------------------------------------|--------------------------|-----------------------------------------------------|
| `conversion-predictor-lite:score-state` | `ConversionScoreState`   | Records final score, signals payload, and timestamp |

### Interface

```ts
export interface ConversionScoreState {
  score: number;
  signals: {
    engagementDepth: number;
    clarityScore: number;
    industryMatch: boolean;
    inputCompleteness: number;
    userIntentScore: number;
  };
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Signal Source**  
  `/cursor/accelerators/conversion-predictor-lite/conversion-signals.jsonc`  
  Provides runtime signals for scoring.

- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('conversion-predictor-lite')`  
  Loads Zod-validated thresholds and actions.

- **State Manager**  
  `/shared/acceleratorState.ts#getAcceleratorState`  

### Emits To:
- **State Writes**  
  `setAcceleratorState('conversion-predictor-lite:score-state', …)`  
  Persists score & input metrics.

- **Feedback Log**  
  Appends entry to `/logs/feedback_log.json` if `feedbackCapture` enabled.

### Invokes:
- `loadConfig('conversion-predictor-lite')`  
- `getAcceleratorState(key)` / `setAcceleratorState(key, value)`  
- `logger.info(...)`  
- `appendFeedbackLog(entry)`  

---

## ⚙️ Error Handling & Retry Semantics

- Scoring is pure; no retries required.  
- On signal parse failure → fallback `score = 0`, log `observability: red`.  
- On persistent execution error → `systemReadiness()` marks `testing: red`, escalate to `fallback-handler-agent`.

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/conversion-predictor-lite/future-integration.md` for planned hooks:

- **Dynamic Uplift Testing**  
- **Predictive Intervention Layer**  
- **Refinement Triggers**  

---

## 🧾 Audit References

| File                                                                                      | Role                                               | Traceability Type   |
|-------------------------------------------------------------------------------------------|----------------------------------------------------|---------------------|
| `/cursor/accelerators/conversion-predictor-lite/conversion-signals.jsonc`                | Runtime signal definitions                         | `json-signal`       |
| `/config/accelerators/conversion-predictor-lite-config.jsonc`                             | Active config for thresholds and fallback actions   | `config`            |
| `/cursor/accelerators/conversion-predictor-lite/self-check-blocks.md`                    | Validates required keys and file presence           | `assertion-contract`|
| `/cursor/accelerators/conversion-predictor-lite/folder-checklist.md`                     | Manual upgrade audit checklist                      | `manual-audit`      |
| `/cursor/accelerators/conversion-predictor-lite/future-integration.md`                   | Strategic roadmap and next-phase hooks              | `strategic-plan`    |
| `/logs/feedback_log.json`                                                                 | Feedback logging                                    | `system-log`        |

---

✅ **This contract de-risks scoring boundaries, codifies signal handling, enforces validation, ensures observability, and aligns with the Dream-State Vision under the Codex Enforcement Directive.**
