// ✅ test-generatePromptTestCases.ts
// Confirms test cases are created for each .prompt file

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const promptDir = path.resolve(__dirname, "../gpt-templates")
const testDir = path.resolve(__dirname, "../testcases")

execSync("ts-node tools/generatePromptTestCases.ts")

const prompts = fs.readdirSync(promptDir).filter(f => f.endsWith(".prompt"))
const tests = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))

const missing = prompts
  .map(p => p.split(".")[0])
  .filter(base => !tests.includes(`${base}.v1.input.json`))

if (missing.length > 0) {
  throw new Error(`❌ Missing testcases for: ${missing.join(", ")}`)
}

console.log("✅ All prompt files have matching test input.")
