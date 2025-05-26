/**
 * profile_makeover.ts
 * 
 * Purpose:
 * Simple TypeScript interface for Profile Makeover prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface ProfileMakeoverPrompt {
  platform: string;
  currentBio?: string;
  businessType: string;
  tone: string;
  emotionalGoal: string;
  bizName?: string;
  audience?: string;
  keyOfferings?: string;
  industry?: string;
  goal?: string;
  customerPain?: string;
  differentiator?: string;
  trustSignal?: string;
  usp?: string;
}

export const PROFILE_MAKEOVER_REQUIRED_FIELDS = [
  'platform',
  'businessType', 
  'tone',
  'emotionalGoal'
] as const; 