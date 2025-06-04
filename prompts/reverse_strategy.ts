/**
 * reverse_strategy.ts
 * 
 * Purpose:
 * Simple TypeScript interface for Reverse Strategy prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface ReverseStrategyPrompt {
  targetOutcome: string;
  currentState: string;
  constraints: string[];
  timeline: string;
  tone: string;
  enhancers?: Record<string, boolean>;
}

// 🧠 reverse_strategy.ts
// Generates the final prompt string for the Reverse Strategy Builder product.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type ReverseInput = Record<string, any>

export function generateReverseStrategyPrompt(input: ReverseInput, version: string = "v1") {
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
