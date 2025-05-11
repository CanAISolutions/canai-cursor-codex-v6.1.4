// LogEntry interface for Clarity Logging Protocol
export interface LogEntry {
  timestamp: string;
  phase: string;
  module: string;
  action: string;
  outputPaths: string[];
  flags?: string[];
  notes?: string;
} 