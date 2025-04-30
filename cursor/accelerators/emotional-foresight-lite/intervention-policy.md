# 🧠 Emotional Intervention Policy – v1.0.0

Defines how foresight signals trigger UX or system-level interventions.  
Source signals from: `predictEmotionalTrajectory(sessionId, history)`

---

## 🚨 Signal → System Response Map

### TypeScript Schema

```ts
type EmotionalIntervention = {
  signal: EmotionalSignal["name"];
  minConfidence: number; // 0.0–1.0
  response: UXAction[];
  escalationTrigger?: SystemTrigger;
};

type UXAction =
  | "inject-fallbackUX"
  | "copilot-nudge"
  | "suggest-tone-shift"
  | "recommend-alternate-flow"
  | "highlight-emotional-breakthrough"
  | "capture-promptlog"
  | "log-drift-alert";

type SystemTrigger =
  | "notify-alignmentAuditor"
  | "call-dreamTrendAnalyzer"
  | "write-sessionDeltaLog";
```

---

## 🎯 Intervention Matrix

| Signal                 | minConfidence | UX Actions                                              | System Triggers                                     |
|------------------------|----------------|----------------------------------------------------------|-----------------------------------------------------|
| `escalating-frustration` | 0.75           | `inject-fallbackUX`, `copilot-nudge`                     | –                                                   |
| `loop-fatigue`           | 0.75           | `recommend-alternate-flow`, `suggest-tone-shift`         | –                                                   |
| `quiet-drift`            | 0.80           | –                                                        | `call-dreamTrendAnalyzer`, `notify-alignmentAuditor` |
| `hope-signal`            | 0.70           | `highlight-emotional-breakthrough`, `capture-promptlog`  | –                                                   |
| `none-detected`          | –              | –                                                        | –                                                   |

---

## 🧠 Design Directives

- Intervene only if `confidence > minConfidence`
- Prefer **tone-sensitive nudges** before structural changes
- Default to `copilot-nudge` if multiple signals are detected
- Always inject emotion deltas into `sessionDeltaLogEmitter.ts`

---

## 🔌 Copilot Affordances

When `signal.length > 0`, Copilot may:

- Suggest a reset nudge: _“Want a fresh direction?”_
- Auto-swap tone: _“Try a more confident tone?”_
- Route user to an alternate product flow
- Capture current prompt/output in `PromptLogs` for future coaching

---

## 🔒 Versioning

- `schemaReference`: `/cursor/prompt-infrastructure/prompt-schema.md`  
- `lastUpdated`: `2025-04-30`  
- `status`: ✅ Codex-compliant, Copilot-readable, Snapshot-safe  

---

## 📎 Usage

Used by:

- `/cursor/emotional-foresight-lite/foresight-model-lite.ts`
- `/cursor/self-awareness/emotionalDriftPredictor.ts`
- `Copilot Suggestion Engine`
- `auto-prompt-logger.make.json` (Make scenario)
