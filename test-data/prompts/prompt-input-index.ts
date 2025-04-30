// /test-data/prompts/prompt-input-index.ts

/**
 * @codex-purpose: Provide centralized imports for all promptType input files
 * @codex-system: Prompt Fulfillment QA + Snapshot Testing Layer
 * @codex-critical: Enables CI tools, test runners, and Copilot validators to load prompt inputs consistently
 * @codex-verified: v1.4.2
 */

import ai_blueprint from './ai-blueprint.input.json';
import ai_brand_identity from './ai-brand-identity.input.json';
import business_plan from './business-plan.input.json';
import email_campaign from './email-campaign.input.json';
import reverse_strategy from './reverse-strategy.input.json';
import site_audit from './site-audit.input.json';
import social_content from './social-content.input.json';

export const promptInputs = {
  ai_blueprint,
  ai_brand_identity,
  business_plan,
  email_campaign,
  reverse_strategy,
  site_audit,
  social_content
};
