// 📊 CanAI Smart Prompt Score Engine
// Fully future-proofed scoring system for GPT output clarity, structure, tone match, and emotional intent.
// Outputs a structured object for logging, dashboards, Make scoring, and evolution workflows.

export type PromptScore = {
    score: number
    max: number
    reasons: string[]
    detail: {
      lengthOk: boolean
      hasMarkdown: boolean
      sectionCount: number
      hasCTA: boolean
      toneMatch: boolean
      evokesConfidence: boolean
    }
  }
  
  export function scorePromptOutput(
    output: string,
    expectedTone: string = "confident and friendly"
  ): PromptScore {
    const reasons: string[] = []
    let score = 0
    const maxScore = 6
  
    const wordCount = output.split(" ").length
    const hasMarkdown = /[#*-]/.test(output)
    const sectionCount = (output.match(/### /g) || []).length
    const hasCTA = /(call to action|get started|next step|try it|book|contact)/i.test(output)
    const toneMatch = new RegExp(expectedTone, "i").test(output)
    const evokesConfidence = /(clear|easy|trusted|you can|feel confident)/i.test(output)
  
    // Length
    if (wordCount > 100) {
      score++
      reasons.push("✅ Sufficient length for clarity and context")
    } else {
      reasons.push("⚠️ May be too short — check for missing explanation")
    }
  
    // Markdown formatting
    if (hasMarkdown) {
      score++
      reasons.push("✅ Markdown structure detected")
    } else {
      reasons.push("⚠️ Missing markdown formatting")
    }
  
    // Section count
    if (sectionCount >= 3) {
      score++
      reasons.push("✅ Good visual structure (3+ sections)")
    } else {
      reasons.push("⚠️ Lacks visual structure or hierarchy")
    }
  
    // CTA presence
    if (hasCTA) {
      score++
      reasons.push("✅ Includes clear call to action or next step")
    } else {
      reasons.push("⚠️ No clear CTA — may cause user dropoff")
    }
  
    // Tone match
    if (toneMatch) {
      score++
      reasons.push("✅ Matches expected tone: " + expectedTone)
    } else {
      reasons.push("⚠️ Tone mismatch — expected: " + expectedTone)
    }
  
    // Emotional impact
    if (evokesConfidence) {
      score++
      reasons.push("✅ Evokes confidence and forward motion")
    } else {
      reasons.push("⚠️ Lacks emotional energy — may feel passive or generic")
    }
  
    return {
      score,
      max: maxScore,
      reasons,
      detail: {
        lengthOk: wordCount > 100,
        hasMarkdown,
        sectionCount,
        hasCTA,
        toneMatch,
        evokesConfidence,
      },
    }
  }
  