// 🧠 business_plan.ts
// Generates the final prompt string for the Business Plan Builder product.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type BusinessInput = Record<string, any>

export function generateBusinessPlanPrompt(input: BusinessInput, version: string = "v1") {
  const result = composePrompt("business_plan", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "business_plan",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
