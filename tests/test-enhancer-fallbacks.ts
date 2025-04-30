// ✅ test-enhancer-fallbacks.ts
// Ensures enhancer fields like tone, customerPain, etc. are injected if missing

import { composePrompt } from "../prompts/composePrompt"

const input = {
  bizName: "Elevate Fitness",
  PromptType: "email_campaign",
  tone: "", // missing on purpose
  customerPain: "" // missing on purpose
}

const result = composePrompt("email_campaign", input)

console.log("🧪 Enhancer Fallback Fields:", result.fallbackFields)

if (!result.fallbackFields.includes("tone")) {
  throw new Error("❌ 'tone' fallback not triggered")
}

if (!result.fallbackFields.includes("customerPain")) {
  throw new Error("❌ 'customerPain' fallback not triggered")
}

console.log("✅ Enhancer fallback test passed.\n")
