# 📡 Integration Contract – Tone Override Agent

@agent: tone-override-agent  
@version: v1.0.0  
@enforced-by: system-readiness.ts (verifies this file and all referenced paths)  
@layer: Emotional Tone ⬌ Consistency Enforcement ⬌ UX Alignment  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { ToneOverrideConfigSchema } from '../../../schemas/accelerators/tone-override-agent.schema';
```

| Field              | Type        | Required | Description                                                |
|--------------------|-------------|----------|------------------------------------------------------------|
| `enabled`          | `boolean`   | ✅       | Master switch for the tone override agent                  |
| `toneThreshold`    | `number`    | ✅       | Minimum similarity score before override is considered     |
| `fallbackTone`     | `string`    | ✅       | Tone to apply when mismatch is detected                    |
| `allowOverride`    | `boolean`   | ✅       | If true, override is auto-applied; if false, only flagged   |
| `toneProfilePath`  | `string`    | ✅       | Path to `tone-profiles.jsonc`                              |
| `logLevel`         | `string`    | ⬛       | Logging verbosity                                          |
| `metricsEnabled`   | `boolean`   | ⬛       | Toggle detailed metric emission                            |
| `feedbackCapture`  | `object`    | ⬛       | Optional override event logging settings                   |

> **Fail-Closed**: Missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and skips tone intervention.

---

## 🎭 Tone Profile Definition (from `tone-profiles.jsonc`)

| Field            | Type       | Description                                               |
|------------------|------------|-----------------------------------------------------------|
| `profileName`    | `string`   | Label for the tone set (e.g., "professional", "friendly") |
| `expectedTone`   | `string`   | Canonical tone label                                      |
| `matchThreshold` | `number`   | Required similarity score (0–1) to be accepted            |

> Profiles are Zod-validated at load; malformed entries → fallback to default tone profile.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `tone-override:*`

| Key                   | Interface               | Description                          |
|-----------------------|-------------------------|--------------------------------------|
| `tone-override:result`| `ToneOverrideResult`    | Final tone decision and metadata     |

### Interface

```ts
export interface ToneOverrideResult {
  originalTone: string;
  finalTone: string;
  overrideApplied: boolean;
  reason?: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Config File**  
  `/config/accelerators/tone-override-agent-config.jsonc`
- **Tone Profiles**  
  `/cursor/accelerators/tone-override-agent/tone-profiles.jsonc`
- **Override Policy**  
  `/cursor/accelerators/tone-override-agent/tone-realignment-policy.md`
- **Engine Logic**  
  `/cursor/accelerators/tone-override-agent/tone-overrider.ts`
- **Tone Detector**  
  `/cursor/agents/tone-detector.ts`

### Emits To:
- **State Write**  
  `setAcceleratorState('tone-override:result', …)`
- **Feedback Log**  
  Appends to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Downstream Agents**  
  Consulted by `auto-rollback`, `copilot-feedback-agent`, etc.

### Invokes:
- `detectTone(promptText: string)`
- `compareAgainstExpectedTone(expectedProfile: Profile)`
- `loadConfig('tone-override-agent')`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry: object)`
- `setAcceleratorState()` / `getAcceleratorState()`

---

## ⚙️ Error Handling & Retry Semantics

- Tone detection failure → retry once; on persistent error, apply `fallbackTone` and log
- Invalid profile file → skip override, log warning
- Override engine error → fallback UX notification and `observability: red`

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/tone-override-agent/future-integration.md` for:

- **Tone Fine-Tuner UI**  
- **Session-Level Tone Drift Tracker**  
- **Persona-Aware Tone Memory**  
- **Tone-Tuned Prompt Generator**  

---

## 🧾 Audit References

| File                                                                                   | Role                                                | Traceability Type     |
|----------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------|
| `/config/accelerators/tone-override-agent-config.jsonc`                               | Master JSONC config loaded at startup               | `config`              |
| `/cursor/accelerators/tone-override-agent/tone-profiles.jsonc`                        | Runtime tone match expectations                     | `json-profile`        |
| `/cursor/accelerators/tone-override-agent/tone-realignment-policy.md`                 | Human-readable override criteria                    | `policy-doc`          |
| `/cursor/accelerators/tone-override-agent/tone-overrider.ts`                          | Core engine logic                                   | `engine-core`         |
| `/schemas/accelerators/tone-override-agent.schema.ts`                                 | Zod schema for config validation                    | `schema`              |
| `/cursor/accelerators/tone-override-agent/self-check-blocks.md`                       | Validates file presence, schema, and state keys     | `assertion-contract`  |
| `/cursor/accelerators/tone-override-agent/folder-checklist.md`                        | Manual verification checklist                       | `manual-audit`        |
| `/logs/feedback_log.json`                                                              | Logs tone override events                           | `system-log`          |
| `/cursor/accelerators/tone-override-agent/future-integration.md`                      | Strategic roadmap                                   | `strategic-plan`      |

---

✅ **This contract locks tone control as a formal UX invariant, codifies override logic, ensures traceability of emotional misalignment, and future-proofs tone intelligence under the CanAI Codex Enforcement Directive.**
```
