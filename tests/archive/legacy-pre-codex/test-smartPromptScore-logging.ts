// ✅ test-smartPromptScore-logging.ts
// Confirms SmartPromptScore is returned and contains full reasoning

import { scorePromptOutput } from "../lib/smartPromptScore"

const prompt = `
# Welcome
We're glad you're here. Let's get started with your AI journey.
`

const result = scorePromptOutput(prompt)

if (result.score < 1 || result.score > 6) {
  throw new Error(`❌ Invalid score range: ${result.score}`)
}

if (!Array.isArray(result.reasons) || result.reasons.length === 0) {
  throw new Error("❌ Missing score reasoning array")
}

console.log("✅ SmartPromptScore logging validated.")
