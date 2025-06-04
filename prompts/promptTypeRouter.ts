// 🔁 CanAI PromptType Router
// Routes structured session input to the correct product prompt.
// Validates PromptType, supports version switching, and returns full prompt metadata for scoring and cost tracking.

import { composePrompt } from "./composePrompt"

export type PromptType = 
  | "ai_blueprint"
  | "business_plan"
  | "email_campaign"
  | "site_audit"
  | "social_content"
  | "reverse_strategy"
  | "ai_brand_identity"
  | "profile_makeover"
  | "blogblitz"
  | "ad_amplify"
  | "sparksplit";

const validPromptTypes = [
  "ai_blueprint",
  "ai_brand_identity",
  "business_plan",
  "email_campaign",
  "reverse_strategy",
  "site_audit",
  "social_content",
  "profile_makeover",
  "blogblitz",
  "ad_amplify",
  "sparksplit"
]

type PromptInput = Record<string, any>

type RoutePromptResult = {
  prompt: string
  promptType: string
  version: string
  fallbackFields: string[]
  missingFields: string[]
}

export function routePrompt(input: PromptInput, version: string = "v1"): RoutePromptResult {
  const promptType = input.PromptType

  if (!promptType || !validPromptTypes.includes(promptType)) {
    throw new Error(`❌ Invalid or unsupported PromptType: "${promptType}". Check promptTypeRouter.ts.`)
  }

  const result = composePrompt(promptType, input, version)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType,
    version
  }
}
