// 🔍 promptDeltaCompare.ts
// CLI utility to compare two .prompt files and print a line-by-line diff
// Usage: ts-node promptDeltaCompare.ts ./v1.prompt ./v2.prompt

import fs from "fs"
import path from "path"
import { diffLines } from "diff"

const [fileAPath, fileBPath] = process.argv.slice(2)

if (!fileAPath || !fileBPath) {
  console.error("❌ Usage: ts-node promptDeltaCompare.ts <oldFile> <newFile>")
  process.exit(1)
}

const resolveAndRead = (filePath: string): string => {
  const fullPath = path.resolve(filePath)
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`)
    process.exit(1)
  }
  return fs.readFileSync(fullPath, "utf-8")
}

const promptA = resolveAndRead(fileAPath)
const promptB = resolveAndRead(fileBPath)

const diff = diffLines(promptA, promptB)

console.log(`\n🔍 Comparing "${path.basename(fileAPath)}" ↔ "${path.basename(fileBPath)}"\n`)

diff.forEach(part => {
  const symbol = part.added ? "+" : part.removed ? "-" : " "
  const color = part.added
    ? "\x1b[32m"   // green
    : part.removed
    ? "\x1b[31m"   // red
    : "\x1b[0m"    // default

  process.stdout.write(color + symbol + part.value + "\x1b[0m")
})

console.log("\n✅ Prompt comparison complete.\n")
