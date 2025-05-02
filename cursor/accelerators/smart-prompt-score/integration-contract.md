```md
# 📡 Integration Contract – Smart Prompt Score

@agent: smart-prompt-score  
@version: v1.0.0  
@enforced-by: system-readiness.ts  
@layer: Scoring ⬌ Signal Weighting ⬌ Prompt Quality  

---

## 🔌 Required Upstream Fields (from config)

Loaded and validated via Zod:

```ts
import { SmartPromptScoreConfigSchema } from '../../../schemas/accelerators/smart-prompt-score.schema';
```

| Field               | Type                 | Required | Description                                               |
|---------------------|----------------------|----------|-----------------------------------------------------------|
| `enabled`           | `boolean`            | ✅       | Enables the scoring engine                                |
| `scoringWeightsPath`| `string`             | ✅       | Path to `scoring-weights.jsonc` defining signal weights   |
| `thresholds`        | `Record<string, any>`| ✅       | Map of scores → levels (e.g., warn, good, great)          |
| `logLevel`          | `string`             | ⬛       | Logging verbosity (default: 'info')                       |
| `metricsEnabled`    | `boolean`            | ⬛       | Emit detailed performance metrics                         |
| `feedbackCapture`   | `object`             | ⬛       | Optional feedback‐logging settings                         |

> **Fail-Closed**: Malformed or missing config → Zod throws → `systemReadiness()` marks `config: red` and aborts execution.

---

## 📊 Scoring Signals (from `scoring-signals.jsonc`)

| Field               | Type      | Description                                                |
|---------------------|-----------|------------------------------------------------------------|
| `inputCompleteness` | `number`  | Ratio of filled vs expected fields (0–1)                   |
| `clarityScore`      | `number`  | NLP-derived estimate of structural clarity                 |
| `relevanceMatch`    | `number`  | Similarity of input to known high-quality use cases        |
| `toneConsistency`   | `number`  | Match of tone vs expected brand/user tone (0–1)            |
| `promptLength`      | `number`  | Normalized length score for optimal range detection        |

> Signals are Zod-validated; malformed → `systemReadiness()` marks `observability: red` and defaults `score = 0`.

---

## 🔐 Persistent State Keys (via `acceleratorState`)

All keys namespaced as `smart-prompt-score:*`

| Key                            | Interface                  | Description                                     |
|--------------------------------|----------------------------|-------------------------------------------------|
| `smart-prompt-score:final-score` | `SmartPromptScoreState`  | Stores final score, level, breakdown, timestamp |

### Interface

```ts
export interface SmartPromptScoreState {
  score: number;
  level: 'warn' | 'good' | 'great';
  signalBreakdown: Record<string, number>;
  timestamp: string;
  version?: string;
}
```

---

## 🔗 Upstream & Downstream Integrations

### Consumes From:
- **Signal Definitions**  
  `/cursor/accelerators/smart-prompt-score/scoring-signals.jsonc`
- **Weights File**  
  `/cursor/accelerators/smart-prompt-score/scoring-weights.jsonc`
- **Policy Guide**  
  `/cursor/accelerators/smart-prompt-score/scoring-policy.md`
- **Config Loader**  
  `/shared/loadConfig.ts#loadConfig('smart-prompt-score')`
- **Engine Logic**  
  `/cursor/accelerators/smart-prompt-score/prompt-score-engine.ts`

### Emits To:
- **Final Score State**  
  `setAcceleratorState('smart-prompt-score:final-score', …)`
- **Feedback Log**  
  Appends entry to `/logs/feedback_log.json` if `feedbackCapture` enabled
- **Downstream Agents**  
  `auto-rollback`, `copilot-feedback-agent`, `reverse-synthesis-core`

### Invokes:
- `evaluatePromptScore(signals, weights)`  
- `loadConfig('smart-prompt-score')`  
- `getAcceleratorState()` / `setAcceleratorState()`  
- `logger.info()` / `logger.warn()`  
- `appendFeedbackLog(entry)`

---

## ⚙️ Error Handling & Retry Semantics

- Missing weights → fallback to default weights mapping  
- Signal parse error → log `observability: yellow`, set `score = 0`  
- Score below threshold → escalate to `copilot-feedback-agent`

---

## 🔜 Future Integration Teaser

See `/cursor/accelerators/smart-prompt-score/future-integration.md` for:

- **Feedback-Driven Prompt Tuning Agent**  
- **Live Score UX Element**  
- **Smart Defaults Auto-Enhancer**  
- **Signal Drift Tracker**

---

## 🧾 Audit References

| File                                                                                     | Role                                          | Traceability Type     |
|------------------------------------------------------------------------------------------|-----------------------------------------------|-----------------------|
| `/cursor/accelerators/smart-prompt-score/scoring-signals.jsonc`                         | Runtime scoring signals                       | `json-signals`        |
| `/cursor/accelerators/smart-prompt-score/scoring-weights.jsonc`                         | Weight definitions for signal scoring         | `json-weights`        |
| `/cursor/accelerators/smart-prompt-score/scoring-policy.md`                             | Manual fallback logic and rationale           | `policy-doc`          |
| `/config/accelerators/smart-prompt-score-config.jsonc`                                  | Active JSONC config loaded at startup         | `config`              |
| `/schemas/accelerators/smart-prompt-score.schema.ts`                                    | Zod schema for config validation              | `schema`              |
| `/cursor/accelerators/smart-prompt-score/self-check-blocks.md`                          | Validates file presence and state keys        | `assertion-contract`  |
| `/cursor/accelerators/smart-prompt-score/folder-checklist.md`                           | 10-minute manual audit checklist              | `manual-audit`        |
| `/logs/feedback_log.json`                                                                | Captures score results if logging enabled     | `system-log`          |
| `/cursor/accelerators/smart-prompt-score/future-integration.md`                         | Strategic roadmap and next-phase hooks        | `strategic-plan`      |

---

✅ **This contract enforces structured quality scoring, modular weight control, comprehensive observability, and Codex-aligned assurance for real-time prompt evaluation.**
```
