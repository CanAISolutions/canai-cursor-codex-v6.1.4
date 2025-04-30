// ✅ test-generatePromptDocs.ts
// Confirms the docs generator parses and creates a markdown output

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const outputDir = path.resolve(__dirname, "../docs/prompts")

execSync("ts-node tools/generatePromptDocs.ts")

const files = fs.readdirSync(outputDir)
if (files.length === 0) {
  throw new Error("❌ No docs were generated")
}

console.log(`✅ ${files.length} prompt doc(s) generated.`)
