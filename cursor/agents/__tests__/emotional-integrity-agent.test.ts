/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test emotional integrity monitoring and drift detection"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate emotional integrity agent's ability to monitor and maintain emotional resonance
 */

import { monitorEmotionalIntegrity, EMOTIONAL_INTEGRITY_CHECKED } from '../emotionalIntegrityAgent';
import { DreamStateManager } from '../../utils/dreamstate-utils';
import { runAudit } from '../../system-intel/audit-utils';

// Mock dependencies
jest.mock('../../utils/dreamstate-utils', () => ({
  DreamStateManager: jest.fn().mockImplementation(() => ({
    calculateEmotionalResonanceScore: jest.fn()
  }))
}));

jest.mock('../../system-intel/audit-utils', () => ({
  runAudit: jest.fn()
}));

describe('Emotional Integrity Agent', () => {
  let dreamStateManager: DreamStateManager;

  beforeEach(() => {
    jest.clearAllMocks();
    dreamStateManager = new DreamStateManager();
  });

  describe('monitorEmotionalIntegrity', () => {
    it('should report optimal state when emotional resonance is high', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 95,
        delta: 0
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(true);
      expect(result.issues).toBeUndefined();
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should detect coldness drift when score is below threshold', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 85,
        delta: -6
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues![0]).toMatchObject({
        type: 'coldness-drift',
        description: expect.stringContaining('decrease in emotional resonance'),
        suggestedAction: expect.stringContaining('UX emotional re-tuning')
      });
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should detect trust signal degradation when score is very low', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 80,
        delta: 0
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues![0]).toMatchObject({
        type: 'trust-signal-degradation',
        description: expect.stringContaining('Suboptimal emotional trust signal'),
        suggestedAction: expect.stringContaining('UX trust reinforcement')
      });
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should detect multiple issues when both thresholds are exceeded', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 80,
        delta: -6
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(false);
      expect(result.issues).toHaveLength(2);
      expect(result.issues!.map(i => i.type)).toEqual(['coldness-drift', 'trust-signal-degradation']);
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should handle edge case at coldness drift threshold', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 90,
        delta: -5
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(true);
      expect(result.issues).toBeUndefined();
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should handle edge case at trust signal threshold', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 85,
        delta: 0
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(true);
      expect(result.issues).toBeUndefined();
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should handle missing delta value', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 85,
        delta: undefined
      });

      const result = await monitorEmotionalIntegrity();

      expect(result.optimal).toBe(true);
      expect(result.issues).toBeUndefined();
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should validate issue structure when issues are detected', async () => {
      (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 80,
        delta: -6
      });

      const result = await monitorEmotionalIntegrity();

      result.issues!.forEach(issue => {
        expect(issue).toHaveProperty('type');
        expect(issue).toHaveProperty('description');
        expect(issue).toHaveProperty('suggestedAction');
        expect(['coldness-drift', 'overmechanization', 'trust-signal-degradation']).toContain(issue.type);
      });
      expect(runAudit).toHaveBeenCalledWith(expect.any(String));
    });

    it('should run audit for all emotional states', async () => {
      const testCases = [
        { score: 95, delta: 0 },
        { score: 85, delta: -6 },
        { score: 80, delta: 0 },
        { score: 80, delta: -6 }
      ];

      for (const testCase of testCases) {
        (dreamStateManager.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue(testCase);
        await monitorEmotionalIntegrity();
      }

      expect(runAudit).toHaveBeenCalledTimes(testCases.length);
    });
  });
}); 