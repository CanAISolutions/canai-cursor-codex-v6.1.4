/**
 * ai-memories/memory-types.ts
 * 
 * Purpose:
 * Defines the core types and interfaces for the memory system.
 */

import { EventBus } from '../utils/event-bus';

export type MemoryType = 'short-term' | 'working' | 'long-term';

export interface Memory {
  id: string;
  type: MemoryType;
  timestamp: number;
  version: number;
  metadata: MemoryMetadata;
  isCompressed: boolean;
  lastAccessed: number;
  accessCount: number;
  content: any;
}

export interface MemoryMetadata {
  source: string;
  confidence: number;
  context: Record<string, any>;
  tags: string[];
  importance: number;
  relatedMemories: string[];
}

export interface ShortTermMemory extends Memory {
  type: 'short-term';
  ttl: number;
  priority: number;
  isProcessed: boolean;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingAttempts: number;
}

export interface WorkingMemory extends Memory {
  type: 'working';
  state: 'active' | 'archived';
  focus: number;
  associations: MemoryAssociation[];
  processingContext: ProcessingContext;
}

export interface LongTermMemory extends Memory {
  type: 'long-term';
  category: string;
  subCategories: string[];
  retrievalStrength: number;
  lastRetrieved: number;
  retrievalCount: number;
  compressionHistory: CompressionRecord[];
}

export interface MemoryAssociation {
  id: string;
  importance: number;
  type: string;
}

export interface ProcessingContext {
  currentTask: string;
  subTasks: string[];
  progress: number;
  dependencies: ProcessingDependency[];
}

export interface ProcessingDependency {
  id: string;
  required: boolean;
}

export interface CompressionRecord {
  timestamp: number;
  ratio: number;
  method: string;
}

export interface CompressionInfo {
  originalSize: number;
  compressionRatio: number;
  compressionMethod: string;
  compressionTimestamp: number;
}

export interface CompressedMemory extends Memory {
  compressionInfo: CompressionInfo;
  category?: string;
  subCategories?: string[];
  retrievalStrength?: number;
  lastRetrieved?: number;
  retrievalCount?: number;
  compressionHistory?: CompressionRecord[];
  state?: 'active' | 'archived';
  focus?: number;
  associations?: MemoryAssociation[];
  processingContext?: ProcessingContext;
  ttl?: number;
  priority?: number;
  isProcessed?: boolean;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  processingAttempts?: number;
}

export interface MemoryVersion {
  id: string;
  memoryId: string;
  version: number;
  timestamp: number;
  changes: MemoryChange[];
  author: string;
  reason: string;
}

export interface MemoryChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface MemoryEvent {
  type: MemoryEventType;
  memoryId: string;
  timestamp: number;
  data: any;
}

export type MemoryEventType = 
  | 'memory:saved'
  | 'memory:recalled'
  | 'memory:updated'
  | 'memory:deleted'
  | 'memory:promoted'
  | 'memory:demoted'
  | 'memory:compressed'
  | 'memory:decompressed'
  | 'memory:error'
  | 'memory:stats:updated';

export interface MemoryStats {
  totalMemories: number;
  shortTermCount: number;
  workingCount: number;
  longTermCount: number;
  averageCompressionRatio: number;
  memoryUsage: {
    shortTerm: number;
    working: number;
    longTerm: number;
  };
  retrievalStats: {
    averageRetrievalTime: number;
    hitRate: number;
    missRate: number;
  };
  versionStats: {
    totalVersions: number;
    averageVersionsPerMemory: number;
  };
}

// Memory hierarchy manager interface
export interface MemoryHierarchyManager {
  eventBus: EventBus;
  
  // Memory operations
  store(memory: Memory): Promise<void>;
  retrieve(id: string): Promise<Memory | null>;
  update(id: string, updates: Partial<Memory>): Promise<void>;
  delete(id: string): Promise<void>;
  
  // Version control
  createVersion(memoryId: string, changes: Partial<Memory>): Promise<MemoryVersion>;
  getVersions(memoryId: string): Promise<MemoryVersion[]>;
  rollback(memoryId: string, version: number): Promise<void>;
  
  // Compression
  compress(memory: Memory): Promise<MemoryCompression>;
  decompress(memory: Memory): Promise<Memory>;
  
  // Retrieval
  search(query: MemoryRetrieval): Promise<Memory[]>;
  getRelated(memoryId: string): Promise<Memory[]>;
  
  // Memory transfer between levels
  promoteToWorking(shortTermMemory: ShortTermMemory): Promise<WorkingMemory>;
  promoteToLongTerm(workingMemory: WorkingMemory): Promise<LongTermMemory>;
  demoteToShortTerm(workingMemory: WorkingMemory): Promise<ShortTermMemory>;
  
  // Memory maintenance
  cleanup(): Promise<void>;
  optimize(): Promise<void>;
  backup(): Promise<void>;
}

// Memory compression interface
export interface MemoryCompression {
  method: 'lossless' | 'lossy';
  algorithm: string;
  parameters: Record<string, any>;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// Memory retrieval interface
export interface MemoryRetrieval {
  query: string;
  filters: Record<string, any>;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
} 