# ✅ Self-Check Blocks – Reverse Synthesis Core

**Module:** `reverse-synthesis-core`  
**Purpose:** Validate all reverse inference logic, ensure Copilot-safe execution, and prevent trace decay or pattern drift.

---

## 🧪 Snapshot Tests Required

- [x] Pattern match → returns structured inference (`intent`, `tone`, `templateId`)
- [x] No match → returns safe fallback with score = 0
- [x] Long outputs → truncates `trace.outputSnippet` to ≤ 123 chars
- [x] Duplicate tags removed in `confidenceTags[]`
- [x] Output is always schema-conformant (no undefined/nulls)

---

## 🛡️ Decay & Drift Protections

| Condition                            | Triggered Action |
|-------------------------------------|------------------|
| `score === 0.0`                     | Log `trace.degenerate-pattern` |
| No match after 3 prior calls        | Trigger Copilot pattern suggestion alert |
| Score < 0.2 + `tone = neutral`      | Suppress reuse scoring in PromptLogs |
| Pattern set empty / malformed       | Block engine + emit `pattern-engine-invalid` log |

---

## 🧠 LLM Co-Evolution Hooks

- Patterns declared in `synthesis-patterns.jsonc`
- Each pattern includes: `name`, `match`, `intent`, `tone`, `template`, `tags[]`
- Must support dynamic reloading or manual override in dev mode
- Agents can suggest additions via `PatternSuggester` tool

---

## 🔁 Logging + Trace Requirements

Each use of `reverseSynthesize()` must:

- Emit `trace.outputSnippet` (≤ 120 chars + ellipsis)
- Emit `matchedPatterns[]`
- Include human-readable `trace.reason`
- Log to `SessionAnalytics.reverseTraceLog` if score ≥ 0.3

---

## 🧩 Resilience Summary

| Checkpoint                        | ✅ |
|----------------------------------|----|
| Pure function, snapshot-safe     | ✅ |
| Fallback-aware and error-tolerant| ✅ |
| Log-emitting, introspectable     | ✅ |
| Schema-driven and versioned      | ✅ |
| Copilot-safe and replay-ready    | ✅ |

---

**Status:** 🔒 Codex Compliant – All checks enforced  
**Last Verified:** 2025-04-30
