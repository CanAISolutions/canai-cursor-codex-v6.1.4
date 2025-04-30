# 🧬 Prompt Genetics

A lightweight prompt evolution engine. Tracks prompt traits, evolves variants, and selects fittest prompts over time.

---

## Files

| File                        | Role                                         |
|-----------------------------|----------------------------------------------|
| `prompt-trait-schema.jsonc` | Defines heritable traits for all prompt types |
| `prompt-genome-engine.ts`   | Core logic for variant creation and fitness scoring |
| `prompt-lineage-log.md`     | Lineage tracking and selection strategy      |

---

## Usage

```ts
const variant = generatePromptVariant(basePrompt, { "tone-clarity": 0.95 })
const score = evaluatePromptFitness(variant)
