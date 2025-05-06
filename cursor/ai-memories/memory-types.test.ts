/**
 * ai-memories/memory-types.test.ts
 * 
 * Purpose:
 * Tests the memory hierarchy interfaces and types for proper structure and type safety.
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
  MemoryStats
} from './memory-types';

describe('Memory Types', () => {
  describe('Base Memory Interface', () => {
    it('should have all required base properties', () => {
      const memory: Memory = {
        id: 'test-memory',
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
        accessCount: 0
      };

      expect(memory.id).toBeDefined();
      expect(memory.timestamp).toBeDefined();
      expect(memory.version).toBeDefined();
      expect(memory.metadata).toBeDefined();
      expect(memory.isCompressed).toBeDefined();
      expect(memory.lastAccessed).toBeDefined();
      expect(memory.accessCount).toBeDefined();
    });
  });

  describe('ShortTermMemory', () => {
    it('should extend base Memory with short-term specific properties', () => {
      const shortTermMemory: ShortTermMemory = {
        id: 'short-term-memory',
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
        type: 'short-term',
        content: { data: 'test' },
        ttl: 3600000,
        priority: 1,
        isProcessed: false,
        processingStatus: 'pending',
        processingAttempts: 0
      };

      expect(shortTermMemory.type).toBe('short-term');
      expect(shortTermMemory.ttl).toBeDefined();
      expect(shortTermMemory.priority).toBeDefined();
      expect(shortTermMemory.isProcessed).toBeDefined();
      expect(shortTermMemory.processingStatus).toBeDefined();
      expect(shortTermMemory.processingAttempts).toBeDefined();
    });
  });

  describe('WorkingMemory', () => {
    it('should extend base Memory with working memory specific properties', () => {
      const workingMemory: WorkingMemory = {
        id: 'working-memory',
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
        type: 'working',
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

      expect(workingMemory.type).toBe('working');
      expect(workingMemory.state).toBeDefined();
      expect(workingMemory.focus).toBeDefined();
      expect(workingMemory.associations).toBeDefined();
      expect(workingMemory.processingContext).toBeDefined();
    });
  });

  describe('LongTermMemory', () => {
    it('should extend base Memory with long-term specific properties', () => {
      const longTermMemory: LongTermMemory = {
        id: 'long-term-memory',
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
        type: 'long-term',
        content: { data: 'test' },
        category: 'test-category',
        subCategories: [],
        retrievalStrength: 0.8,
        lastRetrieved: Date.now(),
        retrievalCount: 0,
        compressionHistory: []
      };

      expect(longTermMemory.type).toBe('long-term');
      expect(longTermMemory.category).toBeDefined();
      expect(longTermMemory.subCategories).toBeDefined();
      expect(longTermMemory.retrievalStrength).toBeDefined();
      expect(longTermMemory.lastRetrieved).toBeDefined();
      expect(longTermMemory.retrievalCount).toBeDefined();
      expect(longTermMemory.compressionHistory).toBeDefined();
    });
  });

  describe('MemoryVersion', () => {
    it('should have all required version properties', () => {
      const version: MemoryVersion = {
        id: 'version-1',
        memoryId: 'test-memory',
        version: 1,
        timestamp: Date.now(),
        changes: [{
          field: 'content',
          oldValue: 'old',
          newValue: 'new'
        }],
        author: 'test-author',
        reason: 'test-reason'
      };

      expect(version.id).toBeDefined();
      expect(version.memoryId).toBeDefined();
      expect(version.version).toBeDefined();
      expect(version.timestamp).toBeDefined();
      expect(version.changes).toBeDefined();
      expect(version.author).toBeDefined();
      expect(version.reason).toBeDefined();
    });
  });

  describe('MemoryCompression', () => {
    it('should have all required compression properties', () => {
      const compression: MemoryCompression = {
        method: 'lossless',
        algorithm: 'test-algorithm',
        parameters: {},
        originalSize: 1000,
        compressedSize: 500,
        compressionRatio: 0.5
      };

      expect(compression.method).toBeDefined();
      expect(compression.algorithm).toBeDefined();
      expect(compression.parameters).toBeDefined();
      expect(compression.originalSize).toBeDefined();
      expect(compression.compressedSize).toBeDefined();
      expect(compression.compressionRatio).toBeDefined();
    });
  });

  describe('MemoryRetrieval', () => {
    it('should have all required retrieval properties', () => {
      const retrieval: MemoryRetrieval = {
        query: 'test-query',
        filters: {},
        limit: 10,
        offset: 0,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      };

      expect(retrieval.query).toBeDefined();
      expect(retrieval.filters).toBeDefined();
      expect(retrieval.limit).toBeDefined();
      expect(retrieval.offset).toBeDefined();
      expect(retrieval.sortBy).toBeDefined();
      expect(retrieval.sortOrder).toBeDefined();
    });
  });

  describe('MemoryEvent', () => {
    it('should have all required event properties', () => {
      const event: MemoryEvent = {
        type: 'memory:created',
        memoryId: 'test-memory',
        timestamp: Date.now(),
        data: {}
      };

      expect(event.type).toBeDefined();
      expect(event.memoryId).toBeDefined();
      expect(event.timestamp).toBeDefined();
      expect(event.data).toBeDefined();
    });
  });

  describe('MemoryStats', () => {
    it('should have all required statistics properties', () => {
      const stats: MemoryStats = {
        totalMemories: 100,
        shortTermCount: 20,
        workingCount: 30,
        longTermCount: 50,
        averageCompressionRatio: 0.5,
        memoryUsage: {
          shortTerm: 1000,
          working: 2000,
          longTerm: 5000
        },
        retrievalStats: {
          averageRetrievalTime: 100,
          hitRate: 0.8,
          missRate: 0.2
        },
        versionStats: {
          totalVersions: 200,
          averageVersionsPerMemory: 2
        }
      };

      expect(stats.totalMemories).toBeDefined();
      expect(stats.shortTermCount).toBeDefined();
      expect(stats.workingCount).toBeDefined();
      expect(stats.longTermCount).toBeDefined();
      expect(stats.averageCompressionRatio).toBeDefined();
      expect(stats.memoryUsage).toBeDefined();
      expect(stats.retrievalStats).toBeDefined();
      expect(stats.versionStats).toBeDefined();
    });
  });
}); 