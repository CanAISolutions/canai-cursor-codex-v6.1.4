// cursor/selfRefineScore.ts
// Optional scoring engine for output quality, tone, and usability

/**
 * Score a prompt output based on basic quality heuristics
 */
export function scoreOutput(content: string): number {
    const length = content.split(" ").length
    const hasMarkdown = content.includes("#") || content.includes("**")
    const hasStructure = content.includes("##") || content.includes("###")
  
    let score = 0
  
    if (length > 100) score += 1
    if (hasMarkdown) score += 1
    if (hasStructure) score += 1
  
    return score // out of 3
  }
  