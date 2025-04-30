# ✅ Self-Check Blocks – Zombie Hunter

**Module:** `zombie-hunter`  
**Scope:** Detects session stagnation using declarative signals + triggers prompt recovery.

---

## 🧪 Required Logic Coverage

| Scenario                                  | Test Coverage |
|-------------------------------------------|---------------|
| 3 repeated outputs                        | `same-output-3x` detection |
| Emotion score < 0.2                       | `emotion-flatline` detection |
| Output delta < 0.05 and tone = flat       | `drift-deadzone` trigger |
| Revision count > maxRevisionThreshold     | Forced zombie recovery |
| Valid session, no zombie trigger          | Clean no-op exit |

---

## 🧬 Regression Guards

| Condition                                   | Action |
|--------------------------------------------|--------|
| `recentOutputs.length < 2`                 | Skip multi-revision triggers |
| `rules.patterns.length === 0`              | Emit warning: `no-zombie-patterns-defined` |
| `getSessionLog()` returns null/undefined   | Suppress trigger, log `zombie-check-aborted` |
| `triggerPromptReplay()` fails              | Emit `zombie-rescue-failed` trace |
| `matchedPatterns.length === 0`             | Must still fallback if revision threshold exceeded |

---

## 📤 Delta Logging Enforcement

Each zombie detection MUST emit to:

```ts
emitDeltaLog('zombie-session', {
  sessionId,
  triggers: [pattern.name, ...],
  score: {
    emotionScore,
    outputDelta,
    revisionCount
  },
  reasoning: [pattern.description, ...]
})
```

---

## 🧠 Signal Schema Requirements

- File: `zombie-detection-rules.jsonc`
- Required fields per pattern:
  - `name` (string)
  - `conditions` (array)
  - `trigger` (string)
- Thresholds:
  - `maxRevisionCount` (int)
  - `minEmotionScore` (float)
  - `minOutputDelta` (float)

---

## 🔁 LLM Co-Evolution Logic

| Rule                                          | Reason |
|-----------------------------------------------|--------|
| Must support pattern injection by Copilot     | Future adaptive rescue |
| Pattern `description` must be plain-English   | Required for `reasoning` trace |
| Condition checks must remain string-driven    | Enable prompt-safe evolution |

---

**Codex Compliance:** ✅ Snapshot-Safe, Trigger-Stable  
**Last Verified:** 2025-04-30
