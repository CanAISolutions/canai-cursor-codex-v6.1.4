# auto-rollback.config.json – Codex Field Guide

@source: /config/accelerators/auto-rollback.config.json  
@used-by: auto-rollback.ts  
@schema: auto-rollback.schema.ts  

---

### Field Descriptions

- **`enabled`**  
  `boolean` – Enables or disables the rollback agent logic.  
  - `true` → agent runs  
  - `false` → agent exits immediately

- **`fallbackMode`**  
  `enum: "soft" | "hard"` – Determines behavior if rollback conditions are met.  
  - `"soft"` → log-only, no action  
  - `"hard"` → rollback enforced via engine

- **`logLevel`**  
  `enum: "debug" | "info" | "warn" | "error"` – Controls the verbosity of logging via `_shared/logger.ts`.

- **`policyPath`**  
  `string` – Path to the markdown file defining rollback policies (e.g. `"./rollback-policy.md"`).

- **`triggerConditionsPath`**  
  `string` – Path to a JSONC file containing conditions that trigger rollback (e.g. `"./trigger-conditions.jsonc"`).

- **`metricsEnabled`** *(optional)*  
  `boolean` – Enables observability metrics logging to `/logs/SessionAnalytics.json`.

- **`feedbackCapture`** *(optional)*  
  `object` – Controls logging of cost/feedback metadata for use by the Self-Refine Engine.  
  - `enabled`: `true` or `false`  
  - `logPath`: where to store logs (e.g. `"./feedback_log.json"`)

---

### Codex Integrity Requirements

- This config is Zod-validated by `auto-rollback.schema.ts`
- All required fields must match `minimumFields`
- This file is expected by `auto-rollback.ts` via `loadConfig()`
- Must be present at `/config/accelerators/auto-rollback.config.json`