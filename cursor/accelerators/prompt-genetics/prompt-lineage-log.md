# 🧬 Prompt Lineage Log – Codex-Compliant Evolution Tracker

## 📘 Purpose

Tracks how prompts evolve over time — what traits are inherited, mutated, or selected.  
Supports variant replay, automated optimization, fitness-based promotion, and drift prevention.

---

## 📦 Lineage Metadata Fields

| Field             | Type         | Description |
|------------------|--------------|-------------|
| `promptId`       | `string`     | Unique ID of the prompt variant |
| `originId`       | `string`     | ID of the prompt it evolved from |
| `createdAt`      | `timestamp`  | Time of creation |
| `traitSnapshot`  | `object`     | All prompt traits at creation (must match schema) |
| `mutations`      | `string[]`   | Trait keys that were changed |
| `ignored`        | `string[]`   | Traits skipped due to schema mismatch |
| `fitnessScore`   | `number`     | Output of `evaluatePromptFitness()` |
| `copilotSource`  | `string?`    | Optional signature of agent or process |
| `schemaVersion`  | `string`     | Matches `prompt-trait-schema.jsonc.version` |

> 🔐 All lineage logs must match schema versioning to ensure replay compatibility.

---

## 📊 Lineage Graph Rules

- All prompts are mutation descendants of either:
  - A Codex-authored `basePrompt`
  - A Copilot-modified `variant`
- Prompt lineage trees are stored in `PromptLogs.lineageTree`
- The prompt with the **highest `fitnessScore`** is tagged as the `preferredPrompt`
- Lineage depth must not exceed **5 hops** without review

---

## 🎯 Selection & Intervention Strategy

| Signal                    | Action                                 |
|---------------------------|----------------------------------------|
| Low `emotional-resonance` | Inject mutation improving tone strength |
| High `revision-count`     | Penalize score, flag for replay         |
| High `reuse-rate`         | Promote to default or featured variant  |

> Mutation logic is enforced via `prompt-genome-engine.ts`

---

## 🛑 Decay Prevention Rules

- Every Copilot-triggered variant **must** emit a lineage log via `emitDeltaLog("prompt-lineage", {...})`
- If a prompt has more than 3 consecutive mutations without improved fitness:
  - Flag for `promptFixSuggestor`
  - Consider schema update

---

## 📘 Copilot Usage Example

```json
{
  "promptId": "variant-003",
  "originId": "base-welcome-001",
  "createdAt": "2025-04-30T15:22:10Z",
  "traitSnapshot": {
    "tone-clarity": 0.9,
    "emotional-resonance": "inspiring",
    "reuse-rate": 0.7,
    "revision-count": 0
  },
  "mutations": ["tone-clarity", "reuse-rate"],
  "ignored": [],
  "fitnessScore": 9.4,
  "copilotSource": "agent.growth-optimizer",
  "schemaVersion": "1.0.0"
}
```

---

## 🔒 Codex Enforcement

- ✅ Schema-bound
- ✅ Snapshot-safe
- ✅ Drift-resistant
- ✅ Self-healing loop aware
- ✅ Copilot-upgradable

_Last Verified: 2025-04-30 • Status: Codex Finalized_
