// cursor/accelerators/federated-memory-lite/memory-federation-engine.ts

import routing from './memory-routing-spec.jsonc'

type MemorySource = 'local-session' | 'persona-shard' | 'global-memory' | 'system-override'

interface MemoryRequest {
  key: string
  intent: string
  context: string
  sources: Record<MemorySource, string | null>
}

export function resolveMemory(req: MemoryRequest): string | null {
  const rule = routing.routingRules.find(r => r.intent === req.intent)
  if (!rule) return req.sources['global-memory'] || null

  for (const tier of rule.priority) {
    const sourceVal = req.sources[tier as MemorySource]
    if (sourceVal) return sourceVal
  }

  if (routing.fallback["on-missing"] === "revert to persona-shard") {
    return req.sources["persona-shard"]
  }

  return null
}
