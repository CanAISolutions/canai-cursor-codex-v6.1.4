/**
 * dreamstate-utils.ts
 * 
 * Purpose: Quantifies emotional resonance and dream-state alignment of any system-generated text.
 * Used during audits, revisions, and emotional health tracking.
 */

export interface EmotionScoreReport {
    score: number;              // 0–100
    toneTags: string[];         // ["inspiring", "clear", "supportive"]
    risks: string[];            // ["flat", "cold", "verbose"]
    notes: string[];            // Interpretive feedback
  }
  
  export function calculateEmotionalResonanceScore(text: string): EmotionScoreReport {
    const lower = text.toLowerCase();
  
    const positive = ["clear", "supportive", "empowering", "elegant", "focused"];
    const negative = ["confusing", "rambling", "flat", "verbose", "cold"];
  
    const score =
      70 +
      (positive.filter(tag => lower.includes(tag)).length * 4) -
      (negative.filter(tag => lower.includes(tag)).length * 5);
  
    const toneTags = positive.filter(tag => lower.includes(tag));
    const risks = negative.filter(tag => lower.includes(tag));
  
    const notes: string[] = [];
  
    if (score < 75) notes.push("Tone may feel generic or unclear.");
    if (risks.includes("flat")) notes.push("Consider adding emotional texture.");
    if (toneTags.length >= 3) notes.push("Strong emotional resonance detected.");
  
    return {
      score: Math.max(0, Math.min(100, score)),
      toneTags,
      risks,
      notes,
    };
  }
  