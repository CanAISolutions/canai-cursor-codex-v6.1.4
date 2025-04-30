// 🔁 CanAI Prompt Diff Tool
// Used for comparing .prompt version files in /gpt-templates/
// Usage: ts-node promptDeltaLog.ts ./old.prompt ./new.prompt

import fs from "fs"
import { diffLines } from "diff"

const [fileA, fileB] = process.argv.slice(2)

if (!fileA || !fileB) {
  console.error("Usage: ts-node promptDeltaLog.ts <oldFile> <newFile>")
  process.exit(1)
}

const promptA = fs.readFileSync(fileA, "utf-8")
const promptB = fs.readFileSync(fileB, "utf-8")

const diff = diffLines(promptA, promptB)

diff.forEach(part => {
  const symbol = part.added ? "+" : part.removed ? "-" : " "
  process.stdout.write(symbol + part.value)
})
