import { z } from 'zod';

export const SmartPromptScoreConfigSchema = z.object({
  enabled: z.boolean(),
  scoringWeightsPath: z.string(),
  thresholds: z.record(z.number()),
  logLevel: z.string().optional(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
