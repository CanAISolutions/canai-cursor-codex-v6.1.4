import { z } from 'zod';

export const ZombieHunterConfigSchema = z.object({
  enabled: z.boolean(),
  maxIdleMinutes: z.number(),
  rescueStrategy: z.enum(['prompt', 'replay', 'feedback']),
  logLevel: z.string().optional(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
