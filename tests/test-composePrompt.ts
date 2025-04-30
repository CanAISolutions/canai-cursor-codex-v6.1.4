// 🧪 test-composePrompt.ts
// Validates fallback, missing field logic, and injection in composePrompt

import { composePrompt } from "../prompts/composePrompt"

const mockInput = {
  bizName: "TestCo",
  industry: "E-commerce",
  goal: "Launch a new AI sales assistant",
  PromptType: "business_plan",
  tone: "" // missing on purpose
}

const { prompt, fallbackFields, missingFields } = composePrompt("business_plan", mockInput, "v1")

console.log("\n🧠 COMPOSED PROMPT:\n", prompt)
console.log("✅ Fallback fields:", fallbackFields)
console.log("❌ Missing fields:", missingFields)

if (!fallbackFields.includes("tone")) {
  throw new Error("❌ Tone fallback not injected")
}

if (missingFields.includes("goal")) {
  throw new Error("❌ Goal was present but marked as missing")
}

console.log("✅ composePrompt test passed\n")
