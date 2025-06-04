/**
 * ai_brand_identity.ts
 * 
 * Purpose:
 * Simple TypeScript interface for AI Brand Identity prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface AIBrandIdentityPrompt {
  companyName: string;
  industry: string;
  targetAudience: string;
  values: string[];
  tone: string;
  enhancers?: Record<string, boolean>;
}

// 🧠 ai_brand_identity.ts
// Generates the final prompt string for the AI Brand Identity Builder product.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

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
