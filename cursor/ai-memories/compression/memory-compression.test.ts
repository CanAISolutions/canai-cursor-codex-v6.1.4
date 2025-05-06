/**
 * ai-memories/compression/memory-compression.test.ts
 * 
 * Purpose:
 * Tests memory compression strategies and their impact on memory size and content.
 */

import { MemoryCompression } from './memory-compression';
import { ShortTermMemory, WorkingMemory, LongTermMemory, Memory } from '../memory-types';

describe('MemoryCompression', () => {
  let compression: MemoryCompression;

  beforeEach(() => {
    compression = new MemoryCompression();
  });

  describe('Compression Strategies', () => {
    it('should compress short-term memory with size reduction', () => {
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

    it('should compress working memory while preserving focus', () => {
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
        content: { data: 'test' },
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
      
      expect(compressed.isCompressed).toBe(true);
      expect(compressed.focus).toBe(memory.focus);
      expect(compressed.associations.length).toBe(1); // Only high importance
      expect(compressed.processingContext.subTasks.length).toBe(3); // Limited to 3
      expect(compressed.processingContext.dependencies.length).toBe(1); // Only required
    });

    it('should compress long-term memory with version history', () => {
      const memory: LongTermMemory = {
        id: 'test-lt',
        type: 'long-term',
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
        category: 'test',
        subCategories: ['cat1', 'cat2', 'cat3', 'cat4'],
        retrievalStrength: 0.8,
        lastRetrieved: Date.now(),
        retrievalCount: 5,
        compressionHistory: []
      };

      const compressed = compression.compress(memory);
      
      expect(compressed.isCompressed).toBe(true);
      expect(compressed.subCategories.length).toBe(3); // Limited to 3
      expect(compressed.compressionHistory.length).toBe(1);
      expect(compressed.retrievalStrength).toBe(memory.retrievalStrength);
    });
  });

  describe('Decompression', () => {
    it('should decompress memory to original form', () => {
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

      const compressed = compression.compress(memory);
      const decompressed = compression.decompress(compressed);

      expect(decompressed.isCompressed).toBe(false);
      expect(decompressed.compressionInfo).toBeUndefined();
      expect(decompressed.id).toBe(memory.id);
      expect(decompressed.type).toBe(memory.type);
    });
  });

  describe('Compression Metrics', () => {
    it('should calculate compression ratio correctly', () => {
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
          data: 'This is a very long text that should be compressed to reduce memory usage while maintaining core meaning'
        },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      const compressed = compression.compress(memory);
      const ratio = compression.getCompressionRatio(memory, compressed);

      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBe(compressed.compressionInfo.compressionRatio);
    });
  });
}); 