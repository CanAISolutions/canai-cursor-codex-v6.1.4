// 🚀 promotePromptVersion.ts
// Promotes an experimental .prompt file to live and archives the old version
// Usage: ts-node promotePromptVersion.ts <PromptType> <newVersion>

import fs from "fs"
import path from "path"

const [promptType, newVersion] = process.argv.slice(2)

if (!promptType || !newVersion) {
  console.error("❌ Usage: ts-node promotePromptVersion.ts <PromptType> <newVersion>")
  process.exit(1)
}

const experimentalPath = path.resolve(__dirname, `../gpt-templates/revisions/${promptType}.${newVersion}.experimental.prompt`)
const livePath = path.resolve(__dirname, `../gpt-templates/${promptType}.v1.prompt`)
const archiveDir = path.resolve(__dirname, "../prompt-versions")

if (!fs.existsSync(experimentalPath)) {
  console.error(`❌ Experimental prompt not found: ${experimentalPath}`)
  process.exit(1)
}

// Read the new content
const newPrompt = fs.readFileSync(experimentalPath, "utf-8")

// Archive the current v1
if (fs.existsSync(livePath)) {
  const currentPrompt = fs.readFileSync(livePath, "utf-8")
  const archivePath = path.join(archiveDir, `${promptType}.v1.prompt`)
  fs.writeFileSync(archivePath, currentPrompt)
  console.log(`📦 Archived current v1 → ${archivePath}`)
}

// Promote the experimental version
fs.writeFileSync(livePath, newPrompt)
console.log(`✅ Promoted ${promptType}.${newVersion}.experimental.prompt → ${promptType}.v1.prompt`)

// Optionally log promotion
const logPath = path.resolve(__dirname, `../prompt-versions/promotion-log.txt`)
fs.appendFileSync(
  logPath,
  `[${new Date().toISOString()}] PROMOTED: ${promptType}.${newVersion} → live\n`
)
console.log(`📝 Promotion logged in prompt-versions/promotion-log.txt`)
