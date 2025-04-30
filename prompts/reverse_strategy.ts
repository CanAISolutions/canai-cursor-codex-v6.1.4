// 🧠 reverse_strategy.ts
// Generates the final prompt string for the Reverse Strategy Engine product.
// Returns full structured metadata including fallback fields, cost, score, and version.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type StrategyInput = Record<string, any>

export function generateReverseStrategyPrompt(input: StrategyInput, version: string = "v1") {
  const result = composePrompt("reverse_strategy", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "reverse_strategy",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
