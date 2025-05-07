/**
 * @file types.ts
 * @description Type definitions for evolution driver
 */

export interface SystemMetrics {
  codeQuality: number;
  testCoverage: number;
  performance: number;
  maintainability: number;
  timestamp: string;
}

export interface QualityTrend {
  metric: keyof SystemMetrics;
  trend: 'improving' | 'stable' | 'degrading';
  confidence: number;
  value: number;
  timestamp: string;
}

export interface ImprovementProposal {
  type: string;
  priority: number;
  pattern: string;
  description: string;
  impactDetails: {
    complexity: number;
    maintainability: number;
  };
  files: string[];
  suggestions: string[];
}

export interface PatternAnalysis {
  pattern: string;
  description: string;
  impact: number;
  complexity: number;
  files: string[];
  suggestions: string[];
}

export interface EvolutionDriverConfig {
  minQualityScore: number;
  maxComplexity: number;
  patternRecognitionEnabled: boolean;
  metricsThreshold: {
    codeQuality: number;
    testCoverage: number;
    performance: number;
    maintainability: number;
  };
} 