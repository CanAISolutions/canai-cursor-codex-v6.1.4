/**
 * Trust Types
 * Defines types for trust scoring and validation
 */

/**
 * Represents a trust score with metadata
 */
export interface TrustScore {
  /** The trust score value (0-5) */
  score: number;
  
  /** Timestamp when the score was calculated */
  timestamp: number;
  
  /** Factors that influenced the score */
  factors: {
    /** User history factor (0-1) */
    userHistory: number;
    
    /** Content quality factor (0-1) */
    contentQuality: number;
    
    /** System feedback factor (0-1) */
    systemFeedback: number;
    
    /** Additional factors */
    [key: string]: number;
  };
  
  /** Whether the score meets the minimum threshold */
  meetsThreshold: boolean;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a trust score calculation request
 */
export interface TrustScoreRequest {
  /** User ID to calculate score for */
  userId: string;
  
  /** Session ID for context */
  sessionId?: string;
  
  /** Content to evaluate */
  content?: string | Record<string, unknown>;
  
  /** Minimum threshold required */
  minThreshold?: number;
  
  /** Additional context */
  context?: Record<string, unknown>;
} 