// 🧠 email_campaign.ts
// Generates the final prompt string for the Email Campaign Builder product.
// Returns full structured metadata including version, fallback fields, cost, and SmartPromptScore.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type EmailInput = Record<string, any>

export function generateEmailCampaignPrompt(input: EmailInput, version: string = "v1") {
  const result = composePrompt("email_campaign", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "email_campaign",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
