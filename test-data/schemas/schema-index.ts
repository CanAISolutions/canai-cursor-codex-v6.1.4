// /test-data/schemas/schema-index.ts

/**
 * @codex-purpose: Import all validation schemas into a centralized reference object
 * @codex-system: Snapshot Validator + Prompt QA Engine
 * @codex-critical: Enables Copilot, CI, and test runners to load schemas consistently
 * @codex-verified: v1.4.2
 */

import copilotSnapshotRules from './copilot-snapshot-rules.json';
import enhancerLogicSchema from './enhancer-logic-schema.json';
import fallbackScenarioSchema from './fallback-scenario-schema.json';
import feedbackSchema from './feedback-schema.json';
import fieldMapSchema from './field-map-schema.json';
import promptOutputShapeSchema from './prompt-output-shape-schema.json';
import promptTypeRules from './prompt-type-rules.json';
import sessionMetadataSchema from './session-metadata-schema.json';
import tokenCostThresholds from './token-cost-thresholds.json';

export const schemas = {
  copilotSnapshotRules,
  enhancerLogicSchema,
  fallbackScenarioSchema,
  feedbackSchema,
  fieldMapSchema,
  promptOutputShapeSchema,
  promptTypeRules,
  sessionMetadataSchema,
  tokenCostThresholds
};
