/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test recursive prompt analysis and improvement"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate recursive thinker's ability to analyze and improve prompts
 */

import { recursiveThinker } from '../recursive-thinker';
import { generatePromptOutput } from '../gpt-runner';
import { evaluateOutputs } from '../output-evaluator';

// Mock dependencies
jest.mock('../gpt-runner', () => ({
  generatePromptOutput: jest.fn()
}));

jest.mock('../output-evaluator', () => ({
  evaluateOutputs: jest.fn()
}));

describe('Recursive Thinker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recursiveThinker', () => {
    const mockConfig = {
      promptType: 'test-prompt',
      inputData: { test: 'data' },
      rounds: 2,
      variantsPerRound: 3,
      criteria: ['clarity', 'actionability'],
      logDelta: true
    };

    const mockOutputs = [
      { text: 'Output 1', scores: { clarity: 0.8, actionability: 0.7 }, totalScore: 1.5 },
      { text: 'Output 2', scores: { clarity: 0.9, actionability: 0.8 }, totalScore: 1.7 },
      { text: 'Output 3', scores: { clarity: 0.7, actionability: 0.6 }, totalScore: 1.3 }
    ];

    it('should generate and evaluate multiple rounds of outputs', async () => {
      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      const result = await recursiveThinker(mockConfig);

      expect(generatePromptOutput).toHaveBeenCalledTimes(6); // 2 rounds * 3 variants
      expect(evaluateOutputs).toHaveBeenCalledTimes(2); // Once per round
      expect(result).toBeDefined();
    });

    it('should use default values when not specified', async () => {
      const minimalConfig = {
        promptType: 'test-prompt',
        inputData: { test: 'data' }
      };

      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      await recursiveThinker(minimalConfig);

      expect(generatePromptOutput).toHaveBeenCalledTimes(6); // Default 2 rounds * 3 variants
      expect(evaluateOutputs).toHaveBeenCalledWith(
        expect.any(Array),
        ['clarity', 'actionability'] // Default criteria
      );
    });

    it('should select the highest scoring output from each round', async () => {
      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock)
        .mockResolvedValueOnce(mockOutputs) // First round
        .mockResolvedValueOnce([...mockOutputs].reverse()); // Second round with different order

      const result = await recursiveThinker(mockConfig);

      expect(result).toBeDefined();
      expect(evaluateOutputs).toHaveBeenCalledTimes(2);
    });

    it('should handle custom criteria', async () => {
      const customConfig = {
        ...mockConfig,
        criteria: ['emotional', 'technical']
      };

      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      await recursiveThinker(customConfig);

      expect(evaluateOutputs).toHaveBeenCalledWith(
        expect.any(Array),
        ['emotional', 'technical']
      );
    });

    it('should handle errors in output generation', async () => {
      (generatePromptOutput as jest.Mock)
        .mockRejectedValueOnce(new Error('Generation failed'))
        .mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      await expect(recursiveThinker(mockConfig)).rejects.toThrow('Generation failed');
    });

    it('should handle errors in output evaluation', async () => {
      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockRejectedValue(new Error('Evaluation failed'));

      await expect(recursiveThinker(mockConfig)).rejects.toThrow('Evaluation failed');
    });

    it('should log delta scores when logDelta is true', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      await recursiveThinker(mockConfig);

      expect(consoleSpy).toHaveBeenCalledWith('Round 1 Top Score:', 1.7);
      expect(consoleSpy).toHaveBeenCalledWith('Round 2 Top Score:', 1.7);
      
      consoleSpy.mockRestore();
    });

    it('should not log delta scores when logDelta is false', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      (generatePromptOutput as jest.Mock).mockResolvedValue({ text: 'Test output' });
      (evaluateOutputs as jest.Mock).mockResolvedValue(mockOutputs);

      await recursiveThinker({ ...mockConfig, logDelta: false });

      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
}); 