import { z } from 'zod';

export const AutoRollbackConfigSchema = z.object({
  enabled: z.boolean(),
  fallbackMode: z.enum(['soft', 'hard']),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']),
  policyPath: z.string(),
  triggerConditionsPath: z.string(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
