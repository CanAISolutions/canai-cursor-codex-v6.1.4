import { z } from 'zod';

export const CopilotFeedbackConfigSchema = z.object({
  enabled: z.boolean(),
  interventionTags: z.array(z.string()),
  logLevel: z.string().optional(),
  feedbackRulesPath: z.string(),
  policyPath: z.string(),
});
