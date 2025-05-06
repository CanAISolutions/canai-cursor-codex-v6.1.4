/**
 * ai-memories/retrieval/memory-retrieval.ts
 * 
 * Purpose:
 * Implements intelligent memory retrieval with filtering and sorting capabilities.
 */

import { EventBus } from '../../utils/event-bus';
import {
  Memory,
  MemoryType,
  ShortTermMemory,
  WorkingMemory,
  LongTermMemory,
  MemoryEvent,
  MemoryEventType
} from '../memory-types';
import { MemoryHierarchyManager } from '../memory-hierarchy-manager';

export class MemoryRetrieval {
  private eventBus: EventBus;
  private manager: MemoryHierarchyManager;

  constructor(eventBus: EventBus, manager: MemoryHierarchyManager) {
    this.eventBus = eventBus;
    this.manager = manager;
  }

  /**
   * Retrieves memories by type
   */
  async recallByType(type: MemoryType): Promise<Memory[]> {
    const memories: Memory[] = [];
    const stats = await this.manager.getStats();

    switch (type) {
      case 'short-term':
        // Get all short-term memories
        for (let i = 0; i < stats.shortTermCount; i++) {
          const memory = await this.manager.recall(`st-${i}`);
          if (memory && memory.type === 'short-term') {
            memories.push(memory);
          }
        }
        break;

      case 'working':
        // Get all working memories
        for (let i = 0; i < stats.workingCount; i++) {
          const memory = await this.manager.recall(`wm-${i}`);
          if (memory && memory.type === 'working') {
            memories.push(memory);
          }
        }
        break;

      case 'long-term':
        // Get all long-term memories
        for (let i = 0; i < stats.longTermCount; i++) {
          const memory = await this.manager.recall(`lt-${i}`);
          if (memory && memory.type === 'long-term') {
            memories.push(memory);
          }
        }
        break;
    }

    this.emitRetrievalEvent(type, memories.length);
    return memories;
  }

  /**
   * Retrieves memories by trust delta
   */
  async recallByTrustDelta(delta: number): Promise<Memory[]> {
    const memories: Memory[] = [];
    const stats = await this.manager.getStats();

    // Check all memory types
    for (let i = 0; i < stats.totalMemories; i++) {
      const memory = await this.manager.recall(`mem-${i}`);
      if (memory && this.calculateTrustDelta(memory) >= delta) {
        memories.push(memory);
      }
    }

    this.emitRetrievalEvent('trust-delta', memories.length);
    return memories;
  }

  /**
   * Retrieves recent memories
   */
  async recallRecent(limit: number): Promise<Memory[]> {
    const memories: Memory[] = [];
    const stats = await this.manager.getStats();

    // Get all memories and sort by last accessed
    for (let i = 0; i < stats.totalMemories; i++) {
      const memory = await this.manager.recall(`mem-${i}`);
      if (memory) {
        memories.push(memory);
      }
    }

    // Sort by last accessed and limit
    const recentMemories = memories
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, limit);

    this.emitRetrievalEvent('recent', recentMemories.length);
    return recentMemories;
  }

  /**
   * Calculates trust delta for a memory
   */
  private calculateTrustDelta(memory: Memory): number {
    const baseTrust = memory.metadata.confidence;
    const timeFactor = this.calculateTimeFactor(memory.lastAccessed);
    const accessFactor = this.calculateAccessFactor(memory.accessCount);

    return baseTrust * timeFactor * accessFactor;
  }

  /**
   * Calculates time-based trust factor
   */
  private calculateTimeFactor(lastAccessed: number): number {
    const now = Date.now();
    const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);
    return Math.max(0.5, 1 - (hoursSinceAccess / 24)); // Decay over 24 hours
  }

  /**
   * Calculates access-based trust factor
   */
  private calculateAccessFactor(accessCount: number): number {
    return Math.min(1, 0.5 + (accessCount * 0.1)); // Cap at 1, start at 0.5
  }

  /**
   * Emits retrieval event
   */
  private emitRetrievalEvent(type: string, count: number): void {
    const event: MemoryEvent = {
      type: 'memory:retrieved' as MemoryEventType,
      memoryId: 'system',
      timestamp: Date.now(),
      data: {
        retrievalType: type,
        count,
        timestamp: Date.now()
      }
    };

    this.eventBus.emit('memory.retrieved', event);
  }
} 