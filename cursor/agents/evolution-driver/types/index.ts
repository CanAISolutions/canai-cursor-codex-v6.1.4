/**
 * @file types/index.ts
 * @description Type definitions for the Evolution Driver Agent
 */

export interface EvolutionDriverConfig {
  patternRecognitionEnabled: boolean;
  refactoringEnabled: boolean;
  qualityTrackingEnabled: boolean;
  selfImprovementEnabled: boolean;
  minQualityThreshold: number;
  maxRefactoringComplexity: number;
  learningRate: number;
  proposalFrequency: 'hourly' | 'daily' | 'weekly';
}

export interface SystemMetrics {
  codeQuality: number;
  testCoverage: number;
  performance: number;
  maintainability: number;
  timestamp: Date;
}

export interface ImprovementProposal {
  id: string;
  type: 'pattern' | 'refactor' | 'quality' | 'capability';
  description: string;
  impact: number;
  complexity: number;
  changes: CodeChange[];
  reasoning: string;
  confidence: number;
  metadata: Record<string, any>;
}

export interface CodeChange {
  filepath: string;
  type: 'add' | 'modify' | 'delete';
  content: string;
  reason: string;
}

export interface PatternAnalysis {
  pattern: string;
  occurrences: number;
  files: string[];
  impact: number;
  suggestion: string;
}

export interface QualityTrend {
  metric: keyof SystemMetrics;
  values: number[];
  timestamps: Date[];
  trend: 'improving' | 'degrading' | 'stable';
  confidence: number;
  value: number;
  timestamp: Date;
}

export interface LearningOpportunity {
  context: string;
  pattern: string;
  success: boolean;
  improvement: string;
  confidence: number;
}

export interface EvolutionMetrics {
  proposalsGenerated: number;
  proposalsApplied: number;
  qualityImprovements: number;
  patternsIdentified: number;
  learningOpportunities: number;
  timestamp: Date;
} 