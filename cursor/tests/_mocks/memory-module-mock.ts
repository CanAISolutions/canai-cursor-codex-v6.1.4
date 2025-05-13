// memory-module-mock.ts
// WHAT: Version-tagged mock for memory module integration tests
// WHY: Enables simulation of memory restore and recall for Codex trust validation
// HOW: Provides a mock memory module with restore event logging and failure injection

export interface MemoryRestoreEvent {
  sessionId: string;
  version: string;
  keysRestored: string[];
  // Contract-aligned fields
  memory?: any; // Full Memory object if available
  degraded?: boolean;
  reason?: string;
}

interface MemoryModuleMockOptions {
  failOnMissing?: boolean;
}

/**
 * MemoryModuleMockV1 — Simulates memory restore from partial context
 * Version: v1.0.0
 */
export class MemoryModuleMockV1 {
  public readonly version = 'v1.0.0';
  private failOnMissing: boolean;
  private requiredKeys = ['user', 'goal', 'history'];

  constructor(options: MemoryModuleMockOptions = {}) {
    this.failOnMissing = options.failOnMissing ?? false;
  }

  /**
   * Simulate restoring memory from partial context
   * @param context - partial context for restore
   * @param onEvent - callback for restore event logging
   */
  async restore(
    context: { sessionId: string; knownKeys: string[] },
    onEvent: (event: MemoryRestoreEvent) => void
  ): Promise<{ complete: boolean; sessionId: string }> {
    const missing = this.requiredKeys.filter(k => !context.knownKeys.includes(k));
    // Compose contract-aligned memory object
    const memory = {
      id: `mock-memory-${context.sessionId}`,
      type: 'short-term',
      timestamp: Date.now(),
      version: 1,
      metadata: {
        source: 'mock',
        confidence: missing.length === 0 ? 1 : 0.5,
        context: { knownKeys: context.knownKeys },
        tags: ['test'],
        importance: 1,
        relatedMemories: []
      },
      isCompressed: false,
      lastAccessed: Date.now(),
      accessCount: 1,
      content: { keys: context.knownKeys }
    };
    onEvent({
      sessionId: context.sessionId,
      version: this.version,
      keysRestored: context.knownKeys,
      memory,
      degraded: missing.length > 0,
      reason: missing.length > 0 ? 'partial/corrupted memory' : undefined
    });
    if (this.failOnMissing && missing.length > 0) {
      // Emit degraded event before throwing
      onEvent({
        sessionId: context.sessionId,
        version: this.version,
        keysRestored: context.knownKeys,
        memory,
        degraded: true,
        reason: 'corrupted memory: missing keys ' + missing.join(',')
      });
      throw new Error('MemoryModuleMockV1 restore failed: missing keys ' + missing.join(','));
    }
    // Simulate async restore
    await new Promise(res => setTimeout(res, 10));
    return {
      complete: missing.length === 0,
      sessionId: context.sessionId,
    };
  }
} 