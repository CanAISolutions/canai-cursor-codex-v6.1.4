```md
# 📡 Integration Contract – Reverse Synthesis Core

@agent: reverse-synthesis-core  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Output Deconstruction ⬌ Pattern Recognition ⬌ Intent Extraction  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { ReverseSynthesisConfigSchema } from '../../../schemas/accelerators/reverse-synthesis-core.schema';
```

| Field                   | Type        | Required | Description                                                  |
|-------------------------|-------------|----------|--------------------------------------------------------------|
| `enabled`               | `boolean`   | ✅       | Master switch for engine activation                          |
| `logLevel`              | `string`    | ⬛       | Logger verbosity                                             |
| `synthesisPatternsPath` | `string`    | ✅       | Path to `synthesis-patterns.jsonc`                           |
| `traceLogging`          | `boolean`   | ⬛       | Enables detailed trace dumps of the matching process         |
| `metricsEnabled`        | `boolean`   | ⬛       | Toggle detailed metric emission                              |
| `feedbackCapture`       | `object`    | ⬛       | Optional fallback‐logging settings                           |

> **Fail-Closed**: Missing/invalid config → Zod throws → `systemReadiness()` marks `config: red` and aborts immediately.

---

## 🔁 Synthesis Patterns (from `synthesis-patterns.jsonc`)

| Field           | Type        | Description                                             |
|-----------------|-------------|---------------------------------------------------------|
| `patternId`     | `string`    | Unique identifier for the pattern                       |
| `matchType`     | `string`    | Heuristic used (semantic, structural, hybrid)           |
| `expectedShape` | `string`    | Target output format this pattern applies to           |
| `recoveryHint`  | `string`    | Fallback recommendation if pattern match fails         |

> Pattern definitions are validated via Zod; malformed → `systemReadiness()` marks `observability: red` and skips deconstruction.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `reverse-synthesis-core:*`

| Key                                | Interface                        | Description                                           |
|------------------------------------|----------------------------------|-------------------------------------------------------|
| `reverse-synthesis-core:trace-state` | `ReverseSynthesisTraceState`   | Stores most recent trace results for synthesis replay |

### Interface

```ts
export interface ReverseSynthesisTraceState {
  patternMatched: string;
  extractedIntent: string;
  confidence: number;
  triggeredFallback?: boolean;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Pattern Definitions**  
  `/cursor/accelerators/reverse-synthesis-core/synthesis-patterns.jsonc`
- **Trace Schema Doc**  
  `/cursor/accelerators/reverse-synthesis-core/synthesis-trace-schema.md`
- **Engine Logic**  
  `/cursor/accelerators/reverse-synthesis-core/reverse-synthesis-engine.ts`
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('reverse-synthesis-core')`

### Emits To:
- **State Trace**  
  `setAcceleratorState('reverse-synthesis-core:trace-state', …)`
- **Feedback Log**  
  Appends to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Fallback Agents**  
  Triggers tone rebalancing or copilot intervention via state change

### Invokes:
- `matchSynthesisPatterns(outputText: string)`
- `loadConfig('reverse-synthesis-core')`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry: object)`
- `setAcceleratorState()` / `getAcceleratorState()`

---

## ⚙️ Error Handling & Retry Semantics

- Malformed pattern schema → log warning, skip to default `recoveryHint`  
- Matching engine error → retry once; on persistent failure, abort with trace dump  
- No pattern matched → mark `pattern: unknown`, log trace-state

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/reverse-synthesis-core/future-integration.md` for:

- **Intent Reflection Loop**  
- **Prompt Regenerator Hooks**  
- **Auto-Synthesis Repair Agent**  
- **Pattern Training UI**

---

## 🧾 Audit References

| File                                                                                         | Role                                       | Traceability Type     |
|----------------------------------------------------------------------------------------------|--------------------------------------------|-----------------------|
| `/cursor/accelerators/reverse-synthesis-core/synthesis-patterns.jsonc`                      | Pattern definitions for output deconstruction | `json-patterns`    |
| `/cursor/accelerators/reverse-synthesis-core/synthesis-trace-schema.md`                     | Markdown schema for trace result structuring | `schema-doc`       |
| `/cursor/accelerators/reverse-synthesis-core/reverse-synthesis-engine.ts`                   | Core matching engine logic                  | `engine-core`         |
| `/config/accelerators/reverse-synthesis-core-config.jsonc`                                  | Active JSONC config loaded at startup       | `config`              |
| `/schemas/accelerators/reverse-synthesis-core.schema.ts`                                    | Zod schema for config validation            | `schema`              |
| `/cursor/accelerators/reverse-synthesis-core/self-check-blocks.md`                          | Validates required files and state keys     | `assertion-contract`  |
| `/cursor/accelerators/reverse-synthesis-core/folder-checklist.md`                           | 10-minute manual audit checklist            | `manual-audit`        |
| `/logs/feedback_log.json`                                                                    | Logs trace & fallback capture events        | `system-log`          |
| `/cursor/accelerators/reverse-synthesis-core/future-integration.md`                         | Strategic roadmap for next-phase evolution  | `strategic-plan`      |

---

✅ **This contract deconstructs outputs into repeatable patterns, codifies fallback logic, captures semantic drift, and prepares downstream agents for adaptive refinement under the Codex Enforcement Directive.**
```
