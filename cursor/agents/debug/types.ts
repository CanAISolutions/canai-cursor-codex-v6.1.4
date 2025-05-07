/**
 * debug/types.ts
 * Core type definitions for debug module
 */

export interface DebugConfig {
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  maxRetries: number;
  timeoutMs: number;
  includeStackTrace: boolean;
  filters?: string[];
  maxLogSize: number;
}

export interface PipelineError {
  code: string;
  message: string;
  errorType: 'validation' | 'runtime' | 'system' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  context?: Record<string, any>;
}

export interface LogValidatorInput {
  level: DebugConfig['logLevel'];
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  error?: PipelineError;
}

export interface ValidationResult {
  isValid: boolean;
  errors: PipelineError[];
  warnings: string[];
  timestamp: number;
}

export interface DebugContext {
  config: DebugConfig;
  errors: PipelineError[];
  startTime: number;
  metadata: Record<string, any>;
}

// Re-export for module-level access
export * from './utils/log-validator';
export * from './core/trust-scorer'; 