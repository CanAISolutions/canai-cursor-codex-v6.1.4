# 📡 Integration Contract – Prompt Genetics

@agent: prompt-genetics  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Prompt Evolution ⬌ Trait Tracking ⬌ Lineage Logging  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { PromptGeneticsConfigSchema } from '../../../schemas/accelerators/prompt-genetics.schema';
```

| Field             | Type       | Required | Description                                      |
|-------------------|------------|----------|--------------------------------------------------|
| `enabled`         | `boolean`  | ✅       | Master switch for the accelerator                |
| `logLevel`        | `string`   | ⬛       | Logger verbosity (default: 'info')               |
| `lineageTracking` | `boolean`  | ✅       | Whether to track genetic lineage of prompt traits|
| `metricsEnabled`  | `boolean`  | ⬛       | Toggle detailed metric emission                  |
| `feedbackCapture` | `object`   | ⬛       | Optional genome event capture settings           |

> **Fail-Closed**: Missing or invalid config → Zod throws → `systemReadiness()` marks `config: red` and halts execution.

---

## 🧬 Prompt Trait Schema (from `prompt-trait-schema.jsonc`)

| Field        | Type        | Description                                          |
|--------------|-------------|------------------------------------------------------|
| `tone`       | `string`    | Prompt’s emotional tone or style                     |
| `structure`  | `string`    | Formatting category (e.g., list, paragraph)          |
| `focus`      | `string[]`  | Topics or key intent regions detected                |
| `complexity` | `number`    | Abstraction level or linguistic density (0–1)        |

> Schema fields are validated via Zod; malformed → `systemReadiness()` marks `observability: red` and skips extraction.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `prompt-genetics:*`

| Key                            | Interface               | Description                                |
|--------------------------------|-------------------------|--------------------------------------------|
| `prompt-genetics:genome-state` | `PromptGenomeState`     | Records extracted traits and lineage origin|

### Interface

```ts
export interface PromptGenomeState {
  tone: string;
  structure: string;
  focus: string[];
  complexity: number;
  originSessionId: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Trait Schema**  
  `/cursor/accelerators/prompt-genetics/prompt-trait-schema.jsonc`
- **Prompt Input Context**  
  `/cursor/session/context.ts`
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('prompt-genetics')`

### Emits To:
- **State Writes**  
  `setAcceleratorState('prompt-genetics:genome-state', …)`
- **Lineage Log**  
  Appends entry to `/cursor/accelerators/prompt-genetics/prompt-lineage-log.md`
- **Feedback Log**  
  Optional write to `/logs/feedback_log.json` if `feedbackCapture` enabled

### Invokes:
- `loadConfig('prompt-genetics')`
- `extractPromptTraits(promptText: string)`
- `getAcceleratorState()` / `setAcceleratorState()`
- `logger.info()` / `logger.warn()`
- `appendFeedbackLog(entry)`

---

## ⚙️ Error Handling & Retry Semantics

- On schema parse failure → `observability: yellow`, skip extraction  
- Extraction engine errors → retry once; on persistent failure, mark `genetics: skipped`  
- Absent or invalid config → abort early via `systemReadiness()`

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/prompt-genetics/future-integration.md` for:

- **Trait-Based Prompt Optimizer**  
- **Lineage Explorer Dashboard**  
- **Automated Genome Drift Reactions**  
- **MetaPrompt Architect Assistant**

---

## 🧾 Audit References

| File                                                                                     | Role                                      | Traceability Type   |
|------------------------------------------------------------------------------------------|-------------------------------------------|---------------------|
| `/cursor/accelerators/prompt-genetics/prompt-trait-schema.jsonc`                       | Trait definition for genome tracking      | `json-schema`       |
| `/cursor/accelerators/prompt-genetics/prompt-lineage-log.md`                           | Persistent trait lineage log              | `lineage-log`       |
| `/config/accelerators/prompt-genetics-config.jsonc`                                     | Config file matched by Zod schema         | `config`            |
| `/schemas/accelerators/prompt-genetics.schema.ts`                                       | Zod schema for config validation          | `schema`            |
| `/cursor/accelerators/prompt-genetics/self-check-blocks.md`                            | Validates required keys & files presence  | `assertion-contract`|
| `/cursor/accelerators/prompt-genetics/folder-checklist.md`                              | 10-minute manual audit checklist          | `manual-audit`      |
| `/cursor/accelerators/prompt-genetics/future-integration.md`                            | Strategic roadmap and planned extensions  | `strategic-plan`    |
| `/logs/feedback_log.json`                                                               | Captures genome event logs                | `system-log`        |

---

✅ **This contract enforces schema‐driven trait extraction, meticulous lineage logging, configurable observability, and seamless integration under the CanAI Codex Enforcement Directive.**
```
