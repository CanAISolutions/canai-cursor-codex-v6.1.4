export interface DebugConfig {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxLogSize: number;
  logRetentionDays: number;
  enableTelemetry: boolean;
  telemetryEndpoint?: string;
  allowedCommands: string[];
  blockedCommands: string[];
  trustScoreThreshold: number;
} 