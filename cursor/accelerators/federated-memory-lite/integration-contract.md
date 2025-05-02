# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/federated-memory-lite/integration-contract.md`  
@purpose: Declares all I/O types, config schema, and state keys for safe federation  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🔌 Integration Contract – Federated Memory Lite

@agent: federated-memory-lite  
@version: v1.0.0  
@codex-layer: Context Resolution × Session Memory Safety  
@checkpoint-protocol: v2.3

---

## 📥 Input Schema

```ts
type MemoryRequest = {
  intent: string
  userId: string
  memorySources: {
    source: 'user' | 'system' | 'copilot' | 'gpt'
    value: string
    confidence?: number
    lastModified?: string
  }[]
}
```

- `intent`: declared memory use (e.g. `tone`, `persona`, `instructions`)
- `memorySources`: list of possible values from different origins

---

## 📤 Output Schema

```ts
type MemoryResolutionResult = {
  resolvedValue: string
  sourceUsed: string
  trace: {
    reason: string
    priorityRank: number
    fallbackTriggered?: boolean
    rejectedSources: string[]
  }
}
```

- Trace must always be returned — even if fallback or null resolution
- `fallbackTriggered` must match conditions in `memory-routing-spec.jsonc`

---

## ⚙️ Routing Spec Configuration

File: `memory-routing-spec.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `priorityByIntent` | `Record<string, string[]>` | Ranked source priority for each memory intent |
| `allowFallback` | `boolean` | Whether fallback to lower-priority source is allowed |
| `minimumConfidence` | `number` | Confidence floor (if present in memory source) |
| `conflictResolutionMode` | `'reject' | 'prefer-latest'` | How to handle version mismatch or dual valid sources |

---

## 🧷 State Keys

| Key | Type | Purpose |
|-----|------|---------|
| `federated-memory-lite:lastResolution` | `object` | Stores latest resolution result |
| → `.trace` | `object` | Records source selection path |
| → `.sourceUsed` | `string` | Final chosen source |

---

## 🔁 Downstream Consumers

| Module | Purpose |
|--------|---------|
| `copilot-prompt-builder.ts` | Injects resolved memory into Copilot requests |
| `sessionDeltaLogEmitter.ts` | Logs full trace for audit + analytics |
| `memorySyncBridge.ts` | Updates async memory graph if override detected |

---

```
