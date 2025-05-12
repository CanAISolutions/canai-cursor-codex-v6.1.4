/**
 * MirrorInsight type definition
 * @version 2.7.9
 */

export interface MirrorInsight {
  timestamp: string;
  type: InsightType;
  description: string;
  impact: number;
  confidence: number;
  recommendations: Recommendation[];
  metadata: {
    [key: string]: any;
  };
}

export type InsightType = 
  | 'tone_shift'
  | 'motivator_change'
  | 'trust_dip'
  | 'emotional_drift'
  | 'friction_hotzone'
  | 'confidence_shift';

export interface Recommendation {
  type: string;
  description: string;
  priority: number;
  impact: number;
  implementation: string;
} 