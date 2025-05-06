/**
 * ai-memories/memory-hierarchy-manager.ts
 * 
 * Purpose:
 * Coordinates memory operations across the three-tier memory hierarchy.
 * Manages memory promotion, demotion, and lifecycle.
 */

import { EventBus } from '../utils/event-bus';
import {
  Memory,
  ShortTermMemory,
  WorkingMemory,
  LongTermMemory,
  MemoryVersion,
  MemoryCompression,
  MemoryRetrieval,
  MemoryEvent,
  MemoryStats,
  MemoryEventType
} from './memory-types';
import { ShortTermMemoryStore } from './stores/short-term-store';
import { WorkingMemoryStore } from './stores/working-memory-store';
import { LongTermMemoryStore } from './stores/long-term-store';

export class MemoryHierarchyManager {
  private eventBus: EventBus;
  private shortTermStore: ShortTermMemoryStore;
  private workingStore: WorkingMemoryStore;
  private longTermStore: LongTermMemoryStore;
  private stats: MemoryStats;

  constructor(
    eventBus: EventBus,
    longTermStoragePath: string,
    maxWorkingMemories: number = 100
  ) {
    this.eventBus = eventBus;
    this.shortTermStore = new ShortTermMemoryStore(eventBus);
    this.workingStore = new WorkingMemoryStore(eventBus, maxWorkingMemories);
    this.longTermStore = new LongTermMemoryStore(eventBus, longTermStoragePath);
    this.stats = this.initializeStats();
  }

  /**
   * Initializes the memory system
   */
  async initialize(): Promise<void> {
    await this.longTermStore.initialize();
    this.setupEventListeners();
  }

  /**
   * Saves a memory to the appropriate store
   */
  async save(memory: Memory): Promise<void> {
    if ('type' in memory) {
      switch (memory.type) {
        case 'short-term':
          await this.shortTermStore.save(memory as ShortTermMemory);
          break;
        case 'working':
          await this.workingStore.save(memory as WorkingMemory);
          break;
        case 'long-term':
          await this.longTermStore.save(memory as LongTermMemory);
          break;
      }
      this.updateStats();
    }
  }

  /**
   * Retrieves a memory by ID
   */
  async recall(id: string): Promise<Memory | null> {
    // Try each store in order of volatility
    const memory = await this.shortTermStore.recall(id) ||
                 await this.workingStore.recall(id) ||
                 await this.longTermStore.recall(id);
    
    if (memory) {
      this.eventBus.emit('memory.recalled', {
        type: 'memory:recalled' as MemoryEventType,
        memoryId: id,
        timestamp: Date.now(),
        data: { type: memory.type }
      });
    }
    
    return memory;
  }

  /**
   * Updates a memory
   */
  async update(id: string, updates: Partial<Memory>): Promise<void> {
    const memory = await this.recall(id);
    if (memory && 'type' in memory) {
      switch (memory.type) {
        case 'short-term':
          await this.shortTermStore.update(id, updates as Partial<ShortTermMemory>);
          break;
        case 'working':
          await this.workingStore.update(id, updates as Partial<WorkingMemory>);
          break;
        case 'long-term':
          await this.longTermStore.update(id, updates as Partial<LongTermMemory>);
          break;
      }
    }
  }

  /**
   * Deletes a memory
   */
  async delete(id: string): Promise<void> {
    const memory = await this.recall(id);
    if (memory && 'type' in memory) {
      switch (memory.type) {
        case 'short-term':
          await this.shortTermStore.delete(id);
          break;
        case 'working':
          await this.workingStore.delete(id);
          break;
        case 'long-term':
          await this.longTermStore.delete(id);
          break;
      }
    }
  }

  /**
   * Promotes a short-term memory to working memory
   */
  async promoteToWorking(shortTermMemory: ShortTermMemory): Promise<WorkingMemory> {
    const workingMemory: WorkingMemory = {
      ...shortTermMemory,
      type: 'working',
      state: 'active',
      focus: 0.8,
      associations: [],
      processingContext: {
        currentTask: 'promoted',
        subTasks: [],
        progress: 0,
        dependencies: []
      }
    };

    await this.workingStore.save(workingMemory);
    await this.shortTermStore.delete(shortTermMemory.id);

    this.eventBus.emit('memory.promoted', {
      type: 'memory:promoted' as MemoryEventType,
      memoryId: shortTermMemory.id,
      timestamp: Date.now(),
      data: {
        from: 'short-term',
        to: 'working'
      }
    });

    return workingMemory;
  }

  /**
   * Promotes a working memory to long-term memory
   */
  async promoteToLongTerm(workingMemory: WorkingMemory): Promise<LongTermMemory> {
    const longTermMemory: LongTermMemory = {
      ...workingMemory,
      type: 'long-term',
      category: 'promoted',
      subCategories: [],
      retrievalStrength: 0.8,
      lastRetrieved: Date.now(),
      retrievalCount: 0,
      compressionHistory: []
    };

    await this.longTermStore.save(longTermMemory);
    await this.workingStore.delete(workingMemory.id);

    this.eventBus.emit('memory.promoted', {
      type: 'memory:promoted' as MemoryEventType,
      memoryId: workingMemory.id,
      timestamp: Date.now(),
      data: {
        from: 'working',
        to: 'long-term'
      }
    });

    return longTermMemory;
  }

  /**
   * Demotes a working memory to short-term memory
   */
  async demoteToShortTerm(workingMemory: WorkingMemory): Promise<ShortTermMemory> {
    const shortTermMemory: ShortTermMemory = {
      ...workingMemory,
      type: 'short-term',
      ttl: 3600000, // 1 hour
      priority: 1,
      isProcessed: false,
      processingStatus: 'pending',
      processingAttempts: 0
    };

    await this.shortTermStore.save(shortTermMemory);
    await this.workingStore.delete(workingMemory.id);

    this.eventBus.emit('memory.demoted', {
      type: 'memory:demoted' as MemoryEventType,
      memoryId: workingMemory.id,
      timestamp: Date.now(),
      data: {
        from: 'working',
        to: 'short-term'
      }
    });

    return shortTermMemory;
  }

  /**
   * Gets memory statistics
   */
  async getStats(): Promise<MemoryStats> {
    const [shortTermStats, workingStats, longTermStats] = await Promise.all([
      this.shortTermStore.getStats(),
      this.workingStore.getStats(),
      this.longTermStore.getStats()
    ]);

    this.stats = {
      totalMemories: shortTermStats.totalMemories + workingStats.totalMemories + longTermStats.totalMemories,
      shortTermCount: shortTermStats.totalMemories,
      workingCount: workingStats.totalMemories,
      longTermCount: longTermStats.totalMemories,
      averageCompressionRatio: 0, // Will be implemented in Phase 2
      memoryUsage: {
        shortTerm: shortTermStats.totalMemories,
        working: workingStats.totalMemories,
        longTerm: longTermStats.totalMemories
      },
      retrievalStats: {
        averageRetrievalTime: 0, // Will be implemented in Phase 2
        hitRate: 0, // Will be implemented in Phase 2
        missRate: 0 // Will be implemented in Phase 2
      },
      versionStats: {
        totalVersions: longTermStats.totalVersions,
        averageVersionsPerMemory: longTermStats.totalVersions / longTermStats.totalMemories || 0
      }
    };

    return this.stats;
  }

  /**
   * Initializes memory statistics
   */
  private initializeStats(): MemoryStats {
    return {
      totalMemories: 0,
      shortTermCount: 0,
      workingCount: 0,
      longTermCount: 0,
      averageCompressionRatio: 0,
      memoryUsage: {
        shortTerm: 0,
        working: 0,
        longTerm: 0
      },
      retrievalStats: {
        averageRetrievalTime: 0,
        hitRate: 0,
        missRate: 0
      },
      versionStats: {
        totalVersions: 0,
        averageVersionsPerMemory: 0
      }
    };
  }

  /**
   * Updates memory statistics
   */
  private async updateStats(): Promise<void> {
    this.stats = await this.getStats();
    this.eventBus.emit('memory.stats.updated', {
      type: 'memory:stats:updated' as MemoryEventType,
      memoryId: 'system',
      timestamp: Date.now(),
      data: this.stats
    });
  }

  /**
   * Sets up event listeners
   */
  private setupEventListeners(): void {
    this.eventBus.on('memory.saved', this.handleMemoryEvent.bind(this));
    this.eventBus.on('memory.recalled', this.handleMemoryEvent.bind(this));
    this.eventBus.on('memory.updated', this.handleMemoryEvent.bind(this));
    this.eventBus.on('memory.deleted', this.handleMemoryEvent.bind(this));
    this.eventBus.on('memory.promoted', this.handleMemoryEvent.bind(this));
    this.eventBus.on('memory.demoted', this.handleMemoryEvent.bind(this));
  }

  /**
   * Handles memory events
   */
  private handleMemoryEvent(event: MemoryEvent): void {
    // Update stats on significant events
    if (event.type === 'memory:saved' as MemoryEventType || 
        event.type === 'memory:deleted' as MemoryEventType ||
        event.type === 'memory:promoted' as MemoryEventType ||
        event.type === 'memory:demoted' as MemoryEventType) {
      this.updateStats();
    }
  }

  /**
   * Cleans up resources
   */
  dispose(): void {
    this.shortTermStore.dispose();
    this.workingStore.dispose();
    this.longTermStore.dispose();
  }
} 