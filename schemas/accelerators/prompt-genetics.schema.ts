import { z } from 'zod';

export const PromptGeneticsConfigSchema = z.object({
  enabled: z.boolean(),
  logLevel: z.string().optional(),
  lineageTracking: z.boolean(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
