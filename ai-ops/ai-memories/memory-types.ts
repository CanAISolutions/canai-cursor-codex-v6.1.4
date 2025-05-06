/**
 * Memory Types
 * Defines core types for memory management and storage
 */

/**
 * Represents the type of memory being stored
 */
export enum MemoryType {
  USER_PREFERENCE = 'USER_PREFERENCE',
  INTERACTION_HISTORY = 'INTERACTION_HISTORY',
  CONTEXT_GOAL = 'CONTEXT_GOAL',
  EMOTIONAL_STATE = 'EMOTIONAL_STATE',
  SYSTEM_FEEDBACK = 'SYSTEM_FEEDBACK'
}

/**
 * Represents a memory payload with metadata
 */
export interface MemoryPayload {
  /** Unique identifier for the memory */
  id: string;
  
  /** Type of memory */
  type: MemoryType;
  
  /** User ID associated with the memory */
  userId: string;
  
  /** Session ID for context */
  sessionId: string;
  
  /** The actual memory content */
  content: string | Record<string, unknown>;
  
  /** Timestamp when the memory was created */
  timestamp: number;
  
  /** Trust score for the memory */
  trustScore: number;
  
  /** Context goal associated with the memory */
  contextGoal?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a memory hierarchy level
 */
export interface MemoryHierarchyLevel {
  /** Level name */
  name: string;
  
  /** Priority of this level (higher = more important) */
  priority: number;
  
  /** Maximum age of memories at this level (in ms) */
  maxAge: number;
  
  /** Minimum trust score required */
  minTrustScore: number;
}

/**
 * Represents a memory query
 */
export interface MemoryQuery {
  /** User ID to query for */
  userId: string;
  
  /** Session ID for context */
  sessionId?: string;
  
  /** Context goal to filter by */
  contextGoal?: string;
  
  /** Memory types to include */
  types?: MemoryType[];
  
  /** Minimum trust score */
  minTrustScore?: number;
  
  /** Maximum age (in ms) */
  maxAge?: number;
} 