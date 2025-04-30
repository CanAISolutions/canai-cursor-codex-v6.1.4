// ✅ test-smartPromptScore-variance.ts
// Ensures SmartPromptScore is stable across small prompt variants

import { scorePromptOutput } from "../lib/smartPromptScore"

const base = `
# Welcome
We're excited to have you. Here's how to get started.
`

const variant = `
# Welcome!
We're super excited to have you. Here’s what’s next:
`

const scoreA = scorePromptOutput(base)
const scoreB = scorePromptOutput(variant)

console.log("Score A:", scoreA.score)
console.log("Score B:", scoreB.score)

const delta = Math.abs(scoreA.score - scoreB.score)

if (delta > 1) {
  throw new Error(`❌ Score drift too high (${delta}) for near-identical outputs.`)
}

console.log("✅ SmartPromptScore consistency verified.\n")
