// cursor/accelerators/prompt-genetics/prompt-genome-engine.ts
// 🧬 Prompt Genome Engine – Codex Locked
// Purpose: Generate prompt variants via trait mutation and compute a fitness score aligned to schema goals.

import traitSchema from './prompt-trait-schema.jsonc'

export type PromptTraits = Record<string, any>

export interface PromptGenomeResult {
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

/**
 * Generates a new prompt variant by applying mutations to a base prompt trait set.
 * Only mutations defined in the trait schema will be applied.
 */
export function generatePromptVariant(base: PromptTraits, mutations: Partial<PromptTraits>): PromptGenomeResult {
  const variant: PromptTraits = { ...base }
  const applied: string[] = []
  const ignored: string[] = []

  for (const trait in mutations) {
    const match = traitSchema.traits.find(t => t.name === trait)
    if (match) {
      variant[trait] = mutations[trait]
      applied.push(trait)
    } else {
      ignored.push(trait)
    }
  }

  return {
    variant,
    appliedMutations: applied,
    ignoredMutations: ignored,
    fitness: evaluatePromptFitness(variant),
    trace: {
      version: traitSchema.version || '1.0.0',
      baseTraits: base,
      mutations
    }
  }
}

/**
 * Computes a prompt fitness score based on trait goals in the schema.
 * "maximize" traits are rewarded for higher values; "minimize" for lower.
 */
export function evaluatePromptFitness(traits: PromptTraits): number {
  let score = 0

  traitSchema.traits.forEach(trait => {
    const value = traits[trait.name]
    if (trait.goal === 'maximize') {
      score += typeof value === 'number' ? value : 1
    } else if (trait.goal === 'minimize') {
      score += typeof value === 'number' ? (1 / (1 + value)) : 0
    }
  })

  return parseFloat(score.toFixed(3))
}
