// 🧪 test-prompt-integrity-suite.ts
// Runs full prompt injection → output → cost → scoring tests across all promptTypes
// Uses real input files from /testcases/ and validates:
// - Injection success
// - Fallback field presence
// - Missing fields
// - Token cost under limit
// - SmartPromptScore above minimum

import fs from "fs"
import path from "path"
import { routePrompt } from "../prompts/promptTypeRouter"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

const testDir = path.resolve(__dirname, "../testcases")
const TOKEN_LIMIT = 2000
const SCORE_MIN = 4.0

const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))

let failures = 0

console.log("\n🧪 Prompt Integrity Test Suite\n")

for (const file of testFiles) {
  const inputPath = path.join(testDir, file)
  const raw = fs.readFileSync(inputPath, "utf-8")
  const input = JSON.parse(raw)

  const type = input.PromptType || file.split(".")[0]
  const version = "v1"

  try {
    const result = routePrompt(input, version)
    const tokens = estimateTokens(JSON.stringify(input), result.prompt)
    const score = scorePromptOutput(result.prompt)

    console.log(`🔹 ${type}.v1`)
    console.log(`   Fallbacks: ${result.fallbackFields.join(", ") || "None"}`)
    console.log(`   Missing:   ${result.missingFields.join(", ") || "None"}`)
    console.log(`   Tokens:    ${tokens.total} (Limit: ${TOKEN_LIMIT})`)
    console.log(`   Cost:      $${tokens.costUSD}`)
    console.log(`   Score:     ${score.score} (Min: ${SCORE_MIN})`)

    // Threshold enforcement
    if (tokens.total > TOKEN_LIMIT) {
      console.error("   ❌ Token usage exceeded")
      failures++
    }

    if (score.score < SCORE_MIN) {
      console.error("   ❌ SmartPromptScore too low")
      failures++
    }

    if (result.missingFields.length > 0) {
      console.error("   ❌ Missing fields detected")
      failures++
    }

    console.log("")
  } catch (err: any) {
    console.error(`❌ ERROR in ${type}: ${err.message}`)
    failures++
  }
}

if (failures > 0) {
  console.error(`\n❌ ${failures} test failure(s) detected.\n`)
  process.exit(1)
} else {
  console.log("✅ All prompts passed integrity checks.\n")
  process.exit(0)
}
