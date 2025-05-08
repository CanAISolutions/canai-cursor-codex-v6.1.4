/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test output quality and emotional resonance evaluation"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate output evaluator's ability to score outputs based on multiple criteria
 */

import { evaluateOutputs } from '../output-evaluator';

describe('Output Evaluator', () => {
  describe('evaluateOutputs', () => {
    it('should evaluate outputs with default clarity criterion', async () => {
      const outputs = [
        { text: 'This is a short output.' },
        { text: 'This is a much longer output that should score higher on clarity due to its length and detail. It provides more context and explanation.' }
      ];

      const results = await evaluateOutputs(outputs);

      expect(results).toHaveLength(2);
      expect(results[0].scores.clarity).toBeLessThan(results[1].scores.clarity);
      expect(results[0].totalScore).toBeLessThan(results[1].totalScore);
    });

    it('should evaluate outputs with multiple criteria', async () => {
      const outputs = [
        { text: 'Here is a simple statement.' },
        { text: 'Step 1: First, you need to plan your approach. Step 2: Then, execute with confidence.' },
        { text: 'I feel inspired by this journey. The struggle makes us stronger.' }
      ];

      const results = await evaluateOutputs(outputs, ['clarity', 'actionability', 'emotional resonance']);

      expect(results).toHaveLength(3);
      
      // Check actionability scores
      expect(results[1].scores.actionability).toBeGreaterThan(results[0].scores.actionability);
      expect(results[1].scores.actionability).toBeGreaterThan(results[2].scores.actionability);

      // Check emotional resonance scores
      expect(results[2].scores['emotional resonance']).toBeGreaterThan(results[0].scores['emotional resonance']);
      expect(results[2].scores['emotional resonance']).toBeGreaterThan(results[1].scores['emotional resonance']);
    });

    it('should handle empty outputs', async () => {
      const outputs = [
        { text: '' },
        { text: 'Some content' }
      ];

      const results = await evaluateOutputs(outputs);

      expect(results).toHaveLength(2);
      expect(results[0].scores.clarity).toBe(0);
      expect(results[0].totalScore).toBe(0);
    });

    it('should handle undefined text property', async () => {
      const outputs = [
        { otherProp: 'value' },
        { text: 'Valid text' }
      ];

      const results = await evaluateOutputs(outputs);

      expect(results).toHaveLength(2);
      expect(results[0].scores.clarity).toBe(0);
      expect(results[1].scores.clarity).toBeGreaterThan(0);
    });

    it('should handle custom criteria with fallback score', async () => {
      const outputs = [
        { text: 'Test output' }
      ];

      const results = await evaluateOutputs(outputs, ['customCriterion']);

      expect(results).toHaveLength(1);
      expect(results[0].scores.customCriterion).toBe(1); // fallback score
    });

    it('should calculate total scores correctly', async () => {
      const outputs = [
        { text: 'Step 1: Plan. Step 2: Execute. I feel inspired!' }
      ];

      const results = await evaluateOutputs(outputs, ['clarity', 'actionability', 'emotional resonance']);

      expect(results).toHaveLength(1);
      const total = Object.values(results[0].scores).reduce((sum, score) => sum + score, 0);
      expect(results[0].totalScore).toBe(total);
    });

    it('should handle outputs with maximum scores', async () => {
      const longText = 'a'.repeat(1000); // Should max out clarity score
      const outputs = [
        { text: longText }
      ];

      const results = await evaluateOutputs(outputs);

      expect(results).toHaveLength(1);
      expect(results[0].scores.clarity).toBe(5); // Maximum score
    });

    it('should maintain consistent scoring across multiple evaluations', async () => {
      const output = { text: 'Step 1: Plan. I feel inspired!' };
      
      const results1 = await evaluateOutputs([output], ['actionability', 'emotional resonance']);
      const results2 = await evaluateOutputs([output], ['actionability', 'emotional resonance']);

      expect(results1[0].scores).toEqual(results2[0].scores);
      expect(results1[0].totalScore).toBe(results2[0].totalScore);
    });
  });
}); 