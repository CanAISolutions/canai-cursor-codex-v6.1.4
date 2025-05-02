# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/prompt-genetics/integration-contract.md`  
@purpose: Defines schema, I/O structure, and state keys for mutation + replay logic  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧬 Integration Contract – Prompt Genetics

@agent: prompt-genetics  
@version: v1.0.0  
@checkpoint-protocol: v2.3  
@codex-type: Structural Evolution Engine

---

## 📥 Input Schema

```ts
type PromptGenomeInput = {
  basePrompt: string
  traits: Record<string, any>
  schemaVersion: string
  goal: 'increase_clicks' | 'boost_emotion' | 'reduce_length' | 'custom'
}
```

- `traits`: key-value object using `prompt-trait-schema.jsonc`
- `goal`: drives fitness function selection

---

## 📤 Output Schema

```ts
type PromptVariantResult = {
  mutatedPrompt: string
  traitsUsed: Record<string, any>
  fitnessScore: number
  variantId: string
  trace: {
    mutationReason: string
    ignoredTraits: string[]
    schemaVersion: string
    parentVariantId?: string
  }
}
```

- `trace` must include lineage and schema metadata  
- If `mutationReason = "reused_parent"`, no mutation applied — replay logic detected

---

## ⚙️ Trait Schema Spec

File: `prompt-trait-schema.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Trait name |
| `type` | `enum | numeric | toggle` | Value type |
| `goals` | `string[]` | Optimization goals this trait affects |
| `default` | any | Safe fallback |
| `allowedValues` | any[] | Required for `enum` |
| `min`, `max` | number | Required for `numeric` |

---

## 🧷 State Keys

| Key | Type | Purpose |
|-----|------|---------|
| `prompt-genetics:lastVariant` | object | Stores most recent mutation output |
| → `.variantId` | string | Unique for each new prompt variant |
| → `.fitnessScore` | number | Used by revision loop for scoring |
| → `.trace` | object | Full lineage + schema record |

---

## 🔁 Downstream Consumers

| Module | Function |
|--------|----------|
| `promptReplay.ts` | Replays variant by `variantId` |
| `smartPromptScore.ts` | Can influence fitness logic |
| `SessionAnalytics.json` | Logs trait → fitness mapping |
| `growth-optimizer.ts` | Uses variant generation for evolution loop |

---

```
