// ✅ test-.github-workflows-valid.ts
// Ensures .github/ci.yml exists and contains required steps

import fs from "fs"
import path from "path"

const ciPath = path.resolve(__dirname, "../.github/workflows/ci.yml")

if (!fs.existsSync(ciPath)) {
  console.error("❌ Missing .github/ci.yml")
  process.exit(1)
}

const content = fs.readFileSync(ciPath, "utf-8")

if (!content.includes("ts-node") || !content.includes("run:")) {
  console.error("❌ ci.yml does not run required test command")
  process.exit(1)
}

console.log("✅ GitHub CI workflow file is present and test-valid.")
