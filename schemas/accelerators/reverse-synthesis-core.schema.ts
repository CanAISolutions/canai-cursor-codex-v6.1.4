import { z } from 'zod';

export const ReverseSynthesisConfigSchema = z.object({
  enabled: z.boolean(),
  logLevel: z.string().optional(),
  synthesisPatternsPath: z.string(),
  traceLogging: z.boolean().optional(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
