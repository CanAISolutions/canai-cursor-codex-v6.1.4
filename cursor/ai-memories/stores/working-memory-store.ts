/**
 * ai-memories/stores/working-memory-store.ts
 * 
 * Purpose:
 * Implements storage for working memories that maintain active context and processing state.
 */

import { EventBus } from '../../utils/event-bus';
import { WorkingMemory, MemoryMetadata } from '../memory-types';

export class WorkingMemoryStore {
  private memories: Map<string, WorkingMemory>;
  private eventBus: EventBus;
  private maxActiveMemories: number;

  constructor(eventBus: EventBus, maxActiveMemories: number = 100) {
    this.memories = new Map();
    this.eventBus = eventBus;
    this.maxActiveMemories = maxActiveMemories;
  }

  /**
   * Saves a working memory
   */
  async save(memory: WorkingMemory): Promise<void> {
    // Enforce memory limit by archiving least focused memories
    if (this.memories.size >= this.maxActiveMemories) {
      await this.archiveLeastFocused();
    }

    this.memories.set(memory.id, memory);
    this.eventBus.emit('memory.saved', {
      type: 'memory:saved',
      memoryId: memory.id,
      timestamp: Date.now(),
      data: { type: 'working' }
    });
  }

  /**
   * Retrieves a working memory by ID
   */
  async recall(id: string): Promise<WorkingMemory | null> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.lastAccessed = Date.now();
      memory.accessCount++;
      this.eventBus.emit('memory.recalled', {
        type: 'memory:recalled',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'working' }
      });
    }
    return memory || null;
  }

  /**
   * Updates a working memory
   */
  async update(id: string, updates: Partial<WorkingMemory>): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      const updatedMemory = { ...memory, ...updates };
      this.memories.set(id, updatedMemory);
      this.eventBus.emit('memory.updated', {
        type: 'memory:updated',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'working' }
      });
    }
  }

  /**
   * Deletes a working memory
   */
  async delete(id: string): Promise<void> {
    if (this.memories.delete(id)) {
      this.eventBus.emit('memory.deleted', {
        type: 'memory:deleted',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'working' }
      });
    }
  }

  /**
   * Archives a memory by marking it as inactive
   */
  async archive(id: string): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.state = 'archived';
      this.eventBus.emit('memory.archived', {
        type: 'memory:archived',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'working' }
      });
    }
  }

  /**
   * Archives the least focused memory when limit is reached
   */
  private async archiveLeastFocused(): Promise<void> {
    const memories = Array.from(this.memories.values());
    const leastFocused = memories.reduce((min, current) => 
      current.focus < min.focus ? current : min
    );
    if (leastFocused) {
      await this.archive(leastFocused.id);
    }
  }

  /**
   * Gets all active memories
   */
  async getActive(): Promise<WorkingMemory[]> {
    return Array.from(this.memories.values())
      .filter(m => m.state === 'active');
  }

  /**
   * Gets memories by task
   */
  async getByTask(taskId: string): Promise<WorkingMemory[]> {
    return Array.from(this.memories.values())
      .filter(m => m.processingContext.currentTask === taskId);
  }

  /**
   * Gets memory statistics
   */
  async getStats(): Promise<{
    totalMemories: number;
    activeMemories: number;
    archivedMemories: number;
    averageFocus: number;
  }> {
    const memories = Array.from(this.memories.values());
    const activeMemories = memories.filter(m => m.state === 'active');
    const archivedMemories = memories.filter(m => m.state === 'archived');
    
    return {
      totalMemories: memories.length,
      activeMemories: activeMemories.length,
      archivedMemories: archivedMemories.length,
      averageFocus: memories.reduce((sum, m) => sum + m.focus, 0) / memories.length || 0
    };
  }

  /**
   * Cleans up resources
   */
  dispose(): void {
    this.memories.clear();
  }
} 