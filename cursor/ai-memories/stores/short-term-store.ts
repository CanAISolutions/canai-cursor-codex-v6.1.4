/**
 * ai-memories/stores/short-term-store.ts
 * 
 * Purpose:
 * Implements in-memory storage for short-term memories with TTL-based cleanup.
 */

import { EventBus } from '../../utils/event-bus';
import { ShortTermMemory, MemoryMetadata } from '../memory-types';

export class ShortTermMemoryStore {
  private memories: Map<string, ShortTermMemory>;
  private eventBus: EventBus;
  private cleanupInterval: NodeJS.Timeout;

  constructor(eventBus: EventBus, cleanupIntervalMs: number = 60000) {
    this.memories = new Map();
    this.eventBus = eventBus;
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  /**
   * Saves a short-term memory with TTL
   */
  async save(memory: ShortTermMemory): Promise<void> {
    this.memories.set(memory.id, memory);
    this.eventBus.emit('memory.saved', {
      type: 'memory:saved',
      memoryId: memory.id,
      timestamp: Date.now(),
      data: { type: 'short-term' }
    });
  }

  /**
   * Retrieves a short-term memory by ID
   */
  async recall(id: string): Promise<ShortTermMemory | null> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.lastAccessed = Date.now();
      memory.accessCount++;
      this.eventBus.emit('memory.recalled', {
        type: 'memory:recalled',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'short-term' }
      });
    }
    return memory || null;
  }

  /**
   * Updates a short-term memory
   */
  async update(id: string, updates: Partial<ShortTermMemory>): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      const updatedMemory = { ...memory, ...updates };
      this.memories.set(id, updatedMemory);
      this.eventBus.emit('memory.updated', {
        type: 'memory:updated',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'short-term' }
      });
    }
  }

  /**
   * Deletes a short-term memory
   */
  async delete(id: string): Promise<void> {
    if (this.memories.delete(id)) {
      this.eventBus.emit('memory.deleted', {
        type: 'memory:deleted',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'short-term' }
      });
    }
  }

  /**
   * Cleans up expired memories
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [id, memory] of this.memories.entries()) {
      if (now - memory.timestamp > memory.ttl) {
        this.delete(id);
      }
    }
  }

  /**
   * Gets all active memories
   */
  async getAll(): Promise<ShortTermMemory[]> {
    return Array.from(this.memories.values());
  }

  /**
   * Gets memory statistics
   */
  async getStats(): Promise<{
    totalMemories: number;
    activeMemories: number;
    averageTTL: number;
  }> {
    const memories = Array.from(this.memories.values());
    const now = Date.now();
    const activeMemories = memories.filter(m => now - m.timestamp <= m.ttl);
    
    return {
      totalMemories: memories.length,
      activeMemories: activeMemories.length,
      averageTTL: memories.reduce((sum, m) => sum + m.ttl, 0) / memories.length || 0
    };
  }

  /**
   * Cleans up resources
   */
  dispose(): void {
    clearInterval(this.cleanupInterval);
    this.memories.clear();
  }
} 