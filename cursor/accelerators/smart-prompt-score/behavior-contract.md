# 🤖 Behavior Contract – Smart Prompt Score

**Module:** `smart-prompt-score`  
**Interface Type:** Evaluator Engine  
**Copilot Access:** ✅ Approved  
**Trigger Type:** Optional (used for QA, replay, enhancement routing)

---

## 📥 Input Format

```ts
type SignalInput = {
  clarityScore?: number
  emotionScore?: number
  outputDelta?: number
  revisionCount?: number
  reuseRate?: number
}
```

> All fields are optional but `clarityScore` and `emotionScore` are strongly recommended.  
> Signals must be normalized float (0.0–1.0), integer (0–10), or percentage (0.0–1.0) as per schema.

---

## 📤 Output Contract

```ts
type ScoringResult = {
  totalScore: number              // Weighted score (0–100)
  normalizedSignals: Record<string, number>
  reasoning: string[]             // Explanation chain for Copilot or logs
  grade: 'fallback' | 'pass' | 'gold'
}
```

---

## 🧠 Agent Usage Examples

| Agent / Module            | Use Case                                  |
|---------------------------|--------------------------------------------|
| `Copilot Feedback`        | Detect weak prompts and inject suggestions |
| `Golden Prompt Filter`    | Grade = gold → archive for reuse library   |
| `promptReplay.ts`         | Score < fallback → inject tone fix        |
| `reviseLoopScorer.ts`     | Compare delta between versions            |

---

## 🛑 Fail-Safe Behavior

| Condition                          | Fallback |
|-----------------------------------|----------|
| Missing signals                   | Score only what exists + warn     |
| Unexpected value (NaN, out of range) | Skip trait + warn in `reasoning` |
| Schema mismatch                   | Suppress output + emit debug log |

---

## 🧬 LLM Co-Evolution

- Traits are declared in `scoring-signals.jsonc`  
- Each trait includes name, type, weight, and goal  
- Copilots may propose new traits in evolution flow  
- Normalization logic is safe and version-locked

---

## ✅ Summary

| Property            | Status     |
|---------------------|------------|
| Copilot-safe        | ✅ Yes      |
| Prompt-explainable  | ✅ Yes      |
| Schema-driven       | ✅ Yes      |
| Fallback hardened   | ✅ Yes      |
| Ready for evolution | ✅ Yes      |

**Codex Status:** Approved for Copilot invocation  
**Change Policy:** Declarative config only — no hardcoded trait logic allowed
