// ✅ test-schema-drifts-against-fieldmap.ts
// Ensures prompt fields match PromptLogs schema

import fs from "fs"
import path from "path"

const schemaPath = path.resolve(__dirname, "../docs/schema/promptlogs-fields.csv")
const promptDir = path.resolve(__dirname, "../gpt-templates")

const schemaFields = fs.readFileSync(schemaPath, "utf-8")
  .split("\n")
  .map(f => f.split(",")[0].trim())
  .filter(f => f)

const promptFiles = fs.readdirSync(promptDir).filter(f => f.endsWith(".prompt"))

let drift = 0

promptFiles.forEach(file => {
  const content = fs.readFileSync(path.join(promptDir, file), "utf-8")
  const matches = content.match(/{{(.*?)}}/g) || []
  const fields = [...new Set(matches.map(m => m.replace(/[{}]/g, "").trim()))]

  const missing = fields.filter(f => !schemaFields.includes(f))
  if (missing.length > 0) {
    console.error(`❌ ${file} uses undefined fields: ${missing.join(", ")}`)
    drift++
  }
})

if (drift > 0) {
  console.error(`❌ ${drift} prompt files have schema drift.\n`)
  process.exit(1)
} else {
  console.log("✅ All prompt fields match schema.\n")
  process.exit(0)
}
