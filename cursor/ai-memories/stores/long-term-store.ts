/**
 * ai-memories/stores/long-term-store.ts
 * 
 * Purpose:
 * Implements persistent storage for long-term memories with versioning and compression.
 */

import { EventBus } from '../../event-bus/eventBus';
import { LongTermMemory, MemoryMetadata, MemoryVersion } from '../memory-types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class LongTermMemoryStore {
  private memories: Map<string, LongTermMemory>;
  private versions: Map<string, MemoryVersion[]>;
  private eventBus: EventBus;
  private storagePath: string;

  constructor(eventBus: EventBus, storagePath: string) {
    this.memories = new Map();
    this.versions = new Map();
    this.eventBus = eventBus;
    this.storagePath = storagePath;
  }

  /**
   * Initializes the store by loading persisted memories
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      const files = await fs.readdir(this.storagePath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(this.storagePath, file), 'utf-8');
          const memory = JSON.parse(content) as LongTermMemory;
          this.memories.set(memory.id, memory);
        }
      }
    } catch (error) {
      this.eventBus.emit('memory.error', {
        type: 'memory:error',
        memoryId: 'init',
        timestamp: Date.now(),
        data: { error: 'Failed to initialize store', details: error }
      });
    }
  }

  /**
   * Saves a long-term memory
   */
  async save(memory: LongTermMemory): Promise<void> {
    this.memories.set(memory.id, memory);
    await this.persistMemory(memory);
    
    this.eventBus.emit('memory.saved', {
      type: 'memory:saved',
      memoryId: memory.id,
      timestamp: Date.now(),
      data: { type: 'long-term' }
    });
  }

  /**
   * Retrieves a long-term memory by ID
   */
  async recall(id: string): Promise<LongTermMemory | null> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.lastAccessed = Date.now();
      memory.accessCount++;
      memory.retrievalCount++;
      memory.lastRetrieved = Date.now();
      
      this.eventBus.emit('memory.recalled', {
        type: 'memory:recalled',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'long-term' }
      });
    }
    return memory || null;
  }

  /**
   * Updates a long-term memory with versioning
   */
  async update(id: string, updates: Partial<LongTermMemory>): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      const oldVersion = { ...memory };
      const updatedMemory = { ...memory, ...updates, version: memory.version + 1 };
      
      // Create version record
      const version: MemoryVersion = {
        id: `${id}-v${updatedMemory.version}`,
        memoryId: id,
        version: updatedMemory.version,
        timestamp: Date.now(),
        changes: Object.entries(updates).map(([field, newValue]) => ({
          field,
          oldValue: oldVersion[field as keyof LongTermMemory],
          newValue
        })),
        author: 'system',
        reason: 'memory update'
      };

      // Store version
      const versions = this.versions.get(id) || [];
      versions.push(version);
      this.versions.set(id, versions);

      // Update memory
      this.memories.set(id, updatedMemory);
      await this.persistMemory(updatedMemory);
      
      this.eventBus.emit('memory.updated', {
        type: 'memory:updated',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'long-term', version: updatedMemory.version }
      });
    }
  }

  /**
   * Deletes a long-term memory
   */
  async delete(id: string): Promise<void> {
    if (this.memories.delete(id)) {
      await this.deletePersistedMemory(id);
      this.versions.delete(id);
      
      this.eventBus.emit('memory.deleted', {
        type: 'memory:deleted',
        memoryId: id,
        timestamp: Date.now(),
        data: { type: 'long-term' }
      });
    }
  }

  /**
   * Gets all memories in a category
   */
  async getByCategory(category: string): Promise<LongTermMemory[]> {
    return Array.from(this.memories.values())
      .filter(m => m.category === category);
  }

  /**
   * Gets memory versions
   */
  async getVersions(id: string): Promise<MemoryVersion[]> {
    return this.versions.get(id) || [];
  }

  /**
   * Gets memory statistics
   */
  async getStats(): Promise<{
    totalMemories: number;
    totalVersions: number;
    averageRetrievalCount: number;
    categories: Record<string, number>;
  }> {
    const memories = Array.from(this.memories.values());
    const categories: Record<string, number> = {};
    
    memories.forEach(m => {
      categories[m.category] = (categories[m.category] || 0) + 1;
    });

    return {
      totalMemories: memories.length,
      totalVersions: Array.from(this.versions.values())
        .reduce((sum, versions) => sum + versions.length, 0),
      averageRetrievalCount: memories.reduce((sum, m) => sum + m.retrievalCount, 0) / memories.length || 0,
      categories
    };
  }

  /**
   * Persists a memory to disk
   */
  private async persistMemory(memory: LongTermMemory): Promise<void> {
    try {
      const filePath = path.join(this.storagePath, `${memory.id}.json`);
      await fs.writeFile(filePath, JSON.stringify(memory, null, 2));
    } catch (error) {
      this.eventBus.emit('memory.error', {
        type: 'memory:error',
        memoryId: memory.id,
        timestamp: Date.now(),
        data: { error: 'Failed to persist memory', details: error }
      });
    }
  }

  /**
   * Deletes a persisted memory
   */
  private async deletePersistedMemory(id: string): Promise<void> {
    try {
      const filePath = path.join(this.storagePath, `${id}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      this.eventBus.emit('memory.error', {
        type: 'memory:error',
        memoryId: id,
        timestamp: Date.now(),
        data: { error: 'Failed to delete persisted memory', details: error }
      });
    }
  }

  /**
   * Cleans up resources
   */
  dispose(): void {
    this.memories.clear();
    this.versions.clear();
  }
} 