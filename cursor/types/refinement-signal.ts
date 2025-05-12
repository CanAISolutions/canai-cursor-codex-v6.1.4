/**
 * RefinementSignal type definition
 * @version 2.7.9
 */

export interface RefinementSignal {
  timestamp: string;
  confidence: number;
  insights: Insight[];
  recommendations: Recommendation[];
  trustImpact: number;
  metadata: {
    [key: string]: any;
  };
}

export interface Insight {
  type: string;
  description: string;
  impact: number;
  confidence: number;
}

export interface Recommendation {
  type: string;
  description: string;
  priority: number;
  impact: number;
  implementation: string;
} 