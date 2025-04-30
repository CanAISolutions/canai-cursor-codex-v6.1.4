// 🧠 CanAI Self-Refine Score Engine
// Provides a heuristic quality score for any GPT-generated output.
// Used to evaluate clarity, structure, and markdown readability across sessions.

export function scoreOutput(output: string): number {
  let score = 0
  const length = output.split(" ").length
  const hasMarkdown = /[#*-]/.test(output)
  const sections = output.match(/### /g) || []

  if (length > 100) score += 1
  if (hasMarkdown) score += 1
  if (sections.length >= 3) score += 1

  return score // out of 3
}
