// 🔁 CanAI PromptType Router
// Routes structured input to the correct promptType and version.
// Supports version control, schema-safe validation, and optional fallback suggestions.

import { composePrompt } from "./composePrompt"

const validPromptTypes = [
  "business_plan",
  "email_campaign",
  "social_content",
  "reverse_strategy",
  "ai_brand_identity",
  "site_audit",
  "ai_blueprint",
  "profile_makeover",
  "blogblitz",
  "ad_amplify"
]

type RouteResult = {
  prompt: string
  promptType: string
  version: string
  fallbackFields: string[]
  missingFields: string[]
}

export function routePrompt(input: Record<string, any>, version = "v1"): RouteResult {
  const type = input.PromptType

  if (!type || !validPromptTypes.includes(type)) {
    throw new Error(`❌ Invalid or unsupported PromptType: "${type}". Check promptTypeRouter.ts for allowed types.`)
  }

  const result = composePrompt(type, input, version)

  return {
    prompt: result.prompt,
    promptType: type,
    version,
    fallbackFields: result.fallbackFields || [],
    missingFields: result.missingFields || [],
  }
}
