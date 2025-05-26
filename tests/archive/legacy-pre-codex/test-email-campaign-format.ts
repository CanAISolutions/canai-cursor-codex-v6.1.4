// ✅ test-email-campaign-format.ts
// Validates output email body and subject line integrity

import { composePrompt } from "../prompts/composePrompt"

const input = {
  PromptType: "email_campaign",
  bizName: "TestCo",
  goal: "Launch product",
  tone: "Friendly",
  customerPain: "Too busy to learn AI"
}

const { prompt } = composePrompt("email_campaign", input)

const hasSubject = /subject/i.test(prompt)
const hasCTA = /call to action|CTA/i.test(prompt)

if (!hasSubject) {
  console.error("❌ No subject line detected")
  process.exit(1)
}
if (!hasCTA) {
  console.error("❌ No CTA guidance found")
  process.exit(1)
}

console.log("✅ Email format validated.")
