export interface PipelineError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  source: string;
  stack?: string;
}

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  error?: PipelineError;
  meta?: Record<string, any>;
} 