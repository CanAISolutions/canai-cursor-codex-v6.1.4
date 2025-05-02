// File: /schemas/accelerators/emotional-foresight-lite.schema.ts
import { z } from 'zod';

export const EmotionalForesightConfigSchema = z.object({
  enabled: z.boolean(),
  modelVariant: z.string(),
  triggerThreshold: z.number(),
  logLevel: z.string().optional(),
  interventionPolicyPath: z.string(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
