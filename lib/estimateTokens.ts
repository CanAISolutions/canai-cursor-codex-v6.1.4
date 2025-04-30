// 💰 CanAI Token Estimator
// Estimates token usage and cost using rough character count (4 chars per token)
// Supports DeliveryCostLogs, pricing models, and usage analytics

type TokenEstimate = {
    tokensIn: number
    tokensOut: number
    total: number
    costUSD: number
  }
  
  const TOKENS_PER_CHAR = 1 / 4
  const COST_PER_1K = 0.003 // GPT-4o input/output = $0.003 per 1K
  
  export function estimateTokens(inputText: string, outputText: string): TokenEstimate {
    const inputClean = inputText?.replace(/\s+/g, " ").trim() || ""
    const outputClean = outputText?.replace(/\s+/g, " ").trim() || ""
  
    const tokensIn = Math.round(inputClean.length * TOKENS_PER_CHAR)
    const tokensOut = Math.round(outputClean.length * TOKENS_PER_CHAR)
    const total = tokensIn + tokensOut
    const costUSD = parseFloat(((total / 1000) * COST_PER_1K).toFixed(6))
  
    return {
      tokensIn,
      tokensOut,
      total,
      costUSD,
    }
  }
  