# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/federated-memory-lite/purpose.md`  
@purpose: Declares emotional role, strategic function, and failure consequence of this agent  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧠 Federated Memory Lite

**Agent ID:** `federated-memory-lite`  
**Codex Status:** ✅ Finalized  
**Snapshot Safe:** ✅  
**Last Verified:** 2025-04-30

---

## 🎯 Purpose

This agent resolves memory values using source priority, intent routing, and fallback logic.  
It acts as a **routing engine for memory trust** — deciding which memory is valid, traceable, and emotionally safe for Copilot use.

Its role is to eliminate ambiguity, prevent memory misuse, and ensure every Copilot session runs with **clarity, confidence, and continuity**.

---

## 💡 Key Capabilities

| Feature | Description |
|---------|-------------|
| Federated resolution | Chooses best memory from multiple sources (user, system, Copilot, GPT) |
| Intent-aware routing | Varies source priority based on request type (e.g. tone, brand, instructions) |
| Trace-based transparency | Logs `trace` with decision path for every resolution |
| Conflict-safe | Rejects memory collisions unless explicitly allowed |
| Replay-safe | Delta-logs all results to support memory debugging |
| Schema-bound fallback | Uses `memory-routing-spec.jsonc` and `self-check-blocks.md` as control plane |

---

## 🚫 Failure Mode if Missing

- Copilot may hallucinate or ignore correct memory
- Conflicts silently overwrite critical instructions
- Session trust breaks due to unresolved context
- Debugging becomes impossible without trace

> Without this agent, memory is not federated — it’s fragmented.

---
```
