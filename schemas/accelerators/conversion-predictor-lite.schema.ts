import { z } from 'zod';

export const ConversionPredictorConfigSchema = z.object({
  enabled: z.boolean(),
  scoreThreshold: z.number(),
  fallbackAction: z.enum(['halt', 'warn']),
  logLevel: z.string(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
