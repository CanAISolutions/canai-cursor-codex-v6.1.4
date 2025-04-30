// ✅ test-make-field-map-completeness.ts
// Validates field usage integrity across Make scenarios and prompts

import fs from "fs"
import path from "path"

const schemaFields = fs.readFileSync(path.resolve(__dirname, "../docs/schema/promptlogs-fields.csv"), "utf-8")
  .split("\n")
  .map(l => l.split(",")[0].trim())
  .filter(Boolean)

const makeScenarios = fs.readFileSync(path.resolve(__dirname, "../automations/make-field-usage-map.json"), "utf-8")
const usedFields = [...new Set(JSON.parse(makeScenarios).flat())]

const unused = schemaFields.filter(f => !usedFields.includes(f))

if (unused.length > 0) {
  console.error("❌ Unused fields in PromptLogs schema:", unused.join(", "))
  process.exit(1)
} else {
  console.log("✅ All PromptLogs schema fields are used by Make automations or prompts.")
}
