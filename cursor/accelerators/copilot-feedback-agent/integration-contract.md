```md
# 📡 Integration Contract – Copilot Feedback Agent

@agent: copilot-feedback-agent  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Judgment ⬌ Feedback ⬌ UX  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { CopilotFeedbackConfigSchema } from '../../../schemas/accelerators/copilot-feedback-agent.schema';
```

| Field               | Type        | Required | Description                                          |
|---------------------|-------------|----------|------------------------------------------------------|
| `enabled`           | `boolean`   | ✅       | Master toggle for the agent                          |
| `interventionTags`  | `string[]`  | ✅       | Tags to monitor for flagging issues                  |
| `logLevel`          | `string`    | ⬛       | Logging verbosity level                              |
| `feedbackRulesPath` | `string`    | ✅       | Path to `copilot-feedback-rules.jsonc`               |
| `policyPath`        | `string`    | ✅       | Path to `copilot-feedback-policy.md`                 |
| `metricsEnabled`    | `boolean`   | ⬛       | Toggle observability metrics                         |

> **Fail-Closed**: Missing or malformed config → Zod throws → `systemReadiness()` marks `config: red` and agent aborts safely.

---

## 📃 Parsed Feedback Rules (from `copilot-feedback-rules.jsonc`)

| Field            | Type        | Description                                         |
|------------------|-------------|-----------------------------------------------------|
| `triggerPhrases` | `string[]`  | Triggers feedback when detected in input/output     |
| `maxWordCount`   | `number`    | Warn if response exceeds this word count threshold  |
| `toneMismatch`   | `boolean`   | Triggers if output tone differs from expected       |
| `inputWeakness`  | `boolean`   | Detects low-signal or weak user input               |

> Rules are Zod-validated; malformed → `systemReadiness()` marks `observability: red` and skips feedback.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

| Key                                    | Interface                     | Description                               |
|----------------------------------------|-------------------------------|-------------------------------------------|
| `copilot-feedback-agent:session-log`   | `CopilotFeedbackLogState`     | Logs flags, triggers, and detected tone   |

### Interface

```ts
export interface CopilotFeedbackLogState {
  flags: string[];
  triggers: string[];
  detectedTone?: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('copilot-feedback-agent')`  
  Loads rules and policy paths.

- **Feedback Rules**  
  `/cursor/accelerators/copilot-feedback-agent/copilot-feedback-rules.jsonc`

- **Policy Doc**  
  `/cursor/accelerators/copilot-feedback-agent/copilot-feedback-policy.md`

- **Input Context**  
  `/cursor/session/context.ts`

- **Tone Analysis**  
  `/cursor/accelerators/tone-override-agent/tone-overrider.ts#getResult`

### Emits To:
- **State Writes**  
  `setAcceleratorState('copilot-feedback-agent:session-log', …)`

- **Feedback Log**  
  Appends entry to `/logs/feedback_log.json`

- **Copilot Injector**  
  Indirectly triggers via state change and feedback log

### Invokes:
- `evaluateFeedbackTriggers()`  
  `/cursor/accelerators/copilot-feedback-agent/copilot-feedback-engine.ts`
- `getAcceleratorState()` / `setAcceleratorState()`  
  `/shared/acceleratorState.ts`
- `logger.warn()` / `logger.info()`  
  `/shared/logger.ts`
- `appendFeedbackLog(entry)`  
  `/shared/logger.ts#appendFeedbackLog`

---

## ⚙️ Error Handling & Retry Semantics

- Invalid rules or missing context → skip feedback, log warning, `observability: yellow`  
- Engine errors → retry up to **2** times; on persistent failure, log error and abort  
- On fail-safe trip → mark session `feedback: partial` in state

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/copilot-feedback-agent/future-integration.md` for:

- **User-Facing Feedback Overlay**  
- **Prompt Rewrite Suggestions**  
- **Session Scorecard & Refinement Loop**  
- **Feedback Model Training Hooks**

---

## 🧾 Audit References

| File                                                                  | Role                                           | Traceability Type     |
|-----------------------------------------------------------------------|------------------------------------------------|-----------------------|
| `/cursor/accelerators/copilot-feedback-agent/copilot-feedback-rules.jsonc` | Rule definitions for feedback triggers     | `json-rules`          |
| `/cursor/accelerators/copilot-feedback-agent/copilot-feedback-policy.md` | Fallback and override policy                | `policy-doc`          |
| `/config/accelerators/copilot-feedback-agent-config.jsonc`           | Active Zod-validated config                    | `config`              |
| `/cursor/accelerators/copilot-feedback-agent/self-check-blocks.md`   | Validates config, rules, and state keys        | `assertion-contract`  |
| `/cursor/accelerators/copilot-feedback-agent/folder-checklist.md`    | Manual audit checklist                         | `manual-audit`        |
| `/cursor/accelerators/copilot-feedback-agent/future-integration.md`  | Strategic roadmap                              | `strategic-plan`      |
| `/logs/feedback_log.json`                                             | Central feedback event log                     | `system-log`          |

---

✅ **This contract ensures human-aligned feedback flow, AI transparency, fail-safe defaults, and enforcement of Codex clarity across sessions, signals, and refinement triggers.**
```
