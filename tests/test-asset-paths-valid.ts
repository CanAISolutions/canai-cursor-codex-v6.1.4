// ✅ test-asset-paths-valid.ts
// Confirms all critical branding + visual asset files exist

import fs from "fs"
import path from "path"

const required = [
  "canai-logo.svg",
  "canai-logo.png",
  "brand-guide.pdf",
  "favicon.ico",
  "colors.json",
  "variables.css"
]

const dir = path.resolve(__dirname, "../brand")

required.forEach(asset => {
  const full = path.join(dir, asset)
  if (!fs.existsSync(full)) {
    console.error(`❌ Missing asset: ${asset}`)
    process.exit(1)
  }
})

console.log("✅ All required brand assets found.")
