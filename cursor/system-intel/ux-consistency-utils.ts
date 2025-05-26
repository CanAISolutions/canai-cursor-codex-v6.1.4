// /cursor/system-intel/ux-consistency-utils.ts

/**
 * UX Consistency Scorer
 * ---------------------
 * Evaluates output formatting and tonal consistency across CanAI prompt types.
 * Ensures every user-facing message feels coherent, emotionally aligned, and properly structured.
 *
 * Used in: audit reports, emotional health checks, self-healing loops.
 * Outputs: 0.0–1.0 score based on rules below.
 */

export function checkUXConsistency(output: string): number {
    let score = 1.0;
    const issues: string[] = [];
  
    // Heading structure check
    const headingLines = output.split('\n').filter(l => l.startsWith('#'));
    if (headingLines.length < 2) {
      score -= 0.15;
      issues.push("Missing clear heading structure.");
    }
  
    // Spacing and padding check
    const doubleSpaced = output.includes('\n\n');
    if (!doubleSpaced) {
      score -= 0.1;
      issues.push("Insufficient section spacing.");
    }
  
    // Emoji check — simplified approach without Unicode regex
    const commonEmojis = ['😀', '😊', '🎯', '🚀', '✨', '💡', '🔥', '⚡', '🎉', '👍', '💪', '🌟'];
    let emojiCount = 0;
    for (const emoji of commonEmojis) {
      emojiCount += (output.match(new RegExp(emoji, 'g')) || []).length;
    }
    if (emojiCount > 6) {
      score -= 0.05;
      issues.push("Excessive emoji usage.");
    } else if (emojiCount < 1) {
      score -= 0.05;
      issues.push("No emoji cues present (optional but encouraged).");
    }
  
    // Bullet structure check
    const bulletCount = output.split('\n').filter(l => l.trim().startsWith('-')).length;
    if (bulletCount < 3) {
      score -= 0.1;
      issues.push("Too few bullet points or lists.");
    }
  
    // Sentence formatting
    const longLines = output.split('\n').filter(l => l.length > 160);
    if (longLines.length > 0) {
      score -= 0.1;
      issues.push("Overly long lines reduce scannability.");
    }
  
    // Tone verification (basic)
    const toneFlags = ["possibly", "maybe", "could consider", "sort of"];
    if (toneFlags.some(flag => output.toLowerCase().includes(flag))) {
      score -= 0.1;
      issues.push("Hedging or uncertainty detected in tone.");
    }
  
    // Enforce lower bound
    if (score < 0.2) score = 0.2;
  
    return parseFloat(score.toFixed(3));
  }
  