# 💬 Copilot Injector  
**Module:** `/cursor/accelerators/copilot-injector/`  
**Codex Status:** ✅ Codex Finalized • Last Verified: 2025-04-30  
**Purpose:** Inject emotionally intelligent Copilot feedback into prompt sessions when outputs stall, misfire, or lack clarity.

---

## 🧠 Strategic Role

This module safeguards session quality by:
- Detecting clarity breakdowns, flat tone, or revision fatigue  
- Offering optional suggestions to redirect, clarify, or restart  
- Reinforcing emotional resonance through respectful micro-interventions  
- Reducing frustration loops and silent dropoff from poor outputs

---

## 📁 Files

| File                                | Purpose                                        |
|-------------------------------------|------------------------------------------------|
| `inject-feedback-suggestion.ts`     | Core engine to evaluate if Copilot should speak |
| `copilot-trigger-rules.jsonc`       | Declarative conditions that trigger feedback    |
| `copilot-feedback-policy.md`        | UX rules + emotional design principles          |
| `behavior-contract.md`              | Invocation guardrails for agent/codex safety    |
| `copilot-injector.spec.ts`          | Full module integration + schema validation     |
| `inject-feedback-suggestion.spec.ts`| Unit tests for injection edge cases             |
| `self-check-blocks.md`              | Codex QA expectations + test enforcement        |

---

## 🧪 Trigger Summary

| Trigger ID           | Fires When...                                  |
|----------------------|-------------------------------------------------|
| `low-score-feedback` | score < 72 and low clarity/emotion              |
| `zombie-stallout`    | many revisions + no change in output            |
| `emotion-flatline`   | emotional score < 0.2                           |
| `revise-loop-fatigue`| 6+ revisions                                   |
| `first-drift-detected`| high change + low reuse                        |

All conditions must pass validation in `copilot-trigger-rules.jsonc`

---

## 🧠 Invocation Examples

```ts
const suggestion = injectCopilotFeedback(sessionSignals)

if (suggestion) {
  showCopilotMessage(suggestion.message)
  logDelta('copilot_suggested', suggestion.triggerId)
}
```

---

## 🔐 Codex Lock Criteria

✅ Declarative-only triggers  
✅ Max 2 Copilot messages per session  
✅ Full LLM co-evolution traceable  
✅ Emotionally safe tone defaults  
✅ Defensive input handling  
✅ Snapshot-stable test coverage  
✅ Self-check blocks and audit logic embedded

---

This module enforces **Clarity, Trust, and Emotional Precision** in live sessions.  
It protects user momentum and reinforces CanAI’s emotional OS.

**Status:** ✅ Codex Finalized • Last Verified: 2025-04-30
