/**
 * ad_amplify.ts
 * 
 * Purpose:
 * Simple TypeScript interface for Ad Amplify prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface AdAmplifyPrompt {
  platform: string;
  productOffer: string;
  audience: string;
  tone: string;
  emotionalGoal: string;
  bizName?: string;
  industry?: string;
  goal?: string;
  keyOfferings?: string;
  customerPain?: string;
  differentiator?: string;
  trustSignal?: string;
  desiredAction?: string;
  keyMessage?: string;
  promoOffer?: string;
  usp?: string;
}

export const AD_AMPLIFY_REQUIRED_FIELDS = [
  'platform',
  'productOffer',
  'audience',
  'tone',
  'emotionalGoal'
] as const; 