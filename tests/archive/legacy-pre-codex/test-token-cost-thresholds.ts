// ✅ test-token-cost-thresholds.ts
// Ensures that no prompt exceeds a maximum cost-per-output threshold

import fs from "fs"
import path from "path"
import { routePrompt } from "../prompts/promptTypeRouter"
import { estimateTokens } from "../lib/estimateTokens"

const MAX_COST = 0.015
const testDir = path.resolve(__dirname, "../testcases")
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))

let failures = 0

console.log("\n💰 Token Cost Threshold Test\n")

for (const file of testFiles) {
  const inputPath = path.join(testDir, file)
  const input = JSON.parse(fs.readFileSync(inputPath, "utf-8"))

  try {
    const result = routePrompt(input)
    const cost = estimateTokens(JSON.stringify(input), result.prompt).costUSD

    console.log(`🔹 ${file}: $${cost}`)

    if (cost > MAX_COST) {
      console.error(`❌ Cost $${cost} exceeds limit of $${MAX_COST}`)
      failures++
    }
  } catch (err: any) {
    console.error(`❌ Error in ${file}: ${err.message}`)
    failures++
  }
}

if (failures > 0) {
  console.error(`\n❌ ${failures} prompt(s) exceeded the cost threshold.\n`)
  process.exit(1)
} else {
  console.log("✅ All prompts within cost limits.\n")
  process.exit(0)
}
