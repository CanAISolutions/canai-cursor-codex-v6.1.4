// 💰 calculateGPTTokenCost.ts
// CLI + exportable utility to estimate GPT token usage and cost for a file
// Assumes average 4 characters per token (OpenAI heuristic)
// Run with: ts-node calculateGPTTokenCost.ts ./path/to/file.txt

import fs from "fs"
import path from "path"

type TokenEstimate = {
  file: string
  model: string
  costPer1k: number
  tokens: number
  costUSD: number
}

export function estimateTokensFromText(text: string, model = "gpt-4o", costPer1k = 0.01): TokenEstimate {
  const charCount = text.replace(/\s+/g, " ").trim().length
  const tokens = Math.round(charCount / 4)
  const costUSD = parseFloat(((tokens / 1000) * costPer1k).toFixed(6))

  return {
    file: "N/A",
    model,
    costPer1k,
    tokens,
    costUSD
  }
}

// CLI support
if (require.main === module) {
  const filePath = process.argv[2]
  const model = process.argv[3] || "gpt-4o"
  const costPer1k = parseFloat(process.argv[4]) || 0.01

  if (!filePath || !fs.existsSync(filePath)) {
    console.error("❌ Usage: ts-node calculateGPTTokenCost.ts <filePath> [model] [costPer1k]")
    process.exit(1)
  }

  const input = fs.readFileSync(filePath, "utf-8")
  const result = estimateTokensFromText(input, model, costPer1k)
  result.file = path.basename(filePath)

  console.log(`📄 File: ${result.file}`)
  console.log(`🤖 Model: ${result.model}`)
  console.log(`🧮 Estimated Tokens: ${result.tokens}`)
  console.log(`💸 Estimated Cost: $${result.costUSD}`)
}
