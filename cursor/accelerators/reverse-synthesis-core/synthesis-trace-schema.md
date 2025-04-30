# 🧬 Synthesis Trace Schema – Reverse Reconstruction Engine

**Module:** `reverse-synthesis-core`  
**Purpose:** Define the structure of logged data when reverseSynthesize() is invoked.  
This enables Copilot explainability, prompt lineage tracking, and session analytics.

---

## 🗃️ Schema: `ReverseSynthesisTraceLog`

```ts
interface ReverseSynthesisTraceLog {
  outputHash: string                 // hash of generated output (to dedupe / match history)
  detectedIntent: string            // e.g. 'business_vision', 'value_proposition'
  inferredTone: string              // e.g. 'inspiring', 'neutral', 'empathetic'
  promptTemplateId: string          // seed template used (if inferred)
  score: number                     // match confidence (0.0–1.0)
  matchedPatterns: string[]         // name[] from synthesis-patterns.jsonc
  confidenceTags: string[]          // emotional / structural signal tags
  trace: {
    outputSnippet: string           // first 120 characters of output
    reason: string                  // how the match decision was made
  }
  timestamp: string                 // ISO-8601
  sessionId?: string                // optional for session-linked replay
  userId?: string                   // optional for per-user clustering
}
```

---

## 📥 Logged via:

```ts
emitDeltaLog("reverse-synthesis", <ReverseSynthesisTraceLog>)
```

Stored in:
- `SessionAnalytics.reverseTraceLog`
- Optional view: `PromptLogs.trace.reconstruction`

---

## 🧠 Use Cases

| System / Agent                     | Usage |
|-----------------------------------|-------|
| `promptReplay`                    | Restore prompt context from output-only data |
| `feedbackAnalyzer`                | Detect common tones/templates across sessions |
| `smartRevisionLoop`               | Adjust original intent from weak output |
| `copilotDebugger`                 | Explain how inference was made from a generated response |

---

## 🛡️ Validation & Safety

| Field                 | Notes |
|-----------------------|-------|
| `outputHash`          | SHA-256 or fast hash for deduplication |
| `confidenceTags[]`    | Must be sanitized and unique |
| `score`               | Required for trust thresholds |
| `timestamp`           | Always required for replay sync |
| `matchedPatterns[]`   | Validated against synthesis-patterns.jsonc |
| `userId` / `sessionId`| Optional, privacy-governed logging only |

---

**Status:** ✅ Codex Finalized — Trace Schema Stable  
**Last Verified:** 2025-04-30
