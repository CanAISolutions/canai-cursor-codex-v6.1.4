// cursor/fallbackUX.ts
// Graceful fallback copy and prompts used when GPT fails or output is weak

/**
 * Returns a branded fallback message if output fails or is missing
 */
export function fallbackMessage(promptType: string) {
    return `⚠️ We're having trouble generating your ${promptType} right now. Please try again or modify your input slightly.`
  }
  
  /**
   * Returns a branded inline CTA to improve input quality
   */
  export function helpfulCTA(): string {
    return `💡 Tip: Add more details about your audience, product, or tone for better results.`
  }
  
  /**
   * Fallback summary for UI banners or redirect pages
   */
  export function outputUnavailable(): string {
    return `❌ Output not available. GPT did not return a usable result. We’ve logged this and will refine the prompt.`
  }
  