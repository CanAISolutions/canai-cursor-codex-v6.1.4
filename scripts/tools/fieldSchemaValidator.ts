// 🧪 fieldSchemaValidator.ts
// Checks if each .prompt file only uses fields that exist in PromptLogs schema

import fs from "fs"
import path from "path"

const promptDir = path.resolve(__dirname, "../gpt-templates")
const schemaPath = path.resolve(__dirname, "../docs/schema/promptlogs-fields.csv") // or .json

function extractFieldsFromPrompt(template: string): string[] {
  const matches = template.match(/{{(.*?)}}/g) || []
  return [...new Set(matches.map(m => m.replace(/[{}]/g, "").trim()))]
}

function getSchemaFields(): string[] {
  const raw = fs.readFileSync(schemaPath, "utf-8")
  return raw
    .split("\n")
    .map(line => line.split(",")[0].trim()) // first column = field name
    .filter(f => f !== "" && !f.startsWith("#"))
}

function run() {
  const schemaFields = getSchemaFields()
  const promptFiles = fs.readdirSync(promptDir).filter(f => f.endsWith(".prompt"))

  console.log("📋 Validating prompt field usage...\n")

  promptFiles.forEach(file => {
    const content = fs.readFileSync(path.join(promptDir, file), "utf-8")
    const usedFields = extractFieldsFromPrompt(content)

    const missing = usedFields.filter(f => !schemaFields.includes(f))

    if (missing.length > 0) {
      console.log(`❌ ${file} uses undefined fields: ${missing.join(", ")}`)
    } else {
      console.log(`✅ ${file} is schema-aligned`)
    }
  })
}

run()
