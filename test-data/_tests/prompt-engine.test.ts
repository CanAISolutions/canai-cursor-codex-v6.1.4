// /test-data/_tests/prompt-engine.test.ts

/**
 * @codex-purpose: Validate all promptType .input.json files follow Codex schema rules
 * @codex-system: Prompt fulfillment layer + snapshot validator
 * @codex-critical: Prevents schema drift, field misalignment, or invalid input snapshots
 * @codex-verified: v1.4.2
 */

import { promptInputs } from '../prompts/prompt-input-index';

const REQUIRED_FIELDS = [
  'promptType',
  'industry',
  'audience',
  'tone',
  'goal',
  'productOrService',
  'brandName',
  'founderName',
  'promptInput'
];

describe('🧠 Codex Prompt Input Compliance', () => {
  Object.entries(promptInputs).forEach(([key, input]) => {
    describe(`promptType: ${key}`, () => {
      REQUIRED_FIELDS.forEach((field) => {
        test(`has required field: ${field}`, () => {
          expect(input).toHaveProperty(field);
          expect(input[field]).not.toBeUndefined();
          expect(input[field]).not.toBeNull();
        });
      });

      test(`promptType field matches object key`, () => {
        expect(input.promptType).toBe(key);
      });

      test(`has a _meta block with snapshotCompatible`, () => {
        expect(input).toHaveProperty('_meta');
        expect(input._meta.snapshotCompatible).toBe(true);
      });
    });
  });
});
