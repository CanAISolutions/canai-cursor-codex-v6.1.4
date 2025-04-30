// cursor/accelerators/prompt-genetics/prompt-genome-engine.ts

import traitSchema from './prompt-trait-schema.jsonc'

type PromptTraits = Record<string, any>

export function generatePromptVariant(base: PromptTraits, mutations: Partial<PromptTraits>): PromptTraits {
  const variant = { ...base }

  for (const trait in mutations) {
    if (traitSchema.traits.find(t => t.name === trait)) {
      variant[trait] = mutations[trait]
    }
  }

  return variant
}

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
