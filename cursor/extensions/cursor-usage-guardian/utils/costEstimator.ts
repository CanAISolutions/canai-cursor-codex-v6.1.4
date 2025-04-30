export function estimateCost(provider: string, tokensUsed: number): number {
    const costPerThousandTokens: { [key: string]: number } = {
      openai: 0.003,     // e.g., GPT-4o 128k context
      deepseek: 0.0015,
      anthropic: 0.005,
      default: 0.003
    };
  
    const normalizedProvider = provider.toLowerCase();
    const rate = costPerThousandTokens[normalizedProvider] || costPerThousandTokens["default"];
    return (tokensUsed / 1000) * rate;
  }
  