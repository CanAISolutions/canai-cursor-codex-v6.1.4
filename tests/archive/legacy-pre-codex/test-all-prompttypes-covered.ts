// ✅ test-all-prompttypes-covered.ts
// Ensures all prompt types are represented in: router, gpt-templates, testcases

import fs from "fs"
import path from "path"
import { routePrompt } from "../prompts/promptTypeRouter"

const promptDir = path.resolve(__dirname, "../gpt-templates")
const testDir = path.resolve(__dirname, "../testcases")
const routerFile = path.resolve(__dirname, "../prompts/promptTypeRouter.ts")

const promptFiles = fs.readdirSync(promptDir).filter(f => f.endsWith(".prompt"))
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))
const routerCode = fs.readFileSync(routerFile, "utf-8")

const promptTypes = promptFiles.map(f => f.split(".")[0])
const testTypes = testFiles.map(f => f.split(".")[0])

let failures = 0

promptTypes.forEach(type => {
  if (!testTypes.includes(type)) {
    console.error(`❌ Missing test input for: ${type}`)
    failures++
  }

  if (!routerCode.includes(`"${type}"`)) {
    console.error(`❌ Missing router entry for: ${type}`)
    failures++
  }
})

if (failures > 0) {
  console.error(`❌ ${failures} type coverage gaps detected.`)
  process.exit(1)
} else {
  console.log("✅ All prompt types have full routing + test coverage.\n")
  process.exit(0)
}
