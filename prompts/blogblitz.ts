/**
 * blogblitz.ts
 * 
 * Purpose:
 * Simple TypeScript interface for BlogBlitz prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface BlogBlitzPrompt {
  topic: string;
  audience: string;
  tone: string;
  emotionalOutcome: string;
  bizName?: string;
  industry?: string;
  goal?: string;
  keyOfferings?: string;
  customerPain?: string;
  differentiator?: string;
  trustSignal?: string;
  desiredAction?: string;
  keyMessage?: string;
}

export const BLOGBLITZ_REQUIRED_FIELDS = [
  'topic',
  'audience',
  'tone',
  'emotionalOutcome'
] as const; 