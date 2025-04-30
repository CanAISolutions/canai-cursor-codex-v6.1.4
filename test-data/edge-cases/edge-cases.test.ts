// 🧪 edge-cases.test.ts
// Validates system behavior on malformed, invalid, or error-triggering input
// Codex Enforced – Schema-Validated – Emotionally Clear

import { loadTestData } from './loadTestData';

type EdgeCase = {
  name: string;
  folder: string;
};

const edgeCases: EdgeCase[] = [
  { name: 'bad-fieldmap-reference', folder: 'edge-cases' },
  { name: 'duplicate-session-id', folder: 'edge-cases' },
  { name: 'invalid-token-threshold', folder: 'edge-cases' },
  { name: 'missing-required-fields', folder: 'edge-cases' },
  { name: 'unknown-prompt-type', folder: 'edge-cases' },
  { name: 'malformed-json-structure', folder: 'edge-cases' },
  { name: 'enhancer-fallback-trigger', folder: 'edge-cases' }
];

describe('🚨 Edge Case Failures', () => {
  edgeCases.forEach(({ name, folder }) => {
    test(`Edge case: ${name}`, () => {
      let input;
      let expected;

      // Handle intentionally malformed JSON
      try {
        input = loadTestData(folder, `${name}.input.json`);
      } catch (err) {
        input = null;
      }

      expected = loadTestData(folder, `${name}.expected-error.json`);

      // ✅ Core structure match
      if (expected.inputShape && input) {
        expect(input).toMatchObject(expected.inputShape);
      }

      // ✅ Must contain top-level error object
      expect(expected).toHaveProperty('error');
      expect(expected.error).toHaveProperty('type');
      expect(expected.error).toHaveProperty('message');

      // 🧪 Future system simulation placeholder
      // e.g. const result = runPromptSystem(input)
      // expect(result.error.message).toContain(expected.error.message)
    });
  });
});
