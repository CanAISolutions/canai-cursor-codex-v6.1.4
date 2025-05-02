# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/copilot-feedback-agent/integration-contract.md`  
@purpose: Declares all config inputs, runtime triggers, and state interactions  
@drop-type: Copy/paste-safe, Codex-enforced

```md
# 📡 Integration Contract – Copilot Feedback Agent

@agent: copilot-feedback-agent  
@version: v1.0.0  
@layer: Copilot Intelligence × Emotional Recovery  
@enforced-by: system-readiness.ts

---

## 📥 Inputs (Runtime + Config)

This agent uses both runtime session signals and a declarative config file.

### 🧠 Runtime Session Fields

| Field | Type | Description |
|-------|------|-------------|
| `revisionCount` | `number` | How many times a prompt has been edited |
| `emotionalDrift` | `boolean` | True if tone diverges from target intent |
| `copilotActive` | `boolean` | True if user is in Copilot session |
| `userTone` | `string` | Detected user tone (e.g., confused, hopeful) |
| `outputTone` | `string` | Detected tone of current GPT output |

### ⚙️ Configuration Source

File: `copilot-feedback-rules.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `revisionFatigueThreshold` | `number` | Trigger warning if revision count exceeds this |
| `driftCorrectionTips[]` | `string[]` | Suggestions when emotional misalignment is detected |
| `copilotHints[]` | `string[]` | Soft nudges shown during Copilot guidance |
| `manualBypass` | `boolean` | Admin override to silence feedback logic |

---

## 🧾 Output Shape

```ts
{
  trigger: boolean,
  reason: 'emotionalDrift' | 'fatigue' | 'copilotHint',
  suggestion: string,
  severity: 'info' | 'warn' | 'critical'
}
```

---

## 🧷 State Keys

| Key | Type | Description |
|-----|------|-------------|
| `copilot-feedback-agent:lastTriggered` | `object` | Metadata from last feedback trigger |
| → `.reason` | `string` | What triggered the agent |
| → `.timestamp` | `string` | ISO timestamp of event |
| → `.copilotSessionId` | `string?` | Optional ID for traceability |

---

## 🔁 Module Integration Points

| Module | Link |
|--------|------|
| `copilot-ui.tsx` | Renders suggestion bubble |
| `copilot-nudger.ts` | Injects guidance into prompt field |
| `SessionAnalytics.json` | Logs trigger patterns over time |
| `copilot-feedback-logging.md` | Describes trace format for audit visibility |

---

✅ Integration contract now declared.  
```
