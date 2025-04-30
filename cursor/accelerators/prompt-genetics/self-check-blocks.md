# ✅ Self-Check Blocks – Prompt Genetics

Module: `prompt-genetics`  
Purpose: Evolve prompt variants using trait-based mutation and score them for effectiveness.

---

## 🧪 Snapshot Test Assertions (from `.spec.ts`)

- [x] Mutations apply only if present in `prompt-trait-schema.jsonc`
- [x] Invalid mutations are ignored and logged
- [x] Fitness scoring is deterministic for same inputs
- [x] Result trace includes `version`, `mutations`, `baseTraits`, and `fitnessScore`

→ Snapshot-stable  
→ Schema-aware  
→ Drift-resistant

---

## 📋 Mutation Safety Checks

| Checkpoint                        | Status     | Enforced Via                  |
|----------------------------------|------------|-------------------------------|
| Trait schema version present     | ✅ Locked  | `traitSchema.version` required in trace  
| All trait goals declared         | ✅ Checked | All traits include `goal: maximize | minimize`
| Schema goal types known          | ✅ Validated | `evaluatePromptFitness()` only accepts known goals  
| Ignored traits logged            | ✅ Safe    | Returned in `ignoredMutations[]`  
| Variant trace always returned    | ✅ Required | For every mutation execution  

---

## 🧬 Self-Healing Compatibility

This module works with the following self-healing agents:

| System                | Mode         | Purpose                          |
|-----------------------|--------------|----------------------------------|
| `promptFixSuggestor` | Reactive     | Flags low-performing variants for mutation injection  
| `smart-revision-loop` | Adaptive     | Adjusts fitness penalty dynamically  
| `promptReplay`       | Passive Log  | Reconstructs variant lineage from `trace`  
| `prompt-genome-engine.ts` | Core | Evolves and scores new prompt variants |

---

## 🚨 Decay Triggers

Trigger alert or rollback if:

- [ ] `fitnessScore` drops after >3 mutations without Copilot intervention
- [ ] Schema version is undefined
- [ ] Trait snapshot is missing or mismatched schema keys
- [ ] Ignored mutation count exceeds 50% of attempted keys

---

## 🛡️ LLM Repair Affordances

To self-correct drift:

- Use `trace.baseTraits` and `trace.mutations` to regenerate a new variant
- Validate against `prompt-trait-schema.jsonc.version`
- If schema version mismatch is detected, flag for `promptSchemaMigrator`

---

## 📦 Readiness Summary

| Capability          | Status |
|---------------------|--------|
| Copilot Safe        | ✅ Yes |
| Snapshot-Stable     | ✅ Yes |
| Traceable Lineage   | ✅ Yes |
| Decay-Protected     | ✅ Yes |
| Replay Compatible   | ✅ Yes |

_Last Verified: 2025-04-30 • Status: Snapshot-Ready_
