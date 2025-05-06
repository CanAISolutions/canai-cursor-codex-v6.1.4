/**
 * codex-correction/__tests__/codex-correction.test.ts
 * 
 * Purpose:
 * Tests the codex correction system including:
 * - Drift detection
 * - Trust drop response
 * - Correction proposals
 * - Event emission
 * - Idempotency
 * - Validation rejection
 * - Metadata validation
 */

import { EventBus } from '../../utils/event-bus';
import { CodexRuleEngine } from '../../rules/rule-engine';
import { CodexCorrectionEngine } from '../codex-correction-engine';
import { CorrectionReasoner } from '../correction-reasoner';
import {
  CorrectionEngineConfig,
  CorrectionReason,
  CodexCorrectionResult
} from '../correction-contract';
import { PromptExecutionResult } from '../../prompt-infrastructure/prompt-schema';
import { TrustScore } from '../../trust/trust-types';
import { Violation } from '../../rules/rules-schema';

// Mock data
const mockPromptResult: PromptExecutionResult = {
  promptId: 'test-prompt',
  version: '1.0.0',
  timestamp: Date.now(),
  alignmentScore: 0.8,
  originalAlignmentScore: 0.9,
  trustScore: 0.7,
  performanceScore: 0.8,
  output: 'Test output',
  metadata: {
    author: 'test',
    tags: ['test'],
    source: 'test'
  }
};

const mockTrustScore: TrustScore = {
  score: 0.7,
  timestamp: Date.now(),
  factors: {
    userHistory: 0.8,
    contentQuality: 0.7,
    systemFeedback: 0.6
  },
  meetsThreshold: true
};

const engineConfig: CorrectionEngineConfig = {
  minTrustScore: 0.7,
  maxTrustDrop: 0.2,
  maxAlignmentDrift: 0.1,
  requireUserConfirmation: true,
  emitEvents: true
};

describe('Codex Correction', () => {
  let eventBus: EventBus;
  let ruleEngine: CodexRuleEngine;
  let correctionEngine: CodexCorrectionEngine;
  let correctionReasoner: CorrectionReasoner;
  let emittedEvents: { type: string; data: any }[];

  beforeEach(() => {
    eventBus = new EventBus();
    ruleEngine = new CodexRuleEngine(eventBus);
    correctionReasoner = new CorrectionReasoner(eventBus, ruleEngine, engineConfig);
    correctionEngine = new CodexCorrectionEngine(eventBus, ruleEngine, engineConfig);

    emittedEvents = [];
    eventBus.on('codex.correction.proposed', (data) => emittedEvents.push({ type: 'proposed', data }));
    eventBus.on('codex.correction.applied', (data) => emittedEvents.push({ type: 'applied', data }));
    eventBus.on('codex.correction.rejected', (data) => emittedEvents.push({ type: 'rejected', data }));
  });

  describe('Drift Detection', () => {
    it('should detect alignment drift and emit proposed event', async () => {
      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(result.success).toBe(true);
      expect(result.plan?.reason).toBe(CorrectionReason.ALIGNMENT_DRIFT);
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'proposed' })
      );
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'applied' })
      );
    });

    it('should not trigger correction for acceptable drift', async () => {
      const acceptableResult = {
        ...mockPromptResult,
        alignmentScore: 0.89,
        originalAlignmentScore: 0.9
      };

      const result = await correctionEngine.evaluateAndCorrect(acceptableResult, mockTrustScore);

      expect(result.success).toBe(true);
      expect(result.plan).toBeUndefined();
      expect(emittedEvents).toHaveLength(0);
    });
  });

  describe('Trust Drop Response', () => {
    it('should detect trust score drop below threshold', async () => {
      const lowTrustScore: TrustScore = {
        ...mockTrustScore,
        score: 0.5,
        factors: {
          ...mockTrustScore.factors,
          userHistory: 0.8
        },
        meetsThreshold: false
      };

      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, lowTrustScore);

      expect(result.success).toBe(true);
      expect(result.plan?.reason).toBe(CorrectionReason.TRUST_DROP);
      expect(result.plan?.priority).toBeGreaterThan(3); // High priority for trust drops
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'proposed' })
      );
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'applied' })
      );
    });

    it('should not trigger correction for acceptable trust score', async () => {
      const acceptableTrustScore: TrustScore = {
        ...mockTrustScore,
        score: 0.75,
        factors: {
          ...mockTrustScore.factors,
          userHistory: 0.8
        },
        meetsThreshold: true
      };

      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, acceptableTrustScore);

      expect(result.success).toBe(true);
      expect(result.plan).toBeUndefined();
      expect(emittedEvents).toHaveLength(0);
    });
  });

  describe('Correction Proposals', () => {
    it('should propose correction for rule violations', async () => {
      // Mock rule engine to simulate violations
      const mockViolation: Violation = {
        id: 'test-violation',
        ruleId: 'test-rule',
        timestamp: Date.now(),
        severity: 'high',
        recoveryAction: 'block',
        context: {
          target: 'test-prompt',
          targetType: 'prompt',
          value: 'Test violation',
          expected: 'No violations'
        },
        metadata: {
          trustScore: 0.7
        }
      };

      jest.spyOn(ruleEngine, 'evaluateRules').mockResolvedValue([mockViolation]);

      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(result.success).toBe(true);
      expect(result.plan?.reason).toBe(CorrectionReason.VIOLATION);
      expect(result.plan?.delta.changes).toContain('Fix violation: Test violation');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'proposed' })
      );
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'applied' })
      );
    });

    it('should reject invalid correction plans', async () => {
      // Mock rule engine to simulate validation failure
      const mockViolation: Violation = {
        id: 'test-violation',
        ruleId: 'test-rule',
        timestamp: Date.now(),
        severity: 'high',
        recoveryAction: 'block',
        context: {
          target: 'test-prompt',
          targetType: 'prompt',
          value: 'Invalid plan',
          expected: 'Valid plan'
        },
        metadata: {
          trustScore: 0.7
        }
      };

      jest.spyOn(ruleEngine, 'evaluateRules').mockResolvedValue([mockViolation]);

      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VALIDATION_FAILED');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });
  });

  describe('Idempotency', () => {
    it('should not apply correction twice', async () => {
      // First correction
      const firstResult = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);
      expect(firstResult.success).toBe(true);
      expect(firstResult.plan).toBeDefined();

      // Second correction with same input
      const secondResult = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);
      expect(secondResult.success).toBe(true);
      expect(secondResult.plan).toBeUndefined();
      expect(secondResult.metadata?.reason).toBe('Correction already in place');
    });

    it('should allow new correction for different drift', async () => {
      // First correction
      const firstResult = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);
      expect(firstResult.success).toBe(true);

      // Second correction with increased drift
      const increasedDriftResult = {
        ...mockPromptResult,
        alignmentScore: 0.7, // Increased drift
        originalAlignmentScore: 0.9
      };

      const secondResult = await correctionEngine.evaluateAndCorrect(increasedDriftResult, mockTrustScore);
      expect(secondResult.success).toBe(true);
      expect(secondResult.plan).toBeDefined();
      expect(secondResult.plan?.reason).toBe(CorrectionReason.ALIGNMENT_DRIFT);
    });
  });

  describe('Event Emission', () => {
    it('should emit events in correct order', async () => {
      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(result.success).toBe(true);
      expect(emittedEvents).toEqual([
        expect.objectContaining({ type: 'proposed' }),
        expect.objectContaining({ type: 'applied' })
      ]);
    });

    it('should not emit events when disabled', async () => {
      const disabledConfig: CorrectionEngineConfig = {
        ...engineConfig,
        emitEvents: false
      };

      const disabledEngine = new CodexCorrectionEngine(
        eventBus,
        ruleEngine,
        disabledConfig
      );

      await disabledEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(emittedEvents).toHaveLength(0);
    });
  });

  describe('Correction Rejection', () => {
    it('should reject correction plan that violates rules', async () => {
      // Mock rule engine to simulate initial drift detection
      const mockDriftViolation: Violation = {
        id: 'drift-violation',
        ruleId: 'drift-rule',
        timestamp: Date.now(),
        severity: 'high',
        recoveryAction: 'block',
        context: {
          target: 'test-prompt',
          targetType: 'prompt',
          value: 'Alignment drift detected',
          expected: 'No drift'
        },
        metadata: {
          trustScore: 0.7
        }
      };

      // Mock rule engine to reject the correction plan
      const mockPlanViolation: Violation = {
        id: 'plan-violation',
        ruleId: 'safety-rule',
        timestamp: Date.now(),
        severity: 'critical',
        recoveryAction: 'block',
        context: {
          target: 'test-prompt',
          targetType: 'prompt',
          value: 'Unsafe correction proposed',
          expected: 'Safe correction'
        },
        metadata: {
          trustScore: 0.3
        }
      };

      // First call detects drift
      jest.spyOn(ruleEngine, 'evaluateRules')
        .mockResolvedValueOnce([mockDriftViolation])
        // Second call rejects the correction plan
        .mockResolvedValueOnce([mockPlanViolation]);

      const result = await correctionEngine.evaluateAndCorrect(mockPromptResult, mockTrustScore);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('VALIDATION_FAILED');
      expect(result.rejectionReason?.message).toContain('Unsafe correction proposed');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
      expect(emittedEvents).not.toContainEqual(
        expect.objectContaining({ type: 'applied' })
      );
    });
  });

  describe('Metadata Validation', () => {
    it('should reject correction for missing prompt version', async () => {
      // Create a partial result that's missing the version field
      const { version, ...invalidPromptResult } = mockPromptResult;

      const result = await correctionEngine.evaluateAndCorrect(
        invalidPromptResult as unknown as PromptExecutionResult,
        mockTrustScore
      );

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('MISSING_CONTRACT_DATA');
      expect(result.rejectionReason?.message).toContain('Missing prompt version');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject correction for missing alignment configuration', async () => {
      // Create a partial result that's missing alignment scores
      const { alignmentScore, originalAlignmentScore, ...partialResult } = mockPromptResult;

      const result = await correctionEngine.evaluateAndCorrect(
        partialResult as unknown as PromptExecutionResult,
        mockTrustScore
      );

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('MISSING_CONTRACT_DATA');
      expect(result.rejectionReason?.message).toContain('Missing alignment configuration');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });

    it('should reject correction for invalid trust score', async () => {
      const invalidPromptResult: PromptExecutionResult = {
        ...mockPromptResult,
        trustScore: -1 // Invalid trust score
      };

      const result = await correctionEngine.evaluateAndCorrect(invalidPromptResult, mockTrustScore);

      expect(result.success).toBe(false);
      expect(result.rejectionReason?.code).toBe('INVALID_CONTRACT_DATA');
      expect(result.rejectionReason?.message).toContain('Invalid trust score');
      expect(emittedEvents).toContainEqual(
        expect.objectContaining({ type: 'rejected' })
      );
    });
  });
}); 