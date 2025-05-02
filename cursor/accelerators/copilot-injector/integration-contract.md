# 📡 Integration Contract – Copilot Injector

@agent: copilot-injector  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: UX ⬌ Prompt Refinement ⬌ Coherence

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { CopilotInjectorConfigSchema } from '../../../schemas/accelerators/copilot-injector.schema';
```

| Field                | Type        | Required | Description                                               |
|----------------------|-------------|----------|-----------------------------------------------------------|
| `enabled`            | `boolean`   | ✅       | Enables the injector module                              |
| `triggerTags`        | `string[]`  | ✅       | Tags that prompt injection (e.g., 'clarity', 'optimize') |
| `logLevel`           | `string`    | ⬛       | Logging verbosity                                         |
| `feedbackPolicyPath` | `string`    | ✅       | Markdown file for injection ethics & override policy     |
| `injectThreshold`    | `number`    | ⬛       | Confidence threshold (0–1) for triggering suggestions     |

> **Fail-Closed**: Invalid or missing config triggers `systemReadiness(config: red)` and prevents runtime patching.

---

## 🧠 Injection Suggestion Logic (from `copilot-trigger-rules.jsonc`)

| Field               | Type        | Description                                                  |
|---------------------|-------------|--------------------------------------------------------------|
| `minTokens`         | `number`    | Minimum token count before injection allowed                 |
| `maxToneDeviation`  | `number`    | Tolerance for tone drift before auto-injection               |
| `userClarityScore`  | `number`    | Inject if clarity is below threshold                         |
| `injectionPatterns` | `string[]`  | Prompts to consider injecting (prefix rules, suffix logic)   |

---

## 🔐 Persistent State Keys (via `acceleratorState`)

| Key                                  | Interface                    | Description                                          |
|-------------------------------------|-------------------------------|------------------------------------------------------|
| `copilot-injector:injection-log`    | `CopilotInjectionLogState`   | Tracks injection triggers, patterns, and result     |

### Interface

```ts
export interface CopilotInjectionLogState {
  triggerTag: string;
  injectedText: string;
  injectionPattern: string;
  originalInput: string;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Trigger Rule Set**  
  `/cursor/accelerators/copilot-injector/copilot-trigger-rules.jsonc`

- **Policy Doc**  
  `/cursor/accelerators/copilot-injector/copilot-feedback-policy.md`

- **Suggestion Logic**  
  `/cursor/accelerators/copilot-injector/inject-feedback-suggestions.ts`

- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('copilot-injector')`

- **State Manager**  
  `/shared/acceleratorState.ts#getAcceleratorState`

### Emits To:
- **Injection Log**  
  `setAcceleratorState('copilot-injector:injection-log', …)`

- **Feedback Capture**  
  Optional write to `/logs/feedback_log.json` if `feedbackCapture` enabled

### Invokes:
- `getAcceleratorState(...)` / `setAcceleratorState(...)`  
- `injectFeedbackSuggestions(input, config)`  
- `logger.info(...)`, `logger.warn(...)`  
- `loadConfig('copilot-injector')`  
- `appendFeedbackLog(entry)` *(if required)*

---

## ⚙️ Error Handling & Retry Semantics

- On malformed `copilot-trigger-rules.jsonc` → skip injection, log `observability: yellow`
- Injection function failure → retry once, fallback to non-injected flow
- Failed injection still logs event to assist future refinement

---

## 🔜 Future Integration Teaser

From `future-integration.md`:

- **Inline Suggestion Overlay for End Users**  
- **Real-Time Prompt Patching for Clarity Drift**  
- **Feedback-Aware Rewriter Engine (beta)**  
- **Tone Personalization Hooks**

---

## 🧾 Audit References

| File                                                                                  | Role                                               | Traceability Type     |
|---------------------------------------------------------------------------------------|----------------------------------------------------|------------------------|
| `/cursor/accelerators/copilot-injector/copilot-trigger-rules.jsonc`                  | Rule-based triggers for injection logic           | `json-rules`           |
| `/cursor/accelerators/copilot-injector/copilot-feedback-policy.md`                   | Policy document for ethical boundaries            | `policy-doc`           |
| `/cursor/accelerators/copilot-injector/inject-feedback-suggestions.md`               | Guide on suggestion logic and injection reasoning | `logic-notes`          |
| `/cursor/accelerators/copilot-injector/inject-feedback-suggestions.ts`               | Core logic engine                                 | `suggestion-engine`    |
| `/config/accelerators/copilot-injector.config.jsonc`                                  | Active config loader                              | `config`               |
| `/cursor/accelerators/copilot-injector/self-check-blocks.md`                         | Required file and contract validator              | `assertion-contract`   |
| `/cursor/accelerators/copilot-injector/folder-checklist.md`                          | Human audit checklist                             | `manual-audit`         |
| `/cursor/accelerators/copilot-injector/future-integration.md`                        | Roadmap and planned expansion                     | `strategic-plan`       |
| `/logs/feedback_log.json`                                                            | Captures injection events if enabled              | `system-log`           |

---

✅ **This contract ensures safe, contextual prompt intervention with fallback controls, upstream validation, and aligned UX strategy. It is 100% Codex compliant and future-proofed for modular injection intelligence.**
