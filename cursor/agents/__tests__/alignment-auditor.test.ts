/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test system alignment and compliance verification"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate alignment auditor's ability to detect and report system misalignments
 */

import { runAlignmentAudit } from '../alignmentAuditor';
import { calculateDreamAlignmentScore } from '../../utils/dreamstate-utils';
import { validateModularIntegrity } from '../../utils/modularity-utils';
import { compareLocalToCanonicalDirectives } from '../../utils/codex-memory-utils';
import { emitSystemLog } from '../../utils/audit-utils';
import { EventBus } from '../../event-bus/eventBus';

// Mock dependencies
jest.mock('../../utils/dreamstate-utils', () => ({
  calculateDreamAlignmentScore: jest.fn()
}));

jest.mock('../../utils/modularity-utils', () => ({
  validateModularIntegrity: jest.fn()
}));

jest.mock('../../utils/codex-memory-utils', () => ({
  compareLocalToCanonicalDirectives: jest.fn()
}));

jest.mock('../../utils/audit-utils', () => ({
  emitSystemLog: jest.fn()
}));

jest.mock('../../event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      on: jest.fn(),
      emit: jest.fn()
    })
  }
}));

describe('Alignment Auditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runAlignmentAudit', () => {
    it('should report aligned state when all checks pass', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 95 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: true });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: false });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(true);
      expect(result.issues).toBeUndefined();
      expect(emitSystemLog).toHaveBeenCalledWith('alignment-audit-completed', {
        aligned: true,
        issues: undefined
      });
    });

    it('should detect emotional resonance drift', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 85 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: true });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: false });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues![0]).toMatchObject({
        type: 'emotional',
        description: expect.stringContaining('Emotional resonance drift'),
        suggestedAction: expect.stringContaining('Recalibrate emotional UX')
      });
    });

    it('should detect modular integrity issues', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 95 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: false });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: false });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues![0]).toMatchObject({
        type: 'modular',
        description: expect.stringContaining('modular snapshot drift'),
        suggestedAction: expect.stringContaining('Rebuild modular snapshot')
      });
    });

    it('should detect codex compliance issues', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 95 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: true });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: true });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues![0]).toMatchObject({
        type: 'codex',
        description: expect.stringContaining('Codex upgrades available'),
        suggestedAction: expect.stringContaining('Initiate Codex upgrade')
      });
    });

    it('should detect multiple alignment issues simultaneously', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 85 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: false });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: true });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(false);
      expect(result.issues).toHaveLength(3);
      expect(result.issues!.map(i => i.type)).toEqual(['emotional', 'modular', 'codex']);
    });

    it('should handle edge case at emotional alignment threshold', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 92 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: true });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: false });

      const result = await runAlignmentAudit();

      expect(result.aligned).toBe(true);
      expect(result.issues).toBeUndefined();
    });

    it('should validate issue structure when issues are detected', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 85 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: false });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: true });

      const result = await runAlignmentAudit();

      result.issues!.forEach(issue => {
        expect(issue).toHaveProperty('type');
        expect(issue).toHaveProperty('description');
        expect(issue).toHaveProperty('suggestedAction');
        expect(['emotional', 'modular', 'codex', 'execution']).toContain(issue.type);
      });
    });

    it('should handle errors in alignment checks', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockRejectedValue(new Error('Alignment check failed'));

      await expect(runAlignmentAudit()).rejects.toThrow('Alignment check failed');
    });

    it('should emit system logs in correct order', async () => {
      (calculateDreamAlignmentScore as jest.Mock).mockResolvedValue({ score: 85 });
      (validateModularIntegrity as jest.Mock).mockResolvedValue({ passed: false });
      (compareLocalToCanonicalDirectives as jest.Mock).mockResolvedValue({ upgradesDetected: true });

      await runAlignmentAudit();

      expect(emitSystemLog).toHaveBeenCalledWith('alignment-audit-completed', expect.any(Object));
    });
  });

  describe('Event handling', () => {
    it('should handle codex alignment verification events', () => {
      const eventBus = EventBus.getInstance();
      const mockEvent = {
        aligned: false,
        issues: [{
          type: 'codex',
          description: 'Test issue',
          suggestedAction: 'Test action'
        }]
      };

      // Simulate event emission
      const eventHandler = (eventBus.on as jest.Mock).mock.calls[0][1];
      eventHandler(mockEvent);

      expect(emitSystemLog).toHaveBeenCalledWith('codex-alignment-issues', {
        issues: mockEvent.issues
      });
    });

    it('should not emit logs for aligned states', () => {
      const eventBus = EventBus.getInstance();
      const mockEvent = {
        aligned: true,
        issues: undefined
      };

      // Simulate event emission
      const eventHandler = (eventBus.on as jest.Mock).mock.calls[0][1];
      eventHandler(mockEvent);

      expect(emitSystemLog).not.toHaveBeenCalledWith('codex-alignment-issues', expect.any(Object));
    });
  });
}); 