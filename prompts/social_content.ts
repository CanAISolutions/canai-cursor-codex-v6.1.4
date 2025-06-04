/**
 * social_content.ts
 * 
 * Purpose:
 * Simple TypeScript interface for Social Content prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface SocialContentPrompt {
  platform: string;
  contentType: string;
  targetAudience: string[];
  keyMessage: string;
  tone: string;
  enhancers?: Record<string, boolean>;
}

// 🧠 social_content.ts
// Generates the final prompt string for the Social Content Builder product.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

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
