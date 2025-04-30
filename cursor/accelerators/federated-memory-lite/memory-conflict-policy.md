# 🧠 Federated Memory Conflict Policy

## 🔍 Purpose
Defines how memory collisions, overwrites, and ambiguous source values are resolved within the Cursor Federated Memory Engine (`federated-memory-lite`).

---

## 📜 Version
`conflict-policy.v1.0.0`

---

## 🧩 Conflict Resolution Rules

| Scenario                          | Action                                                                 |
|-----------------------------------|------------------------------------------------------------------------|
| Key exists in multiple sources    | Use the **first available** in the `routingRules[].priority[]` list    |
| Missing `local-session` value     | Fallback to `persona-shard`                                           |
| Conflicting version timestamps    | Use the value with **newer timestamp** (if available in metadata)     |
| Undefined `intent` in routing     | Default to `global-memory`                                            |
| All sources null or missing       | Return `resolvedFrom = 'none'`, `value = null`                        |

---

## 🧠 Agent Invocation Guidance

If you are a Copilot or agent resolving memory:

1. **Always use `resolveMemory()`** – never pick sources directly.
2. **Check `trace.tried[]` and `trace.fallback`** in the result.
3. **Only trust source order** as declared in `memory-routing-spec.jsonc`.
4. **Do not override `resolvedFrom` manually** — it must be deterministic.

---

## 📦 Structured Resolution Example

> Agent: `recursive-thinker`  
> Intent: `"business_vision"`  
> Routing priority: `["local-session", "persona-shard", "global-memory"]`

### State:

| Source         | Value                     | Timestamp     |
|----------------|---------------------------|---------------|
| local-session  | _null_                    | N/A           |
| persona-shard  | `"Launch with clarity"`   | `2025-04-01`  |
| global-memory  | `"Expand to 3 markets"`   | `2025-04-02`  |

### Resolution:

1. `local-session` is null → skip  
2. `persona-shard` has value  
3. `global-memory` is newer, but fallback rule says revert to persona unless "timestamp > session"  
4. → Return: `"Expand to 3 markets"` (from global-memory)

---

## 🧾 Audit Trail Fields (must emit via `emitDeltaLog`)

Every memory resolution should log the following:

| Field         | Description                        |
|---------------|------------------------------------|
| `source`      | Final resolved tier                |
| `timestamp`   | (if available) of selected value   |
| `intent`      | Matched routing intent             |
| `resolvedKey` | Key being resolved (e.g. `"vision"`) |
| `trace`       | Full trace object from engine      |

---

_Last Verified: 2025-04-30 • Status: Snapshot-Safe_
