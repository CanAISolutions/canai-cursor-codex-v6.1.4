/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test prompt quality scoring and emotional fidelity"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate smart prompt score's ability to assess prompt quality and emotional resonance
 */

import { SmartPromptScore } from '../smartPromptScore';
import { EventBus } from '../../event-bus/eventBus';
import { emitSystemLog } from '../../utils/audit-utils';
import { calculateEmotionalResonanceScore } from '../../utils/dreamstate-utils';

// Mock dependencies
jest.mock('../../event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn(() => ({
      on: jest.fn()
    }))
  }
}));

jest.mock('../../utils/audit-utils', () => ({
  emitSystemLog: jest.fn()
}));

jest.mock('../../utils/dreamstate-utils', () => ({
  calculateEmotionalResonanceScore: jest.fn()
}));

describe('Smart Prompt Score', () => {
  let smartPromptScore: SmartPromptScore;

  beforeEach(() => {
    jest.clearAllMocks();
    smartPromptScore = new SmartPromptScore();
  });

  describe('scorePrompt', () => {
    it('should score a high-quality prompt correctly', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.95
      });

      const prompt = 'A clear and emotionally resonant prompt that builds trust.';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.emotionalFidelity).toBeGreaterThan(0.85);
      expect(score.clarity).toBeGreaterThan(0.80);
      expect(score.trustSignals).toBeGreaterThan(0.90);
      expect(score.revisionNeeded).toBe(false);
      expect(score.suggestions).toHaveLength(0);
    });

    it('should detect low emotional fidelity', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.70
      });

      const prompt = 'A technical prompt without emotional elements.';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.emotionalFidelity).toBeLessThan(0.85);
      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions).toContain('Enhance emotional resonance in prompt');
    });

    it('should detect clarity issues', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.95
      });

      const prompt = 'A poorly structured prompt with unclear instructions and no organization.';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.clarity).toBeLessThan(0.80);
      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions).toContain('Improve prompt structure and readability');
    });

    it('should detect trust signal issues', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.75
      });

      const prompt = 'A prompt that lacks trust-building elements.';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.trustSignals).toBeLessThan(0.90);
      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions).toContain('Strengthen trust-building elements');
    });

    it('should handle multiple issues simultaneously', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.70
      });

      const prompt = 'A poorly written prompt with multiple issues.';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions.length).toBeGreaterThan(1);
    });

    it('should log prompt scores correctly', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.95
      });

      const prompt = 'A test prompt.';
      await smartPromptScore.scorePrompt(prompt);

      expect(emitSystemLog).toHaveBeenCalledWith('prompt-scored', expect.objectContaining({
        prompt: expect.any(String),
        score: expect.objectContaining({
          emotionalFidelity: expect.any(Number),
          clarity: expect.any(Number),
          trustSignals: expect.any(Number)
        })
      }));
    });
  });

  describe('getRevisionSuggestions', () => {
    it('should return appropriate revision signals', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.70
      });

      const prompt = 'A prompt needing revision.';
      const suggestions = await smartPromptScore.getRevisionSuggestions(prompt);

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toMatchObject({
        type: 'emotional',
        severity: expect.any(String),
        description: expect.any(String),
        suggestedAction: expect.any(String)
      });
    });

    it('should handle high severity issues', async () => {
      (calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 0.50
      });

      const prompt = 'A very poor prompt.';
      const suggestions = await smartPromptScore.getRevisionSuggestions(prompt);

      expect(suggestions[0].severity).toBe('high');
    });
  });

  describe('Event Handling', () => {
    it('should initialize event listeners', () => {
      const eventBus = EventBus.getInstance();
      expect(eventBus.on).toHaveBeenCalledWith('PROMPT_REVISED', expect.any(Function));
      expect(eventBus.on).toHaveBeenCalledWith('EMOTIONAL_STATE_CHANGED', expect.any(Function));
    });

    it('should handle prompt revision events', async () => {
      const eventBus = EventBus.getInstance();
      const handler = (eventBus.on as jest.Mock).mock.calls[0][1];
      
      handler({
        originalScore: { emotionalFidelity: 0.7 },
        newScore: { emotionalFidelity: 0.9 },
        changes: ['Enhanced emotional resonance']
      });
      
      expect(emitSystemLog).toHaveBeenCalledWith('prompt-revision-handled', expect.objectContaining({
        originalScore: expect.any(Object),
        newScore: expect.any(Object),
        changes: expect.any(Array)
      }));
    });

    it('should handle emotional state changes', async () => {
      const eventBus = EventBus.getInstance();
      const handler = (eventBus.on as jest.Mock).mock.calls[1][1];
      
      handler({
        previousState: { score: 0.7 },
        newState: { score: 0.9 }
      });
      
      expect(emitSystemLog).toHaveBeenCalledWith('emotional-state-updated', expect.objectContaining({
        previousState: expect.any(Object),
        newState: expect.any(Object)
      }));
    });
  });
}); 