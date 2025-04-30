# 🧬 Behavior Contract – Prompt Genetics Engine

Module ID: `prompt-genetics`

Purpose: Generate evolved prompt variants by mutating input traits and evaluating fitness.

---

## 🧩 Input Contract

### `generatePromptVariant(base, mutations)`

```ts
type PromptTraits = Record<string, any>

function generatePromptVariant(
  base: PromptTraits,
  mutations: Partial<PromptTraits>
): PromptGenomeResult
```

- `base`: original trait map (must match schema)
- `mutations`: partial override (only valid schema traits will be applied)

---

## 📤 Output Contract

### `PromptGenomeResult`

```ts
interface PromptGenomeResult {
  variant: PromptTraits
  appliedMutations: string[]
  ignoredMutations: string[]
  fitness: number
  trace: {
    version: string
    baseTraits: PromptTraits
    mutations: Partial<PromptTraits>
  }
}
```

> ✅ Always returns a valid `trace` object and deterministic `fitness` score.

---

## 📏 Mutation Policy

| Rule                                   | Description |
|----------------------------------------|-------------|
| Traits not in schema → ignored         | Returned in `ignoredMutations[]` |
| Duplicate traits → last one wins       | Applied via override semantics |
| No valid mutations → returns base      | Still includes full trace object |

---

## 🧠 Copilot Usage Rules

Copilots may:

- Read `prompt-trait-schema.jsonc` to determine valid traits
- Invoke `generatePromptVariant()` with proposed mutations
- Log result to `PromptLogs.lineageTree` and `sessionDeltaLogEmitter`
- Compare `fitnessScore` across variants to promote `preferredPrompt`

---

## 🧬 Version Enforcement

- Schema version in trace **must match** `prompt-trait-schema.jsonc.version`
- If mismatch is detected:
  - Copilot must flag for migration
  - Do not apply mutations or compare scores across versions

---

## 🔁 Replay & Recovery

- `trace` object can be used to regenerate any variant deterministically
- Use `evaluatePromptFitness()` to re-score if schema goals evolve

---

_Last Verified: 2025-04-30 • Status: Codex Locked_
