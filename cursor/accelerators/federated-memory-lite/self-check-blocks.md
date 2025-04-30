# ✅ Self-Check Blocks – Federated Memory Lite

Module: `federated-memory-lite`  
Purpose: Safely resolve memory values from prioritized tiers using routing logic

---

## 🧪 Automated QA Assertions

These are enforced via `memory-federation-engine.spec.ts`:

- [x] Resolves memory from first valid tier
- [x] Falls back to persona-shard if all tier sources null
- [x] Defaults to global-memory if no rule matches
- [x] Returns `resolvedFrom = none` and `value = null` if no data anywhere

→ Snapshot Stable  
→ Deterministic outputs  
→ Traceable `MemoryResolutionResult` included in all cases

---

## 🧠 Drift/Mutation Checks

| Checkpoint                        | Status     | Enforced Via                  |
|----------------------------------|------------|-------------------------------|
| Routing schema version match     | ✅ Locked  | `memory-routing-spec.jsonc` (`v1.0.0`)  
| Intent fallback compatibility    | ✅ Safe    | `fallback.on-missing` policy  
| Tier resolution order respected  | ✅ Enforced| `routingRules.priority[]`  
| Trace completeness               | ✅ Audited | `trace.tried` + `trace.fallback` presence  
| Null handling safety             | ✅ Guarded | All tier accesses null-checked  

---

## ⚙️ Self-Healing Compatibility

This module is compatible with the following self-healing systems:

| System                          | Mode              | Purpose                                     |
|--------------------------------|-------------------|---------------------------------------------|
| `sessionDeltaLogEmitter`       | Passive Log       | Emits `trace` into session audit trails     |
| `promptReplay.ts`              | Replay Compatible | Rebuilds prompt flows using `trace` object  |
| `dreamTrendAnalyzer`           | Analyzer Compatible | Detects memory tier overuse or starvation |

---

## 🧠 LLM Copilot Behavior

Copilots should:

- Use `.trace` to debug resolution chains
- Never hardcode routing; always read from `memory-routing-spec.jsonc`
- Validate `intent` before invoking to avoid silent failure

---

## 🛑 Failure Triggers

Trigger automatic QA alert if:

- Schema version is undefined
- `resolvedFrom` is undefined
- `trace.tried.length` is `0` for matched intents

---

_Last Verified: 2025-04-30 • Status: Snapshot-Safe_
