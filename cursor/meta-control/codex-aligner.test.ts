/**
 * meta-control/codex-aligner.test.ts
 * 
 * Purpose:
 * Tests the CodexAligner's ability to validate and enforce Codex alignment,
 * including prompt, response, and behavior alignment checks.
 */

import { EventBus } from '../utils/event-bus';
import { CodexAligner } from './codex-aligner';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { AgentMemory } from '../agent-oversight/agent-memory';

// Define mock interfaces
interface MockEventBus {
  publish: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  once: jest.Mock;
  removeAllListeners: jest.Mock;
}

interface MockTrustScorer {
  evaluateTrust: jest.Mock;
  adjustTrustScore: jest.Mock;
  getTrustScore: jest.Mock;
  getTrustHistory: jest.Mock;
  evaluateTaskTrust: jest.Mock;
  TRUST_FILE: string;
  MINIMUM_THRESHOLD: number;
  MAXIMUM_SCORE: number;
  MINIMUM_SCORE: number;
  WARNING_THRESHOLD: number;
  MAX_ADJUSTMENT: number;
}

interface MockAgentMemory {
  getAgentMetrics: jest.Mock;
  updateAgentMetrics: jest.Mock;
  getSystemMetrics: jest.Mock;
  updateSystemMetrics: jest.Mock;
  updateAgentRecord: jest.Mock;
  recordTrustEvent: jest.Mock;
  recordRecoveryAttempt: jest.Mock;
  cleanupOldRecords: jest.Mock;
}

describe('CodexAligner', () => {
  let eventBus: MockEventBus;
  let trustScorer: MockTrustScorer;
  let agentMemory: MockAgentMemory;
  let codexAligner: CodexAligner;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    };

    trustScorer = {
      evaluateTrust: jest.fn().mockResolvedValue(0.8),
      adjustTrustScore: jest.fn().mockResolvedValue(0.8),
      getTrustScore: jest.fn().mockReturnValue(0.8),
      getTrustHistory: jest.fn().mockReturnValue([]),
      evaluateTaskTrust: jest.fn().mockResolvedValue(undefined),
      TRUST_FILE: '.canai-context/trust-scores.json',
      MINIMUM_THRESHOLD: 0.9,
      MAXIMUM_SCORE: 1.0,
      MINIMUM_SCORE: 0.0,
      WARNING_THRESHOLD: 0.85,
      MAX_ADJUSTMENT: 0.2
    };

    agentMemory = {
      getAgentMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.8,
        executionCount: 10,
        successRate: 0.9
      }),
      updateAgentMetrics: jest.fn().mockResolvedValue(undefined),
      getSystemMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.8,
        resourceUsage: 0.6,
        alignmentScore: 0.9
      }),
      updateSystemMetrics: jest.fn().mockResolvedValue(undefined),
      updateAgentRecord: jest.fn().mockResolvedValue(undefined),
      recordTrustEvent: jest.fn().mockResolvedValue(undefined),
      recordRecoveryAttempt: jest.fn().mockResolvedValue(undefined),
      cleanupOldRecords: jest.fn().mockResolvedValue(undefined)
    };

    codexAligner = new CodexAligner(
      eventBus as unknown as EventBus,
      trustScorer as unknown as TrustScorer,
      agentMemory as unknown as AgentMemory
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAlignment', () => {
    it('should validate prompt alignment', async () => {
      const prompt = {
        content: 'Test prompt',
        metadata: {
          tone: 'professional',
          context: 'business'
        }
      };

      const result = await codexAligner.validatePromptAlignment(prompt);
      expect(result).toBe(true);
      expect(eventBus.publish).not.toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }));
    });

    it('should detect prompt misalignment', async () => {
      const prompt = {
        content: 'Test prompt',
        metadata: {
          tone: 'casual',
          context: 'business'
        }
      };

      const result = await codexAligner.validatePromptAlignment(prompt);
      expect(result).toBe(false);
      expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }), 'high');
    });

    it('should validate response alignment', async () => {
      const response = {
        content: 'Test response',
        metadata: {
          tone: 'professional',
          context: 'business'
        }
      };

      const result = await codexAligner.validateResponseAlignment(response);
      expect(result).toBe(true);
      expect(eventBus.publish).not.toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }));
    });

    it('should detect response misalignment', async () => {
      const response = {
        content: 'Test response',
        metadata: {
          tone: 'casual',
          context: 'business'
        }
      };

      const result = await codexAligner.validateResponseAlignment(response);
      expect(result).toBe(false);
      expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }), 'high');
    });

    it('should validate behavior alignment', async () => {
      const behavior = {
        action: 'test-action',
        metadata: {
          tone: 'professional',
          context: 'business'
        }
      };

      const result = await codexAligner.validateBehaviorAlignment(behavior);
      expect(result).toBe(true);
      expect(eventBus.publish).not.toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }));
    });

    it('should detect behavior misalignment', async () => {
      const behavior = {
        action: 'test-action',
        metadata: {
          tone: 'casual',
          context: 'business'
        }
      };

      const result = await codexAligner.validateBehaviorAlignment(behavior);
      expect(result).toBe(false);
      expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:deviation'
      }), 'high');
    });
  });

  describe('enforceAlignment', () => {
    it('should enforce alignment for misaligned content', async () => {
      const content = {
        type: 'prompt',
        data: {
          content: 'Test content',
          metadata: {
            tone: 'casual',
            context: 'business'
          }
        }
      };

      const result = await codexAligner.enforceAlignment(content);
      expect(result).toBe(true);
      expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
        type: 'alignment:enforced'
      }), 'medium');
    });

    it('should handle alignment enforcement errors', async () => {
      const content = {
        type: 'prompt',
        data: {
          content: 'Test content',
          metadata: {
            tone: 'casual',
            context: 'business'
          }
        }
      };

      eventBus.publish.mockRejectedValueOnce(new Error('Enforcement failed'));

      const result = await codexAligner.enforceAlignment(content);
      expect(result).toBe(false);
      expect(eventBus.publish).toHaveBeenCalledWith('alignment:error', expect.any(Object));
    });
  });

  describe('getAlignmentMetrics', () => {
    it('should return alignment metrics', async () => {
      const metrics = await codexAligner.getAlignmentMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.alignmentScore).toBeDefined();
      expect(metrics.deviationMetrics).toBeDefined();
    });

    it('should handle metric calculation errors', async () => {
      agentMemory.getSystemMetrics.mockRejectedValueOnce(new Error('Metrics error'));

      const metrics = await codexAligner.getAlignmentMetrics();
      expect(metrics.alignmentScore).toBe(0);
      expect(metrics.deviationMetrics).toEqual({
        promptDeviation: 0,
        responseDeviation: 0,
        behaviorDeviation: 0
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const prompt = {
        content: 'Test prompt',
        metadata: {
          tone: 'casual',
          context: 'business'
        }
      };

      eventBus.publish.mockRejectedValueOnce(new Error('Validation error'));

      const result = await codexAligner.validatePromptAlignment(prompt);
      expect(result).toBe(false);
      expect(eventBus.publish).toHaveBeenCalledWith('alignment:error', expect.any(Object));
    });

    it('should handle metric retrieval errors', async () => {
      agentMemory.getSystemMetrics.mockRejectedValueOnce(new Error('Metrics error'));

      const metrics = await codexAligner.getAlignmentMetrics();
      expect(metrics.alignmentScore).toBe(0);
      expect(metrics.deviationMetrics).toEqual({
        promptDeviation: 0,
        responseDeviation: 0,
        behaviorDeviation: 0
      });
    });
  });
}); 