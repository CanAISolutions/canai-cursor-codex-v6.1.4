// cursor/accelerators/federated-memory-lite/memory-federation-engine.spec.ts
// ✅ Snapshot Unit Tests – memory-federation-engine
// Ensures priority routing, fallback logic, and trace accuracy are Codex-compliant.

import { resolveMemory, MemoryRequest } from './memory-federation-engine'

describe('resolveMemory', () => {
  const baseSources = {
    'local-session': null,
    'persona-shard': '🧠 persona-value',
    'global-memory': '🌍 global-value',
    'system-override': null,
  }

  it('resolves using the first matching priority tier', () => {
    const req: MemoryRequest = {
      key: 'greeting',
      intent: 'get-greeting',
      context: 'test-case-1',
      sources: {
        ...baseSources,
        'local-session': '👤 local-value',
      }
    }

    const result = resolveMemory(req)
    expect(result.resolvedFrom).toBe('local-session')
    expect(result.value).toBe('👤 local-value')
  })

  it('falls back to persona-shard if rule is matched but sources are empty', () => {
    const req: MemoryRequest = {
      key: 'greeting',
      intent: 'get-greeting',
      context: 'test-case-2',
      sources: {
        'local-session': null,
        'persona-shard': '🧠 persona-value',
        'global-memory': null,
        'system-override': null,
      }
    }

    const result = resolveMemory(req)
    expect(result.resolvedFrom).toBe('fallback')
    expect(result.value).toBe('🧠 persona-value')
  })

  it('uses global-memory when no rule exists', () => {
    const req: MemoryRequest = {
      key: 'fallback-check',
      intent: 'nonexistent-intent',
      context: 'test-case-3',
      sources: baseSources
    }

    const result = resolveMemory(req)
    expect(result.resolvedFrom).toBe('global-memory')
    expect(result.value).toBe('🌍 global-value')
  })

  it('returns null and resolvedFrom = none if all values are null', () => {
    const req: MemoryRequest = {
      key: 'empty-case',
      intent: 'get-greeting',
      context: 'test-case-4',
      sources: {
        'local-session': null,
        'persona-shard': null,
        'global-memory': null,
        'system-override': null,
      }
    }

    const result = resolveMemory(req)
    expect(result.resolvedFrom).toBe('none')
    expect(result.value).toBeNull()
  })
})
