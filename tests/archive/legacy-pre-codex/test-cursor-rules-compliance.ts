// ✅ test-cursor-rules-compliance.ts
// Validates .prompt and .ts files follow .cursorrules style enforcement

import fs from "fs"
import path from "path"

const folders = ["gpt-templates", "prompts", "tools"]
let failures = 0

folders.forEach(folder => {
  const files = fs.readdirSync(path.resolve(__dirname, `../${folder}`))
    .filter(f => f.endsWith(".prompt") || f.endsWith(".ts"))

  files.forEach(file => {
    const content = fs.readFileSync(path.resolve(__dirname, `../${folder}/${file}`), "utf-8")
    if (/TODO|console\.log\(/.test(content)) {
      console.error(`❌ ${file} breaks .cursorrules (TODO or dev log found)`)
      failures++
    }
  })
})

if (failures > 0) {
  process.exit(1)
} else {
  console.log("✅ All files comply with .cursorrules")
}
