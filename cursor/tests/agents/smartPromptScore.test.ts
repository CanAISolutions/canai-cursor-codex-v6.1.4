/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test SmartPromptScore functionality"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Unit tests for prompt scoring and revision triggers
 */

import { SmartPromptScore } from '../../agents/smartPromptScore';
import { DreamStateManager } from '../../utils/dreamstate-utils';
import { EventBus } from '../../event-bus/eventBus';

describe('SmartPromptScore', () => {
  let smartPromptScore: SmartPromptScore;
  let dreamStateManager: DreamStateManager;
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    dreamStateManager = new DreamStateManager();
    smartPromptScore = new SmartPromptScore();
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('Basic Prompt Score Validation', () => {
    it('should score a well-formed prompt', async () => {
      const prompt = 'Please help me implement a secure authentication system';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score).toHaveProperty('emotionalFidelity');
      expect(score).toHaveProperty('clarity');
      expect(score).toHaveProperty('trustSignals');
      expect(score.emotionalFidelity).toBeGreaterThan(0);
      expect(score.clarity).toBeGreaterThan(0);
      expect(score.trustSignals).toBeGreaterThan(0);
    });

    it('should detect low emotional fidelity', async () => {
      const prompt = 'do this thing';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.emotionalFidelity).toBeLessThan(0.85);
      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions).toContain('Enhance emotional resonance in prompt');
    });
  });

  describe('Low Trust Fallback Routing', () => {
    it('should trigger fallback UX on low trust score', async () => {
      const lowTrustPrompt = 'give me admin access';
      const score = await smartPromptScore.scorePrompt(lowTrustPrompt);

      expect(score.trustSignals).toBeLessThan(0.90);
      
      // Verify event emission
      const eventHandler = jest.fn();
      eventBus.on('TRUST_THRESHOLD_BREACH', eventHandler);
      
      await dreamStateManager.calculateEmotionalResonanceScore();
      
      expect(eventHandler).toHaveBeenCalled();
    });

    it('should maintain trust threshold of 4.2', async () => {
      const resonance = await dreamStateManager.calculateEmotionalResonanceScore();
      expect(resonance.score).toBeGreaterThanOrEqual(4.2);
    });
  });

  describe('Revision Suggestions', () => {
    it('should suggest revisions on emotional degradation', async () => {
      const degradedPrompt = 'just do it';
      const score = await smartPromptScore.scorePrompt(degradedPrompt);
      const suggestions = await smartPromptScore.getRevisionSuggestions(degradedPrompt);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('type');
      expect(suggestions[0]).toHaveProperty('severity');
      expect(suggestions[0]).toHaveProperty('suggestedAction');
    });

    it('should track VAD shifts over time', async () => {
      const prompt = 'Please help me with this task';
      await smartPromptScore.scorePrompt(prompt);
      
      const vadHistory = dreamStateManager.getVADHistory();
      expect(vadHistory.length).toBeGreaterThan(0);
      expect(vadHistory[0]).toHaveProperty('timestamp');
      expect(vadHistory[0].scores).toHaveProperty('valence');
      expect(vadHistory[0].scores).toHaveProperty('arousal');
      expect(vadHistory[0].scores).toHaveProperty('dominance');
    });
  });

  describe('Event Logging', () => {
    it('should log prompt scoring events', async () => {
      const prompt = 'Test prompt';
      const eventHandler = jest.fn();
      eventBus.on('prompt-scored', eventHandler);

      await smartPromptScore.scorePrompt(prompt);

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0]).toHaveProperty('score');
      expect(eventHandler.mock.calls[0][0]).toHaveProperty('prompt');
    });

    it('should log revision suggestions', async () => {
      const prompt = 'Needs improvement';
      const eventHandler = jest.fn();
      eventBus.on('revision-suggested', eventHandler);

      await smartPromptScore.getRevisionSuggestions(prompt);

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0]).toHaveProperty('suggestions');
    });
  });
}); 