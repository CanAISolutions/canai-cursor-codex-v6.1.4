# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/copilot-injector/integration-contract.md`  
@purpose: Declares all input signals, config schema, state keys, and downstream links  
@drop-type: Cursor-safe, Codex standard

```md
# 🔌 Integration Contract – Copilot Injector

@agent: copilot-injector  
@version: v1.0.0  
@layer: Copilot UX × Prompt Recovery  
@enforced-by: system-readiness.ts

---

## 📥 Runtime Inputs (Session Signals)

| Field | Type | Description |
|-------|------|-------------|
| `smartPromptScore` | `number` | Output quality score (0–100) |
| `revisionCount` | `number` | How many times the prompt has been edited |
| `emotionalScore` | `number` | Normalized score of emotional resonance (0.0–1.0) |
| `outputChangeDelta` | `number` | Degree of variation between prompt versions |
| `copilotSessionId` | `string` | Optional session tracking ID |

---

## ⚙️ Declarative Trigger Map

File: `copilot-trigger-rules.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `lowScoreThreshold` | `number` | Score below which feedback is considered |
| `revisionFatigueThreshold` | `number` | Revision count that flags stagnation |
| `emotionFlatlineThreshold` | `number` | Minimum acceptable emotional score |
| `maxMessagesPerSession` | `number` | Hard limit on Copilot nudges |
| `triggerMatrix[]` | `object[]` | Conditions → Suggestions map |
| `manualBypass` | `boolean` | Force-disable for advanced users or test mode |

---

## 📤 Output Shape

```ts
{
  shouldInject: boolean,
  message: string,
  triggerId: string,
  severity: 'info' | 'warn' | 'critical'
}
```

---

## 🧷 State Keys

| Key | Format | Description |
|-----|--------|-------------|
| `copilot-injector:lastTrigger` | `object` | Stores last injected message metadata |
| → `.triggerId` | `string` | Why the message was sent |
| → `.timestamp` | `string` | ISO time for log replay |
| → `.copilotSessionId` | `string` | Trace ID if session-bound |

---

## 🔁 Downstream Integration Points

| Module | Link |
|--------|------|
| `copilot-ui.tsx` | Renders inline suggestion bubble |
| `deltaLogWriter.ts` | Logs injection in session audit trail |
| `SessionAnalytics.json` | Tracks severity + trigger usage |
| `promptScoreDriftMonitor.ts` | Compares injection history to score outcomes |

---

```
