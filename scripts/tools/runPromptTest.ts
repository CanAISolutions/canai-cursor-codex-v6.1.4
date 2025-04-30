// 🛠 runPromptTest.ts
// Internal helper for cliTestFlow.sh — runs a promptType with local input JSON

import fs from "fs"
import path from "path"
import { routePrompt } from "../../prompts/promptTypeRouter"
import { estimateTokens } from "../../lib/estimateTokens"
import { scorePromptOutput } from "../../lib/smartPromptScore"

const [type, inputFile, version = "v1"] = process.argv.slice(2)

if (!type || !inputFile) {
  console.error("❌ Usage: ts-node runPromptTest.ts <PromptType> <input.json> [version]")
  process.exit(1)
}

const inputPath = path.resolve(inputFile)
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Input file not found: ${inputPath}`)
  process.exit(1)
}

const input = JSON.parse(fs.readFileSync(inputPath, "utf-8"))
input.PromptType = type

const result = routePrompt(input, version)

const tokenStats = estimateTokens(JSON.stringify(input), result.prompt)
const score = scorePromptOutput(result.prompt)

console.log("\n🧠 Final Prompt Output:\n")
console.log(result.prompt)

console.log("\n📦 Metadata:")
console.log("PromptType:", result.promptType)
console.log("Version:", result.version)
console.log("Missing Fields:", result.missingFields)
console.log("Fallback Fields:", result.fallbackFields)

console.log("\n💰 Tokens Estimated:", tokenStats.total)
console.log("Cost Estimate (USD):", tokenStats.costUSD)

console.log("\n📊 SmartPromptScore:", score.score)
score.reasons.forEach((r, i) => console.log(`  ${i + 1}. ${r}`))
