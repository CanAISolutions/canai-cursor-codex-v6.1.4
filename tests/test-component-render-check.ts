// ✅ test-component-render-check.ts
// Ensures all /components/ modules export and compile without breaking render

import fs from "fs"
import path from "path"

const componentDir = path.resolve(__dirname, "../components")
const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith(".ts"))

let failures = 0

componentFiles.forEach(file => {
  const fullPath = path.join(componentDir, file)
  try {
    const mod = require(fullPath)
    const output = typeof mod === "function" ? mod() : mod.default?.()

    if (!output || typeof output !== "string") {
      console.error(`❌ ${file}: Component did not render valid string`)
      failures++
    }
  } catch (err: any) {
    console.error(`❌ ${file}: Failed to import or render → ${err.message}`)
    failures++
  }
})

if (failures > 0) {
  console.error(`❌ ${failures} component(s) failed render check\n`)
  process.exit(1)
} else {
  console.log("✅ All components rendered successfully.\n")
  process.exit(0)
}
