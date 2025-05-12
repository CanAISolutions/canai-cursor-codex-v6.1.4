/**
 * TrustScore type definition
 * @version 2.7.9
 */

export interface TrustScore {
  value: number;
  timestamp: string;
  factors: TrustFactor[];
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface TrustFactor {
  name: string;
  weight: number;
  value: number;
  impact: number;
} 