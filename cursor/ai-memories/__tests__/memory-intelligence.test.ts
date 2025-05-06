/**
 * ai-memories/__tests__/memory-intelligence.test.ts
 * 
 * Purpose:
 * Tests memory compression and retrieval intelligence features.
 */

import { EventBus } from '../../utils/event-bus';
import { MemoryHierarchyManager } from '../memory-hierarchy-manager';
import { MemoryRetrieval } from '../retrieval/memory-retrieval';
import { MemoryCompression } from '../compression/memory-compression';
import {
  ShortTermMemory,
  WorkingMemory,
  LongTermMemory,
  MemoryType
} from '../memory-types';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Memory Intelligence', () => {
  let eventBus: EventBus;
  let manager: MemoryHierarchyManager;
  let retrieval: MemoryRetrieval;
  let compression: MemoryCompression;
  let testStoragePath: string;

  beforeEach(async () => {
    eventBus = new EventBus();
    testStoragePath = path.join(__dirname, 'test-storage');
    manager = new MemoryHierarchyManager(eventBus, testStoragePath);
    retrieval = new MemoryRetrieval(eventBus, manager);
    compression = new MemoryCompression();
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

  describe('Memory Compression', () => {
    it('should compress short-term memory with size reduction', async () => {
      const memory: ShortTermMemory = {
        id: 'test-st',
        type: 'short-term',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.8,
          context: { detailed: 'context' },
          tags: ['test', 'compression'],
          importance: 0.5,
          relatedMemories: ['mem1', 'mem2']
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 0,
        content: { 
          data: 'This is a very long text that should be compressed to reduce memory usage while maintaining core meaning',
          extra: { nested: 'data' }
        },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      const compressed = compression.compress(memory);
      
      expect(compressed.isCompressed).toBe(true);
      expect(compressed.compressionInfo).toBeDefined();
      expect(compressed.compressionInfo.compressionRatio).toBeGreaterThan(1);
      expect(Object.keys(compressed.metadata).length).toBeLessThanOrEqual(3);
    });

    it('should retain core meaning after compression', async () => {
      const memory: WorkingMemory = {
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
        content: { 
          task: 'Process user request',
          details: 'Handle complex user interaction with multiple steps'
        },
        state: 'active',
        focus: 0.8,
        associations: [
          { id: 'assoc1', importance: 0.9, type: 'related' },
          { id: 'assoc2', importance: 0.2, type: 'related' }
        ],
        processingContext: {
          currentTask: 'test-task',
          subTasks: ['sub1', 'sub2', 'sub3', 'sub4'],
          progress: 0.5,
          dependencies: [
            { id: 'dep1', required: true },
            { id: 'dep2', required: false }
          ]
        }
      };

      const compressed = compression.compress(memory);
      const decompressed = compression.decompress(compressed) as WorkingMemory;

      expect(decompressed.content.task).toBe(memory.content.task);
      expect(decompressed.focus).toBe(memory.focus);
      expect(decompressed.state).toBe(memory.state);
    });
  });

  describe('Memory Retrieval', () => {
    beforeEach(async () => {
      // Add test memories
      const shortTermMemory: ShortTermMemory = {
        id: 'st-1',
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
        accessCount: 5,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      const workingMemory: WorkingMemory = {
        id: 'wm-1',
        type: 'working',
        timestamp: Date.now(),
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.9,
          context: {},
          tags: ['test'],
          importance: 0.7,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now(),
        accessCount: 10,
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

      await manager.save(shortTermMemory);
      await manager.save(workingMemory);
    });

    it('should retrieve memories by type', async () => {
      const shortTermMemories = await retrieval.recallByType('short-term');
      const workingMemories = await retrieval.recallByType('working');

      expect(shortTermMemories.length).toBe(1);
      expect(workingMemories.length).toBe(1);
      expect(shortTermMemories[0].type).toBe('short-term');
      expect(workingMemories[0].type).toBe('working');
    });

    it('should retrieve memories by trust delta', async () => {
      const highTrustMemories = await retrieval.recallByTrustDelta(0.8);
      const lowTrustMemories = await retrieval.recallByTrustDelta(0.9);

      expect(highTrustMemories.length).toBeGreaterThan(0);
      expect(lowTrustMemories.length).toBe(0);
    });

    it('should retrieve recent memories', async () => {
      const recentMemories = await retrieval.recallRecent(5);
      expect(recentMemories.length).toBeLessThanOrEqual(5);
      expect(recentMemories[0].lastAccessed).toBeGreaterThanOrEqual(recentMemories[1]?.lastAccessed || 0);
    });
  });

  describe('Recovery Scenarios', () => {
    it('should handle degraded memory state', async () => {
      // Create a memory with low trust
      const degradedMemory: ShortTermMemory = {
        id: 'degraded-1',
        type: 'short-term',
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 24 hours old
        version: 1,
        metadata: {
          source: 'test',
          confidence: 0.3,
          context: {},
          tags: ['test'],
          importance: 0.2,
          relatedMemories: []
        },
        isCompressed: false,
        lastAccessed: Date.now() - 24 * 60 * 60 * 1000,
        accessCount: 1,
        content: { data: 'degraded' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(degradedMemory);

      // Try to retrieve with high trust delta
      const highTrustMemories = await retrieval.recallByTrustDelta(0.8);
      expect(highTrustMemories.find(m => m.id === 'degraded-1')).toBeUndefined();

      // Try to retrieve with low trust delta
      const lowTrustMemories = await retrieval.recallByTrustDelta(0.2);
      expect(lowTrustMemories.find(m => m.id === 'degraded-1')).toBeDefined();
    });
  });
}); 