// 🧠 ai_brand_identity.ts
// Generates the final prompt string for the AI Brand Identity Blueprint product.
// Returns structured metadata including cost, fallback fields, and output score.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type BrandInput = Record<string, any>

export function generateAIBrandIdentityPrompt(input: BrandInput, version: string = "v1") {
  const result = composePrompt("ai_brand_identity", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "ai_brand_identity",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
