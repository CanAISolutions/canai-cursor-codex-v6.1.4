// cursor/accelerators/federated-memory-lite/memory-federation-engine.ts
// 🧠 Federated Memory Resolver – Codex Snapshot-Safe
// Purpose: Dynamically resolves which memory source to use based on routing rules and declared intent.
// Enforces priority tiers, fallbacks, and future-safe schema-driven routing logic.

import routing from './memory-routing-spec.jsonc'

// Enum-safe memory tiers (Codex futureproofing)
export type MemorySource = 'local-session' | 'persona-shard' | 'global-memory' | 'system-override'

export interface MemoryRequest {
  key: string                         // Unique memory key
  intent: string                      // User or agent intent (must match routing rule)
  context: string                     // Optional debug or trace context
  sources: Record<MemorySource, string | null> // All possible sources with null-safe values
}

export interface MemoryResolutionResult {
  resolvedFrom: MemorySource | 'fallback' | 'none'
  value: string | null
  trace: {
    key: string
    intent: string
    tried: MemorySource[]
    fallback: string
    resolved: string | null
  }
}

export function resolveMemory(req: MemoryRequest): MemoryResolutionResult {
  const rule = routing.routingRules.find(r => r.intent === req.intent)

  const tried: MemorySource[] = []

  if (!rule) {
    const val = req.sources['global-memory'] || null
    return {
      resolvedFrom: val ? 'global-memory' : 'none',
      value: val,
      trace: {
        key: req.key,
        intent: req.intent,
        tried: [],
        fallback: 'global-memory',
        resolved: val
      }
    }
  }

  for (const tier of rule.priority) {
    const typedTier = tier as MemorySource
    const sourceVal = req.sources[typedTier]
    tried.push(typedTier)

    if (sourceVal) {
      return {
        resolvedFrom: typedTier,
        value: sourceVal,
        trace: {
          key: req.key,
          intent: req.intent,
          tried,
          fallback: routing.fallback["on-missing"],
          resolved: sourceVal
        }
      }
    }
  }

  // Fallback logic
  if (routing.fallback["on-missing"] === "revert to persona-shard") {
    const fallbackVal = req.sources["persona-shard"]
    return {
      resolvedFrom: fallbackVal ? 'fallback' : 'none',
      value: fallbackVal,
      trace: {
        key: req.key,
        intent: req.intent,
        tried,
        fallback: 'persona-shard',
        resolved: fallbackVal
      }
    }
  }

  // Default null-safe fallback
  return {
    resolvedFrom: 'none',
    value: null,
    trace: {
      key: req.key,
      intent: req.intent,
      tried,
      fallback: 'none',
      resolved: null
    }
  }
}
