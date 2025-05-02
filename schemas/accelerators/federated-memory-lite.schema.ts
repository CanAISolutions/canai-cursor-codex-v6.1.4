import { z } from 'zod';

export const FederatedMemoryConfigSchema = z.object({
  enabled: z.boolean(),
  routingMode: z.enum(['strict', 'fallback']),
  logLevel: z.string().optional(),
  conflictPolicyPath: z.string(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
