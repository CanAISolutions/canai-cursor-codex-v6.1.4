# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/prompt-genetics/purpose.md`  
@purpose: Codifies emotional and architectural role of the module  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧬 Prompt Genetics

**Agent ID:** `prompt-genetics`  
**Codex Status:** ✅ Finalized  
**Snapshot-Safe:** ✅  
**Last Verified:** 2025-04-30

---

## 🎯 Purpose

This agent mutates structured prompt traits using a declared schema, scores their effectiveness, and preserves lineage across generations.  
It acts as the **genetic evolution engine for high-performing prompts** — enabling Copilot-led mutation, fitness-based selection, and variant replay.

Its strategic function is to prevent prompt decay, encourage self-optimization, and unlock adaptive UX precision over time.

---

## 💡 Capabilities

| Feature | Description |
|---------|-------------|
| Trait mutation | Modifies values based on declared schema types (enum, numeric, toggle) |
| Fitness scoring | Applies domain-specific evaluation to judge output quality |
| Schema-bound safety | Validates all changes against versioned schema (`prompt-trait-schema.jsonc`) |
| Lineage tracking | Logs source → variant → replay path via `prompt-lineage-log.md` |
| Drift prevention | Mutations rejected if outside bounds or yield poor fitness |
| Replay-ready trace | Full object returned for later analysis, re-evolution, or audit

---

## 🔁 System Consumers

| Module | Role |
|--------|------|
| `promptReplay.ts` | Uses variant trace to recover prior high-performing version |
| `smart-revision-loop.ts` | Evolves prompt when performance stagnates |
| `promptFixSuggestor.ts` | Suggests structural tweaks during revise fatigue |
| `growth-optimizer.ts` | Applies probabilistic mutation for A/B evolution |

---

## 🚫 Failure Mode if Missing

- High-potential prompts stagnate with no structured mutation  
- Trait changes applied randomly or silently regress  
- Copilots have no way to evolve underperforming outputs  
- Reuse becomes risky without lineage traceability

---

> “This is not just prompt tuning.  
> This is **prompt evolution** — structured, traceable, intelligent.”

```
