/**
 * ai-memories/compression/memory-compression.ts
 * 
 * Purpose:
 * Implements memory compression strategies to optimize storage and retrieval.
 */

import { Memory, ShortTermMemory, WorkingMemory, LongTermMemory, CompressedMemory } from '../memory-types';

export interface CompressionStrategy {
  compress(memory: Memory): CompressedMemory;
  decompress(compressed: CompressedMemory): Memory;
  getCompressionRatio(original: Memory, compressed: CompressedMemory): number;
}

export class MemoryCompression implements CompressionStrategy {
  private readonly maxMetadataFields = 3;
  private readonly minImportanceThreshold = 0.3;
  private readonly maxTextLength = 1000;

  /**
   * Compresses a memory using appropriate strategy based on type
   */
  compress(memory: Memory): CompressedMemory {
    switch (memory.type) {
      case 'short-term':
        return this.compressShortTerm(memory as ShortTermMemory);
      case 'working':
        return this.compressWorking(memory as WorkingMemory);
      case 'long-term':
        return this.compressLongTerm(memory as LongTermMemory);
      default:
        throw new Error(`Unsupported memory type: ${(memory as any).type}`);
    }
  }

  /**
   * Decompresses a memory back to its original form
   */
  decompress(compressed: CompressedMemory): Memory {
    switch (compressed.type) {
      case 'short-term':
        return this.decompressShortTerm(compressed);
      case 'working':
        return this.decompressWorking(compressed);
      case 'long-term':
        return this.decompressLongTerm(compressed);
      default:
        throw new Error(`Unsupported compressed memory type: ${compressed.type}`);
    }
  }

  /**
   * Calculates compression ratio between original and compressed memory
   */
  getCompressionRatio(original: Memory, compressed: CompressedMemory): number {
    const originalSize = JSON.stringify(original).length;
    const compressedSize = JSON.stringify(compressed).length;
    return originalSize / compressedSize;
  }

  /**
   * Compresses short-term memory by:
   * - Truncating metadata to essential fields
   * - Summarizing content if text
   * - Removing low-importance fields
   */
  private compressShortTerm(memory: ShortTermMemory): CompressedMemory {
    const compressed: CompressedMemory = {
      id: memory.id,
      type: 'short-term',
      timestamp: memory.timestamp,
      version: memory.version,
      metadata: this.compressMetadata(memory.metadata),
      isCompressed: true,
      lastAccessed: memory.lastAccessed,
      accessCount: memory.accessCount,
      content: this.compressContent(memory.content),
      ttl: memory.ttl,
      priority: memory.priority,
      isProcessed: memory.isProcessed,
      processingStatus: memory.processingStatus,
      processingAttempts: memory.processingAttempts,
      compressionInfo: {
        originalSize: JSON.stringify(memory).length,
        compressionRatio: 0, // Will be set after compression
        compressionMethod: 'short-term-strategy',
        compressionTimestamp: Date.now()
      }
    };

    compressed.compressionInfo.compressionRatio = this.getCompressionRatio(memory, compressed);
    return compressed;
  }

  /**
   * Compresses working memory by:
   * - Focusing on active state and high-focus memories
   * - Simplifying processing context
   * - Maintaining essential associations
   */
  private compressWorking(memory: WorkingMemory): CompressedMemory {
    const compressed: CompressedMemory = {
      id: memory.id,
      type: 'working',
      timestamp: memory.timestamp,
      version: memory.version,
      metadata: this.compressMetadata(memory.metadata),
      isCompressed: true,
      lastAccessed: memory.lastAccessed,
      accessCount: memory.accessCount,
      content: this.compressContent(memory.content),
      state: memory.state,
      focus: memory.focus,
      associations: memory.associations.filter(a => a.importance > this.minImportanceThreshold),
      processingContext: {
        currentTask: memory.processingContext.currentTask,
        subTasks: memory.processingContext.subTasks.slice(0, 3), // Keep only top 3 subtasks
        progress: memory.processingContext.progress,
        dependencies: memory.processingContext.dependencies.filter(d => d.required)
      },
      compressionInfo: {
        originalSize: JSON.stringify(memory).length,
        compressionRatio: 0,
        compressionMethod: 'working-strategy',
        compressionTimestamp: Date.now()
      }
    };

    compressed.compressionInfo.compressionRatio = this.getCompressionRatio(memory, compressed);
    return compressed;
  }

  /**
   * Compresses long-term memory by:
   * - Maintaining core semantic content
   * - Preserving version history
   * - Optimizing retrieval metadata
   */
  private compressLongTerm(memory: LongTermMemory): CompressedMemory {
    const compressed: CompressedMemory = {
      id: memory.id,
      type: 'long-term',
      timestamp: memory.timestamp,
      version: memory.version,
      metadata: this.compressMetadata(memory.metadata),
      isCompressed: true,
      lastAccessed: memory.lastAccessed,
      accessCount: memory.accessCount,
      content: this.compressContent(memory.content),
      category: memory.category,
      subCategories: memory.subCategories.slice(0, 3), // Keep top 3 categories
      retrievalStrength: memory.retrievalStrength,
      lastRetrieved: memory.lastRetrieved,
      retrievalCount: memory.retrievalCount,
      compressionHistory: [
        ...memory.compressionHistory,
        {
          timestamp: Date.now(),
          ratio: 0, // Will be set after compression
          method: 'long-term-strategy'
        }
      ],
      compressionInfo: {
        originalSize: JSON.stringify(memory).length,
        compressionRatio: 0,
        compressionMethod: 'long-term-strategy',
        compressionTimestamp: Date.now()
      }
    };

    compressed.compressionInfo.compressionRatio = this.getCompressionRatio(memory, compressed);
    return compressed;
  }

  /**
   * Compresses metadata by keeping only essential fields
   */
  private compressMetadata(metadata: any): any {
    const essentialFields = ['source', 'confidence', 'importance'];
    const compressed: any = {};
    
    essentialFields.slice(0, this.maxMetadataFields).forEach(field => {
      if (metadata[field] !== undefined) {
        compressed[field] = metadata[field];
      }
    });

    return compressed;
  }

  /**
   * Compresses content based on type
   */
  private compressContent(content: any): any {
    if (typeof content === 'string') {
      return content.length > this.maxTextLength 
        ? content.substring(0, this.maxTextLength) + '...'
        : content;
    }
    
    if (typeof content === 'object') {
      const compressed: any = {};
      for (const [key, value] of Object.entries(content)) {
        if (typeof value === 'string') {
          compressed[key] = value.length > this.maxTextLength
            ? value.substring(0, this.maxTextLength) + '...'
            : value;
        } else {
          compressed[key] = value;
        }
      }
      return compressed;
    }

    return content;
  }

  /**
   * Decompresses short-term memory
   */
  private decompressShortTerm(compressed: CompressedMemory): ShortTermMemory {
    return {
      ...compressed,
      isCompressed: false,
      compressionInfo: undefined
    } as ShortTermMemory;
  }

  /**
   * Decompresses working memory
   */
  private decompressWorking(compressed: CompressedMemory): WorkingMemory {
    return {
      ...compressed,
      isCompressed: false,
      compressionInfo: undefined
    } as WorkingMemory;
  }

  /**
   * Decompresses long-term memory
   */
  private decompressLongTerm(compressed: CompressedMemory): LongTermMemory {
    return {
      ...compressed,
      isCompressed: false,
      compressionInfo: undefined
    } as LongTermMemory;
  }
} 