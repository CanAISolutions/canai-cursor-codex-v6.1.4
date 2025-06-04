/**
 * ai_blueprint.ts
 * 
 * Purpose:
 * Simple TypeScript interface for AI Blueprint prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface AIBlueprintPrompt {
  industry: string;
  targetAudience: string;
  goals: string[];
  constraints: string[];
  tone: string;
  enhancers?: Record<string, boolean>;
}

// 🧠 ai_blueprint.ts
// Generates the final prompt string for the AI Blueprint Builder product.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type AIInput = Record<string, any>

export function generateAIBlueprintPrompt(input: AIInput, version: string = "v1") {
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
