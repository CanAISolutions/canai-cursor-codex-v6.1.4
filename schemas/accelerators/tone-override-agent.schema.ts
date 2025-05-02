import { z } from 'zod';

export const ToneOverrideConfigSchema = z.object({
  enabled: z.boolean(),
  toneThreshold: z.number(),
  fallbackTone: z.string(),
  allowOverride: z.boolean(),
  toneProfilePath: z.string(),
  logLevel: z.string().optional(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
