# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/reverse-synthesis-core/purpose.md`  
@purpose: Declares intent, emotional function, and failure case of reverse synthesis  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧬 Reverse Synthesis Core

**Agent ID:** `reverse-synthesis-core`  
**Codex Status:** ✅ Finalized  
**Snapshot-Safe:** ✅  
**Last Verified:** 2025-04-30

---

## 🎯 Purpose

This module reverse-engineers the **likely traits, tone, and structure** of a prompt based on the output it produced.  
It turns system outputs into **queryable artifacts** — unlocking UX debugging, prompt lineage traceability, Copilot-enhanced regeneration, and audit-level transparency.

Its role is to give CanAI the power to **think backwards**: understand what created an output, why it behaved that way, and how to re-anchor it.

---

## 💡 Capabilities

| Feature | Description |
|---------|-------------|
| Output → Trait Reconstruction | Detects template, tone, emotion, and goal |
| Schema-bound Pattern Matching | Uses `synthesis-patterns.jsonc` to evolve cleanly |
| Confidence + Drift Scoring | Measures accuracy + divergence from known patterns |
| Full Trace Output | Provides tags, matches, fallback paths, and scores |
| Pure Function – Stateless | Fully testable and Copilot-invocable |
| Emotionally Safe Inference | Never over-asserts; fallback-aware and annotated |

---

## 🚫 Failure Mode if Missing

- Copilot cannot recover or improve unknown outputs  
- UX debugging becomes guesswork  
- Prompt replay cannot safely reconstruct prior intent  
- LLM mutations risk compounding drift

---

> “The future doesn’t just need generation — it needs understanding.  
> This module brings cognition to the past.”  
```
