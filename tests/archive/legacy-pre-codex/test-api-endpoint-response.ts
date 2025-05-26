// ✅ test-api-endpoint-response.ts
// Confirms each local API file exports a valid handler and doesn’t crash

import fs from "fs"
import path from "path"

const apiDir = path.resolve(__dirname, "../api")
const files = fs.readdirSync(apiDir).filter(f => f.endsWith(".ts"))

let failures = 0

files.forEach(file => {
  try {
    const mod = require(path.join(apiDir, file))
    if (typeof mod !== "function" && typeof mod.default !== "function") {
      throw new Error("Missing export default or function")
    }
    console.log(`✅ ${file} exports a valid handler`)
  } catch (err: any) {
    console.error(`❌ ${file}: ${err.message}`)
    failures++
  }
})

if (failures > 0) process.exit(1)
