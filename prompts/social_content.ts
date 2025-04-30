// 🧠 social_content.ts
// Generates the final prompt string for the Social Content Pack product.
// Supports enhancer injection, token tracking, SmartPromptScore, and full metadata return.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type SocialInput = Record<string, any>

export function generateSocialContentPrompt(input: SocialInput, version: string = "v1") {
  const result = composePrompt("social_content", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "social_content",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
