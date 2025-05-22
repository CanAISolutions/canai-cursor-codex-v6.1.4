/**
 * ai-memories/memory-hierarchy-manager.test.ts
 * 
 * Purpose:
 * Tests the memory hierarchy manager for proper coordination between memory stores.
 */

import { EventBus } from '../event-bus/eventBus';
import { MemoryHierarchyManager } from './memory-hierarchy-manager';
import { ShortTermMemory, WorkingMemory, LongTermMemory, Memory } from './memory-types';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('MemoryHierarchyManager', () => {
  let eventBus: EventBus;
  let manager: MemoryHierarchyManager;
  let testStoragePath: string;

  beforeEach(async () => {
    eventBus = EventBus.getInstance();
    testStoragePath = path.join(__dirname, 'test-storage');
    manager = new MemoryHierarchyManager(eventBus, testStoragePath);
    await manager.initialize();
  });

  afterEach(async () => {
    manager.dispose();
    try {
      await fs.rm(testStoragePath, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Memory Operations', () => {
    it('should save and recall short-term memory', async () => {
      const memory: ShortTermMemory = {
        id: 'test-st',
        type: 'short-term',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(memory);
      const recalled = await manager.recall(memory.id);
      expect(recalled).toBeDefined();
      expect(recalled?.id).toBe(memory.id);
      if (recalled && 'type' in recalled) {
        expect(recalled.type).toBe('short-term');
      }
    });

    it('should promote short-term memory to working memory', async () => {
      const shortTermMemory: ShortTermMemory = {
        id: 'test-st',
        type: 'short-term',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(shortTermMemory);
      const workingMemory = await manager.promoteToWorking(shortTermMemory);
      
      expect(workingMemory).toBeDefined();
      expect(workingMemory.type).toBe('working');
      expect(workingMemory.state).toBe('active');
      expect(workingMemory.focus).toBe(0.8);

      const recalled = await manager.recall(workingMemory.id);
      expect(recalled).toBeDefined();
      if (recalled && 'type' in recalled) {
        expect(recalled.type).toBe('working');
      }
    });

    it('should promote working memory to long-term memory', async () => {
      const workingMemory: WorkingMemory = {
        id: 'test-wm',
        type: 'working',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        state: 'active',
        focus: 0.8,
        associations: [],
        processingContext: {
          currentTask: 'test-task',
          subTasks: [],
          progress: 0,
          dependencies: []
        }
      };

      await manager.save(workingMemory);
      const longTermMemory = await manager.promoteToLongTerm(workingMemory);
      
      expect(longTermMemory).toBeDefined();
      expect(longTermMemory.type).toBe('long-term');
      expect(longTermMemory.category).toBe('promoted');
      expect(longTermMemory.retrievalStrength).toBe(0.8);

      const recalled = await manager.recall(longTermMemory.id);
      expect(recalled).toBeDefined();
      if (recalled && 'type' in recalled) {
        expect(recalled.type).toBe('long-term');
      }
    });

    it('should demote working memory to short-term memory', async () => {
      const workingMemory: WorkingMemory = {
        id: 'test-wm',
        type: 'working',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        state: 'active',
        focus: 0.8,
        associations: [],
        processingContext: {
          currentTask: 'test-task',
          subTasks: [],
          progress: 0,
          dependencies: []
        }
      };

      await manager.save(workingMemory);
      const shortTermMemory = await manager.demoteToShortTerm(workingMemory);
      
      expect(shortTermMemory).toBeDefined();
      expect(shortTermMemory.type).toBe('short-term');
      expect(shortTermMemory.ttl).toBe(3600000);
      expect(shortTermMemory.processingStatus).toBe('pending');

      const recalled = await manager.recall(shortTermMemory.id);
      expect(recalled).toBeDefined();
      if (recalled && 'type' in recalled) {
        expect(recalled.type).toBe('short-term');
      }
    });
  });

  describe('Event Handling', () => {
    it('should emit events for memory operations', async () => {
      const events: any[] = [];
      eventBus.on('memory.saved', async (event) => { events.push(event); });
      eventBus.on('memory.recalled', async (event) => { events.push(event); });
      eventBus.on('memory.promoted', async (event) => { events.push(event); });

      const shortTermMemory: ShortTermMemory = {
        id: 'test-st',
        type: 'short-term',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(shortTermMemory);
      await manager.recall(shortTermMemory.id);
      await manager.promoteToWorking(shortTermMemory);

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].type).toBe('memory:saved');
      expect(events[1].type).toBe('memory:recalled');
      expect(events[2].type).toBe('memory:promoted');
    });
  });

  describe('Statistics', () => {
    it('should track memory statistics', async () => {
      const shortTermMemory: ShortTermMemory = {
        id: 'test-st',
        type: 'short-term',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: {},
          tags: ['test'],
          importance: 0.5,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(shortTermMemory);
      const stats = await manager.getStats();

      expect(stats.totalMemories).toBe(1);
      expect(stats.shortTermCount).toBe(1);
      expect(stats.workingCount).toBe(0);
      expect(stats.longTermCount).toBe(0);
    });
  });
}); 