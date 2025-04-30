# 🧠 Behavior Contract – Tone Override Agent

**Module:** `tone-override-agent`  
**Codex Status:** Enforced  
**Primary Method:** `getToneOverride(signals: SessionToneSignals)`  
**Return Type:** `ToneOverrideResult | null`

---

## 🔐 Invocation Policy

Tone override logic may **only** be triggered if:

| Condition                          | Reason                                                        |
|-----------------------------------|---------------------------------------------------------------|
| `emotionScore < 0.3`              | Indicates flat or emotionally dead output                     |
| OR `outputDrift > 0.8`            | Suggests prompt has veered too far from initial alignment     |
| `revisionCount <= 3`              | Protects against over-injection in late-stage sessions        |
| `copilotInjectionCount < 2`       | Ensures override doesn’t compound fatigue or frustration      |

---

## ✅ May Be Invoked By

| System or Agent       | Mode              |
|------------------------|-------------------|
| `zombie-hunter`        | post-drift-check  |
| `promptReplay`         | during replay phase |
| `CopilotFeedbackAgent`| on tone misfire   |
| `reviseLoopEngine`     | if no improvement after 2+ turns |

---

## ❌ Forbidden Use Cases

| Scenario                        | Reason for Block                                      |
|----------------------------------|--------------------------------------------------------|
| Already aligned tone and emotion | No override needed — would create UX dissonance       |
| Revision count > 5              | Session is already too deep; user intent overrides tone |
| Injection after `sessionEnd`     | No override should happen after user concludes session |

---

## 📤 Return Object

```ts
{
  overrideId: string           // e.g. 'reassuring-clarity'
  traits: Record<string, any> // values to inject into prompt scaffolding
  reason: string              // 'emotion flatline' or 'high drift'
}
```

---

## 💡 Codex Design Notes

- Traits are declared in `tone-profiles.jsonc`  
- All suggestions are optional and non-authoritative  
- LLMs may evolve profiles but must preserve schema  
- Override events must be logged in `sessionDeltaLogEmitter`

---

**Status:** ✅ Codex Final  
**Audit Passed:** 2025-04-30  
**Ready for Production:** Yes
