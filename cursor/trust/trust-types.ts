/**
 * trust/trust-types.ts
 * 
 * Purpose:
 * Defines core types for trust scoring and evaluation.
 * Provides type safety for trust-related operations.
 */

/**
 * Represents a trust score with its components
 */
export interface TrustScore {
  /** Overall trust score (0-1) */
  score: number;
  
  /** Timestamp of the score calculation */
  timestamp: number;
  
  /** Individual trust factors */
  factors: {
    /** User history trust score (0-1) */
    userHistory: number;
    
    /** Content quality trust score (0-1) */
    contentQuality: number;
    
    /** System feedback trust score (0-1) */
    systemFeedback: number;
    
    /** Additional trust factors */
    [key: string]: number;
  };
  
  /** Whether the score meets the minimum threshold */
  meetsThreshold: boolean;
  
  /** Additional metadata */
  metadata?: {
    /** Reason for trust score */
    reason?: string;
    
    /** Confidence in the score (0-1) */
    confidence?: number;
    
    /** Additional metadata */
    [key: string]: unknown;
  };
} 