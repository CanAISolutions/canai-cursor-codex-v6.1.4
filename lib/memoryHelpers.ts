// 🧠 CanAI Memory & Enhancer Utilities
// Applies enhancer logic, fallback values, and prepares for user-specific memory injection

type Input = Record<string, any>

const enhancerDefaults: Partial<Input> = {
  tone: "confident and friendly",
  desiredAction: "Learn more or get started",
  customerPain: "Unclear value or next steps",
  trustSignal: "Trusted by others in your community",
}

export function applyEnhancers(input: Input): Input {
  const enriched = { ...input }
  const injected: string[] = []

  Object.entries(enhancerDefaults).forEach(([key, value]) => {
    if (!enriched[key] || enriched[key]?.trim() === "") {
      enriched[key] = value
      injected.push(key)
    }
  })

  enriched._fallbacks = injected // metadata for traceability
  return enriched
}

export function normalizeInput(input: Input): Input {
  const cleaned = { ...input }

  Object.keys(cleaned).forEach((key) => {
    if (typeof cleaned[key] === "string") {
      cleaned[key] = cleaned[key].trim()
    }
  })

  return cleaned
}

// Future placeholder — personalized memory enrichment
export async function enrichWithMemory(userId: string): Promise<Partial<Input>> {
  return {} // Extend with Airtable or Redis lookup later
}
