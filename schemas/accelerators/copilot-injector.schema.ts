import { z } from 'zod';

export const CopilotInjectorConfigSchema = z.object({
  enabled: z.boolean(),
  triggerTags: z.array(z.string()),
  logLevel: z.string().optional(),
  feedbackPolicyPath: z.string(),
  injectThreshold: z.number().optional(),
});
