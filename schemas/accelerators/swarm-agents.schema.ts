import { z } from 'zod';

export const SwarmAgentConfigSchema = z.object({
  enabled: z.boolean(),
  agentTypes: z.array(z.string()),
  decisionPolicyPath: z.string(),
  logLevel: z.string().optional(),
  consensusThreshold: z.number().optional(),
  metricsEnabled: z.boolean().optional(),
  feedbackCapture: z
    .object({
      stateKey: z.string(),
      logFile: z.string(),
    })
    .optional(),
});
