export interface TrustScoreFactors {
  codeQuality: number;
  testCoverage: number;
  documentation: number;
  maintainability: number;
}

export interface TrustScore {
  score: number;
  confidence: number;
  factors: TrustScoreFactors;
  timestamp: Date;
}

export type TrustLevel = 'high' | 'medium' | 'low';

export interface PipelineError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  source: string;
  stack?: string;
  errorType: string;
  name: string;
}

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
  error?: PipelineError;
} 