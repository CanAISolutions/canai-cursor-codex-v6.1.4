export interface DebugConfig {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxRetries: number;
  timeoutMs: number;
  includeStackTrace: boolean;
  maxLogSize: number;
  trustThreshold: number;
  validationRules: {
    requireStackTrace: boolean;
    requireContext: boolean;
    maxMessageLength: number;
  };
} 