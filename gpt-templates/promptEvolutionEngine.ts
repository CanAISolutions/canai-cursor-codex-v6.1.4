// 🧠 CanAI Prompt Evolution Engine
// Compares two prompt versions and generates improvement suggestions based on feedback.
// Use inside Cursor, Make, or CLI for prompt refinement workflows.

import { diffLines } from "diff"

export function comparePrompts(oldVersion: string, newVersion: string): string {
  const diffs = diffLines(oldVersion, newVersion)
  return diffs.map(part => {
    const symbol = part.added ? "+" : part.removed ? "-" : " "
    return symbol + part.value
  }).join("")
}

export function suggestImprovements(prompt: string, feedback: string): string {
  return `### Suggested Improvement Based on Feedback: "${feedback}"\n\n` + prompt
}
