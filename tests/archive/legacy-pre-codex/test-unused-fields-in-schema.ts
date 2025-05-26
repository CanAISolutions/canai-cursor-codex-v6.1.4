// ✅ test-unused-fields-in-schema.ts
// Audits PromptLogs schema for unused/bloated fields

import fs from "fs"
import path from "path"

const schemaPath = path.resolve(__dirname, "../docs/schema/promptlogs-fields.csv")
const promptsPath = path.resolve(__dirname, "../gpt-templates")
const usedFields = new Set<string>()

fs.readdirSync(promptsPath).forEach(file => {
  const content = fs.readFileSync(path.join(promptsPath, file), "utf-8")
  const matches = content.match(/{{(.*?)}}/g) || []
  matches.forEach(m => usedFields.add(m.replace(/[{}]/g, "").trim()))
})

const schemaFields = fs.readFileSync(schemaPath, "utf-8")
  .split("\n")
  .map(l => l.split(",")[0].trim())
  .filter(Boolean)

const bloat = schemaFields.filter(f => !usedFields.has(f))

if (bloat.length > 0) {
  console.error("❌ Unreferenced fields in PromptLogs:", bloat.join(", "))
  process.exit(1)
} else {
  console.log("✅ All schema fields are referenced in prompts or flows.")
}
