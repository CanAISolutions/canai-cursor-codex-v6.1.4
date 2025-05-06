/**
 * ai-memories/memory-schema.ts
 * 
 * Purpose:
 * Defines types and interfaces for memory records.
 * Provides schema validation for memory data.
 */

/**
 * Memory record metadata
 */
export interface MemoryMetadata {
  trustScore: number;
  alignmentScore: number;
  volatilityScore: number;
  timestamp: number;
  tags: string[];
  source: string;
  confidence: number;
  context?: Record<string, unknown>;
}

/**
 * Memory record
 */
export interface MemoryRecord {
  id: string;
  type: 'short-term' | 'working' | 'long-term';
  content: string;
  metadata: MemoryMetadata;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  parentId?: string;
  children?: string[];
  influence?: {
    trust: number;
    alignment: number;
    volatility: number;
  };
} 