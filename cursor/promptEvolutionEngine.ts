// cursor/promptEvolutionEngine.ts
// Compares prompt versions and optionally suggests an evolved version

import fs from 'fs'
import { diffLines } from 'diff'

/**
 * Compare two prompts and return line-level differences
 */
export function comparePromptVersions(oldPrompt: string, newPrompt: string) {
  return diffLines(oldPrompt, newPrompt).map(part => ({
    added: part.added,
    removed: part.removed,
    value: part.value
  }))
}

/**
 * Placeholder evolution function — replace with GPT call if needed
 */
export function evolvePrompt(current: string, feedback: string): string {
  return `// Revision requested: ${feedback}\n\n${current}`
}

/**
 * Read a file from disk (used in CLI prompt diffing)
 */
export function readPromptFromFile(path: string): string {
  return fs.readFileSync(path, 'utf-8')
}
