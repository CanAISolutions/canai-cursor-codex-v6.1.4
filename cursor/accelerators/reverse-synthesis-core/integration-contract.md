# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/reverse-synthesis-core/integration-contract.md`  
@purpose: Declares I/O types, config schema bindings, and downstream integration  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🔌 Integration Contract – Reverse Synthesis Core

@agent: reverse-synthesis-core  
@version: v1.0.0  
@codex-layer: Output Inference × Trait Reconstruction  
@protocol: v2.3

---

## 📥 Input Schema

```ts
type ReverseSynthesisInput = {
  outputText: string
  contentType: 'email' | 'subjectLine' | 'socialPost' | 'cta' | 'longform'
  fallbackMode?: 'soft' | 'strict'
}
```

- `outputText`: the system-generated or user-modified result  
- `contentType`: used to narrow pattern scopes  
- `fallbackMode`: defines behavior if no confident matches found

---

## 📤 Output Schema

```ts
type SynthesisResult = {
  inferredPromptTags: string[]
  toneMatch: string
  confidenceScore: number
  trace: {
    matchedPatterns: string[]
    fallbackTriggered: boolean
    driftScore: number
    reasoning: string
  }
}
```

- `trace` is required and must always emit fallback state + rationale  
- `confidenceScore` is 0.0–1.0 normalized  
- `driftScore` is 0–1, where 1 = total mismatch from known pattern set

---

## ⚙️ Config Bindings

### File: `synthesis-patterns.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `patternId` | string | Unique identifier |
| `regex` | string | Regex used to match against `outputText` |
| `tags` | string[] | Associated prompt traits or strategies |
| `toneHint` | string | Inferred tone or emotional anchor |
| `confidenceBoost` | number (0.0–1.0) | Optional scoring multiplier |

---

## 📁 Trace Schema

File: `synthesis-trace-schema.md`

> Used for system analytics, Copilot regeneration trace, and UX debugging

| Key | Type | Description |
|-----|------|-------------|
| `outputText` | string | The analyzed string |
| `inferredPromptTags` | string[] | Resulting tags |
| `trace` | object | All scoring and fallback metadata |
| `copilotSafeCommentary` | string | Optional LLM-explainable insight line |

---

## 🧷 State Keys

| Key | Type | Purpose |
|-----|------|---------|
| `reverse-synthesis-core:lastTrace` | object | Stores last full trace result |
| → `.fallbackTriggered` | boolean | Used for Copilot fallback suggestion |
| → `.driftScore` | number | Can trigger emotional re-alignment or revision prompt |

---
