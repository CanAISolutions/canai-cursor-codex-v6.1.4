# 🛡️ Self-Check Blocks – Copilot Injector

**Module:** `copilot-injector`  
**Codex Layer:** UX Safety, Trigger Validation, Drift Guarding

---

## ✅ Required Test Assertions

### 1. Trigger Match Precision

> Ensure known input conditions fire only the correct trigger.

```ts
expect(injectCopilotFeedback(lowClaritySignals)?.triggerId).toBe('low-score-feedback')
```

---

### 2. Over-injection Prevention

> Copilot must stop suggesting after `maxInjectionsPerSession`.

```ts
expect(injectCopilotFeedback({ injectionsSoFar: 3 })).toBeNull()
```

---

### 3. Emotion Flatline Catch

> Emotion scores below 0.2 must trigger correct emotional nudge.

```ts
expect(injectCopilotFeedback({ emotionScore: 0.1 })?.triggerId).toBe('emotion-flatline')
```

---

### 4. Signal Grace Fallback

> If some signals are missing, logic must not break.

```ts
expect(injectCopilotFeedback({ score: 65 })).toBeDefined()
```

---

### 5. Declarative Rule Schema Must Hold

> Each rule in `copilot-trigger-rules.jsonc` must include:

- `id`  
- `conditions[]` (valid expressions)  
- `copilotMessage` (string)

```ts
rules.triggers.forEach(rule => {
  expect(rule.id).toBeDefined()
  expect(Array.isArray(rule.conditions)).toBe(true)
  expect(typeof rule.copilotMessage).toBe('string')
})
```

---

## 🚨 Failure Policy

| Check Failure              | Action                                   |
|----------------------------|-------------------------------------------|
| Invalid injection          | Block Copilot message, log diagnostic     |
| Misfire or false positive  | Block merge, trigger snapshot delta review |
| Broken condition eval      | Suppress injection, raise LLM review flag |

---

## Codex Enforcement

✅ Snapshot-safe  
✅ Declarative-only  
✅ UX fatigue-safe  
✅ Copilot trust–aligned

All triggers and logic in this module must pass the above tests before being surfaced to end users or agents.

**Last Audited:** 2025-04-30  
**Codex QA Status:** ✅ Final
