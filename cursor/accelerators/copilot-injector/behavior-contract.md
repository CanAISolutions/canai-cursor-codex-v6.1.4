# 🤖 Behavior Contract – Copilot Injector

**Module:** `copilot-injector`  
**Purpose:** Enables context-aware Copilot suggestions during prompt sessions  
**Codex Rule:** May only be invoked if safety, clarity, and UX alignment are guaranteed.

---

## 🔐 Invocation Conditions

This module may be called **only if all of the following are true**:

| Condition                              | Rationale                          |
|----------------------------------------|-------------------------------------|
| `promptSession.active === true`        | User must still be mid-session     |
| `sessionSignals.score !== null`        | Cannot run without a score         |
| `emotionScore` or `clarityScore` exists| At least one tone-related signal   |
| `userIntent.confirmed !== 'done'`      | Copilot must not interrupt a finished flow |
| `injectionsSoFar < rules.maxPerSession`| Prevents fatigue or over-coaching  |

---

## 🧠 Agent-Compatible API

### Method
```ts
injectCopilotFeedback(signals: SessionSignals): CopilotSuggestion | null
```

### Return
```ts
{
  message: string      // Copilot nudge to show
  reason: string       // Matched condition string
  triggerId: string    // ID from rule config
}
```

### Example Usage
```ts
const suggestion = injectCopilotFeedback(sessionSignals)
if (suggestion) showCopilotMessage(suggestion.message)
```

---

## 🧪 Safe for Use In

| Agent / System               | Mode                        |
|------------------------------|-----------------------------|
| `reviseLoop`                 | post-output only            |
| `zombie-hunter`              | fallback override injected  |
| `smart-prompt-score`         | if score < fallback         |
| `sessionDeltaLogEmitter`     | logs Copilot trigger + response |
| `CopilotFeedbackAgent`       | explicit invocation         |

---

## 🚨 Forbidden Uses

| Scenario                             | Why Blocked                          |
|--------------------------------------|---------------------------------------|
| Copilot message as forced action     | Must always be optional UX           |
| Injection after session completion   | Avoids post-exit confusion           |
| High emotionScore + high clarity     | Avoids overriding strong outputs     |
| User already dismissed same message  | Prevent redundancy + friction        |

---

## 🧬 LLM Co-Evolution Notes

- New triggers can be declared in `copilot-trigger-rules.jsonc`  
- Agent proposals must declare:
  - Trigger conditions  
  - Suggested message  
  - Confidence threshold (if probabilistic)  
- Copilot suggestions must always log via `sessionDeltaLogEmitter`

---

**Codex Status:** ✅ Enforced  
**Invocation Rule:** Declarative-only, Copilot-safe, UX-trust-preserving  
**Behavior Contract Last Audited:** 2025-04-30
