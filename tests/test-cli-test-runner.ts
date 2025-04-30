// ✅ test-cli-test-runner.ts
// Executes CLI runner across all prompt inputs and checks for runtime success

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const testDir = path.resolve(__dirname, "../testcases")
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))

let failures = 0

testFiles.forEach(file => {
  const type = file.split(".")[0]
  const inputPath = path.join(testDir, file)
  try {
    execSync(`ts-node scripts/tools/runPromptTest.ts ${type} ${inputPath}`, { stdio: "pipe" })
    console.log(`✅ CLI test passed for ${type}`)
  } catch {
    console.error(`❌ CLI test failed for ${type}`)
    failures++
  }
})

if (failures > 0) {
  console.error(`❌ ${failures} CLI test failure(s)\n`)
  process.exit(1)
} else {
  console.log("✅ All CLI test runners passed.\n")
  process.exit(0)
}
