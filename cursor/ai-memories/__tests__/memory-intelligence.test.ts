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
  MemoryType,
  CompressionInfo
} from '../memory-types';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock EventBus with proper typing
jest.mock('../../utils/event-bus', () => {
  return {
    EventBus: jest.fn().mockImplementation(() => ({
      publish: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    }))
  };
});

// Mock fs/promises with more complete implementation
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  rm: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(JSON.stringify({})),
  readdir: jest.fn().mockResolvedValue([]),
  access: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({
    isDirectory: () => true,
    size: 1024
  }),
  unlink: jest.fn().mockResolvedValue(undefined)
}));

describe('Memory Intelligence', () => {
  let eventBus: jest.Mocked<EventBus>;
  let manager: MemoryHierarchyManager;
  let retrieval: MemoryRetrieval;
  let compression: MemoryCompression;
  let testStoragePath: string;

  beforeEach(async () => {
    // Create test storage directory
    testStoragePath = path.join(__dirname, 'test-storage');
    await fs.mkdir(testStoragePath, { recursive: true });

    eventBus = new EventBus() as jest.Mocked<EventBus>;
    manager = new MemoryHierarchyManager(eventBus, testStoragePath);
    retrieval = new MemoryRetrieval(eventBus, manager);
    compression = new MemoryCompression();
    await manager.initialize();
  });

  afterEach(async () => {
    await manager.dispose();
    try {
      await fs.rm(testStoragePath, { recursive: true, force: true });
    } catch (error) {
      console.warn('Cleanup warning:', error);
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

      const compressed = await compression.compress(memory);
      
      expect(compressed.isCompressed).toBe(true);
      expect(compressed.compressionInfo).toBeDefined();
      expect((compressed.compressionInfo as CompressionInfo).compressionRatio).toBeGreaterThan(1);
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

      const compressed = await compression.compress(memory);
      const decompressed = await compression.decompress(compressed) as WorkingMemory;

      expect(decompressed.content.task).toBe(memory.content.task);
      expect(decompressed.focus).toBe(memory.focus);
      expect(decompressed.state).toBe(memory.state);
    });

    it('should handle compression errors gracefully', async () => {
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
        content: { 
          data: 'test'
        },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      // Mock a compression error
      const mockCompress = jest.spyOn(compression, 'compress');
      mockCompress.mockImplementationOnce(() => {
        throw new Error('Compression failed');
      });

      await expect(compression.compress(memory)).rejects.toThrow('Compression failed');
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'memory:compression:error',
          data: expect.objectContaining({
            error: 'Compression failed'
          })
        }),
        'high'
      );
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

    it('should handle retrieval errors gracefully', async () => {
      // Mock a retrieval error
      const mockRecall = jest.spyOn(manager, 'recall');
      mockRecall.mockRejectedValueOnce(new Error('Retrieval failed'));

      await expect(retrieval.recallByType('short-term')).rejects.toThrow('Retrieval failed');
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'memory:retrieval:error',
          data: expect.objectContaining({
            error: 'Retrieval failed'
          })
        }),
        'high'
      );
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
        lastAccessed: Date.now() - 12 * 60 * 60 * 1000, // 12 hours old
        accessCount: 1,
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      await manager.save(degradedMemory);

      // Attempt recovery
      const recovered = await manager.recall('degraded-1');
      expect(recovered).toBeDefined();
      expect(recovered?.metadata.confidence).toBeGreaterThan(degradedMemory.metadata.confidence);
    });
  });
}); 