# 🧬 Prompt Lineage & Variant Tracking

Tracks how prompts evolve over time — which traits are inherited, mutated, or selected.

---

## 📊 Lineage Graph Rules

- Every prompt has:
  - A unique `promptId`
  - Parent `originId`
  - Trait snapshot (see `prompt-trait-schema`)
  - Fitness score
- Lineages are traced via mutation trees stored in `PromptLogs`
- Prompt with highest `fitnessScore` per lineage is promoted to `preferredPrompt` in metadata

---

## 🎯 Selection Strategy

| Goal                   | Action                                |
|------------------------|----------------------------------------|
| Low emotional score    | Inject variant with stronger tone alignment |
| High revision count    | Penalize variant fitness, flag for replay  |
| High reuse rate        | Promote to default variant pool        |

---

## Agent Usage

→ Used by: `promptReplay`, `smart-revision-loop`, `promptFixSuggestor`  
→ Optional input for Copilot: “Evolve from `promptId` X with adjusted tone”

---

## Warning

Always track prompt evolution in `sessionDeltaLogEmitter` to prevent drift loops.
