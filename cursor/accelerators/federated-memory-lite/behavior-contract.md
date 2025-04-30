# 🧠 Federated Memory Lite – Behavior Contract

### ✅ Module ID
`federated-memory-lite`

### 📌 Purpose
Resolves the most relevant memory value from prioritized sources based on routing rules per intent.

---

## 🧩 Input Contract

### `MemoryRequest`
```ts
type MemorySource = 'local-session' | 'persona-shard' | 'global-memory' | 'system-override'

interface MemoryRequest {
  key: string                     // Unique memory key identifier
  intent: string                  // Used to match a routing rule
  context: string                 // Optional debug or trace context
  sources: Record<MemorySource, string | null>  // All potential memory inputs
}
```

> ✅ Copilot must ensure the `intent` matches one of the routing rules in `memory-routing-spec.jsonc`.

---

## 📤 Output Contract

### `MemoryResolutionResult`
```ts
interface MemoryResolutionResult {
  resolvedFrom: MemorySource | 'fallback' | 'none',
  value: string | null,
  trace: {
    key: string
    intent: string
    tried: MemorySource[]
    fallback: string
    resolved: string | null
  }
}
```

- `resolvedFrom`: which tier won (or fallback/none)
- `trace`: audit trail for delta logs or debug

> ✅ Safe for logging and Copilot chain-of-thought inspection

---

## ⚠️ Failure Behavior

| Scenario                    | Resolution                        |
|-----------------------------|------------------------------------|
| Unknown intent              | fallback to `global-memory`       |
| No values in any tier       | returns `null`, `resolvedFrom: 'none'` |
| Invalid `sources` object    | throws TypeError (must conform)   |

---

## 🧠 LLM Invocation Pattern

> Copilots may use this module if:

1. They provide a valid `MemoryRequest`
2. They read `memory-routing-spec.jsonc` to align with supported intents
3. They use `.trace` in output for downstream debug or replay

---

## 🧬 Versioning

- Current Routing Schema: `v1.0.0`
- All routing is deterministic and replayable
- Future versions must preserve `trace` compatibility

---

## ✅ Safe for:

- Agent chaining
- Real-time Copilot decisions
- Prompt interpretation fallback routing
- Delta log emission (`emitDeltaLog('memory-resolution', result.trace)`)

---

_Last Verified: 2025-04-30 • Status: Codex Locked_
