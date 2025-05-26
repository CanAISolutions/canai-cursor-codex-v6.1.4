// ✅ test-fallback-trigger.ts
// Confirms enhancer fallback triggers when primary field is missing

import { composePrompt } from "../prompts/composePrompt"

const input = {
  PromptType: "business_plan",
  bizName: "TestCo",
  tone: "" // intentionally blank
}

const result = composePrompt("business_plan", input)

if (!result.fallbackFields.includes("tone")) {
  throw new Error("❌ Fallback for 'tone' not detected")
}

console.log("✅ Fallback field triggered as expected.")
