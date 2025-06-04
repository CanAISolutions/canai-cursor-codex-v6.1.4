/**
 * sparksplit.ts
 * 
 * Purpose:
 * Simple TypeScript interface for SparkSplit prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface SparkSplitPrompt {
  deliveredProduct: string;
  userSatisfaction: string;
  trustContext: string;
  productType?: string;
  deliveryQuality?: string;
  emotionalResonance?: string;
  competitiveContext?: string;
  trustScore?: number;
  qualityIndicators?: string[];
  emotionalIntelligenceMarkers?: string[];
  transparencyFactors?: string[];
  competitiveDifferentiators?: string[];
  viralPotential?: string;
  sparkRevelationMoments?: string[];
  trustEvolution?: {
    initialLevel?: string;
    postDeliveryLevel?: string;
    growthPoints?: number;
  };
  emotionalContext?: {
    personalStory?: string;
    visionQuote?: string;
    motivator?: string;
    brandFeel?: string;
    emotions?: string[];
  };
  enhancers?: {
    emotionalDepth?: boolean;
    useAnalogies?: boolean;
    urgency?: boolean;
    trustTransparency?: boolean;
    competitiveAnalysis?: boolean;
  };
}

// 🧠 sparksplit.ts
// Generates the final prompt string for the SparkSplit Trust Engine.
// Returns full structured metadata including version, cost, quality score, and fallback tracking.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type SparkSplitInput = Record<string, any>

export function generateSparkSplitPrompt(input: SparkSplitInput, version: string = "v1") {
  const result = composePrompt("sparksplit", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "sparksplit",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
} 