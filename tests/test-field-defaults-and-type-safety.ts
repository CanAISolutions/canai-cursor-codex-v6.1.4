// ✅ test-field-defaults-and-type-safety.ts
// Validates that each test input has a string-safe value and no unexpected types

import fs from "fs"
import path from "path"

const testDir = path.resolve(__dirname, "../testcases")
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith(".json"))

let failures = 0

testFiles.forEach(file => {
  const input = JSON.parse(fs.readFileSync(path.join(testDir, file), "utf-8"))
  const keys = Object.keys(input)

  keys.forEach(key => {
    const value = input[key]
    if (typeof value !== "string") {
      console.error(`❌ ${file}: Field "${key}" is not a string`)
      failures++
    }

    if (typeof value === "string" && value.trim().length < 3) {
      console.error(`❌ ${file}: Field "${key}" may have an incomplete or default-only value`)
      failures++
    }
  })
})

if (failures > 0) {
  console.error(`❌ ${failures} field default/type safety issue(s)\n`)
  process.exit(1)
} else {
  console.log("✅ All test inputs passed type + default validation.\n")
  process.exit(0)
}
