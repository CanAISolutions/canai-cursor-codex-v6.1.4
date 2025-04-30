// 🧠 ai_blueprint.ts
// Generates the final prompt string for the AI Blueprint builder product.
// Returns full structured metadata including fallback fields, token estimate, and quality score.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type BlueprintInput = Record<string, any>

export function generateAIBlueprintPrompt(input: BlueprintInput, version: string = "v1") {
  const result = composePrompt("ai_blueprint", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "ai_blueprint",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
