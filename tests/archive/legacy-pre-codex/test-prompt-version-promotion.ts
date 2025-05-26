// ✅ test-prompt-version-promotion.ts
// Tests that a prompt promotion archives, overwrites, and logs correctly

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const promptType = "business_plan"
const newVersion = "v2"
const experimentalPath = path.resolve(__dirname, `../gpt-templates/revisions/${promptType}.${newVersion}.experimental.prompt`)
const archivePath = path.resolve(__dirname, `../prompt-versions/${promptType}.v1.prompt`)
const livePath = path.resolve(__dirname, `../gpt-templates/${promptType}.v1.prompt`)
const logPath = path.resolve(__dirname, "../prompt-versions/promotion-log.txt")

fs.writeFileSync(experimentalPath, "# PROMPT VERSION V2 TEST")

execSync(`ts-node tools/promotePromptVersion.ts ${promptType} ${newVersion}`)

const archiveExists = fs.existsSync(archivePath)
const liveUpdated = fs.readFileSync(livePath, "utf-8").includes("V2")
const logUpdated = fs.readFileSync(logPath, "utf-8").includes(`${promptType}.${newVersion}`)

if (!archiveExists || !liveUpdated || !logUpdated) {
  throw new Error("❌ Promotion process failed to archive, update, or log correctly")
}

console.log("✅ Prompt promotion workflow verified.\n")
