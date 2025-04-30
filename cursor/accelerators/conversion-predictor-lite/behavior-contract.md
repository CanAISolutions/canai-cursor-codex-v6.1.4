# 🤖 Behavior Contract – Conversion Predictor Lite

**Module ID:** `conversion-predictor-lite`  
**Purpose:** Score generated output for likelihood to convert based on phrasing, CTA structure, tone signals, and urgency patterns.

---

## 📥 Input Contract

### `scoreConversionLikelihood(output: string): ConversionScoreResult`

- **`output`**: A full GPT-generated response string (not partial or token-incomplete)
- Must be preprocessed for trailing whitespace, Markdown artifacts, or token cutoffs

---

## 📤 Output Schema

### `ConversionScoreResult`

```ts
interface ConversionScoreResult {
  score: number                     // [0.0–1.0] confidence score
  verdict: 'strong' | 'neutral' | 'weak'
  matchedSignals: string[]          // signal IDs from positive matches
  riskFactors: string[]             // signal IDs from negative matches
  trace: {
    snippet: string                 // first 120 chars of output
    reasoning: string               // plain-English match rationale
  }
}
```

---

## 🧠 Copilot Usage Rules

Copilots MAY:

- Score any draft or output before surfacing to user
- Use `verdict === 'weak'` as a signal to rephrase or trigger tone uplift
- Log signals to `PromptLogs.signalMatches[]` or `SessionAnalytics.conversionFlag`
- Show `trace.reasoning` to user in debug or "why this failed" mode

Copilots MUST:

- Never suppress output purely based on score — score is advisory, not block-level
- Treat `score < 0.4` + `verdict = 'weak'` as high-risk UX scenario
- Include `matchedSignals` in revision loop metadata if altered

---

## ⚠️ Fallback + Fail Conditions

| Condition                    | Action Required |
|-----------------------------|------------------|
| Score === 0                 | Log as `conversion-void` |
| matchedSignals.length === 0 | Offer Copilot CTA rewrite |
| score < 0.3 AND riskFactors present | Escalate to fallback variant or swap suggestion |

---

## 🔁 Logging Format

```ts
emitDeltaLog("conversion-score", {
  verdict,
  score,
  signals: matchedSignals,
  risks: riskFactors,
  snippet: trace.snippet,
})
```

Store in:
- `PromptLogs.conversionScore`
- `FeedbackLogs.rewriteTriggered`
- Optional: `SmartPromptScore.conversionWeight`

---

## 🔄 LLM Co-Evolution

- Signal definitions live in `conversion-signals.jsonc`
- All Copilot suggestions must pull from `matchedSignals[]` categories
- Future schema upgrades must include `schemaType` and version lock

---

**Status:** ✅ Codex Finalized – Copilot Safe  
**Last Verified:** 2025-04-30
