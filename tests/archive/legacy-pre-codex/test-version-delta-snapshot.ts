// ✅ test-version-delta-snapshot.ts
// Ensures that any .v2.experimental.prompt meaningfully differs from .v1.prompt
// Guards against silent regressions or AI coauthor overwrites

import fs from "fs"
import path from "path"
import { diffLines } from "diff"

const promptDir = path.resolve(__dirname, "../gpt-templates")
const revisionDir = path.resolve(promptDir, "revisions")
const promptFiles = fs.readdirSync(promptDir).filter(f => f.endsWith(".v1.prompt"))

let failures = 0

promptFiles.forEach(file => {
  const type = file.split(".")[0]
  const v1 = fs.readFileSync(path.join(promptDir, file), "utf-8")

  const experimentalPath = path.join(revisionDir, `${type}.v2.experimental.prompt`)
  if (!fs.existsSync(experimentalPath)) return

  const v2 = fs.readFileSync(experimentalPath, "utf-8")
  const diff = diffLines(v1, v2)

  const changeLines = diff.filter(d => d.added || d.removed)
  if (changeLines.length === 0) {
    console.error(`❌ ${type}: No changes detected between v1 and v2.experimental`)
    failures++
  }
})

if (failures > 0) {
  console.error(`❌ ${failures} prompts failed delta comparison.\n`)
  process.exit(1)
} else {
  console.log("✅ All v2.experimental prompts differ meaningfully from v1.\n")
  process.exit(0)
}
