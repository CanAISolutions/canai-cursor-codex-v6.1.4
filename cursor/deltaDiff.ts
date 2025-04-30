// cursor/deltaDiff.ts
// CLI tool to compare two versions of a text file (for prompt or output diffs)

import fs from 'fs'
import { diffLines } from 'diff'

const [pathA, pathB] = process.argv.slice(2)

if (!pathA || !pathB) {
  console.error('Usage: node deltaDiff.ts <file1> <file2>')
  process.exit(1)
}

const fileA = fs.readFileSync(pathA, 'utf-8')
const fileB = fs.readFileSync(pathB, 'utf-8')

const diff = diffLines(fileA, fileB)
diff.forEach(part => {
  const prefix = part.added ? '+' : part.removed ? '-' : ' '
  process.stdout.write(prefix + part.value)
})
