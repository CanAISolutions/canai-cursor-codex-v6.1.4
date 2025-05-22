/**
 * evolution-triggers/strategy-executor.test.ts
 * 
 * Purpose:
 * Tests the evolution strategy executor's ability to execute and validate strategies.
 *
 * Codex Audit Note:
 * TrustEvolutionTracker requires at least 10 trust score samples (MIN_SAMPLES) for the 'system' component.
 * All trust-recovery strategy tests must pre-populate this history to avoid insufficient history errors.
 * This ensures Codex auditability and prevents silent test failures due to missing setup.
 */

import { EvolutionStrategyExecutor } from './strategy-executor';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';

describe('EvolutionStrategyExecutor', () => {
  let executor: EvolutionStrategyExecutor;
  let mockTrustTracker: jest.Mocked<TrustEvolutionTracker>;
  let mockPerformanceOptimizer: jest.Mocked<PerformanceOptimizer>;
  let mockEmotionalEngine: jest.Mocked<EmotionalIntelligenceEngine>;
  let mockResourceMonitor: jest.Mocked<ResourceMonitor>;

  beforeEach(() => {
    // Initialize mocks
    mockTrustTracker = {
      calculateEvolutionMetrics: jest.fn().mockResolvedValue({
        baselineScore: 0.9,
        stabilityIndex: 0.95,
        improvementRate: 0.1,
        recoveryEfficiency: 0.85,
        adaptationSpeed: 0.8
      }),
      recordTrustScore: jest.fn().mockResolvedValue(undefined),
      getTrustHistory: jest.fn().mockReturnValue([])
    } as any;

    mockPerformanceOptimizer = {
      getPerformanceStats: jest.fn().mockReturnValue({
        averageResponseTime: 100,
        averageRecoveryTime: 50,
        cacheHitRate: 0.85,
        resourceUsage: {
          cpu: 0.6,
          memory: 0.7
        }
      }),
      optimizeCacheSettings: jest.fn().mockResolvedValue(undefined)
    } as any;

    mockEmotionalEngine = {
      processInput: jest.fn().mockResolvedValue({
        adaptiveResponse: {
          empathyLevel: 0.9,
          toneAdjustment: 0.8
        }
      })
    } as any;

    mockResourceMonitor = {
      getResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.6,
        memory: 0.7
      })
    } as any;

    executor = new EvolutionStrategyExecutor(
      mockTrustTracker,
      mockPerformanceOptimizer,
      mockEmotionalEngine,
      mockResourceMonitor
    );

    // Codex Safeguard: Pre-populate trust score history for 'system' to satisfy MIN_SAMPLES (10)
    // This prevents calculateEvolutionMetrics from throwing due to insufficient history.
    for (let i = 0; i < 10; i++) {
      mockTrustTracker.recordTrustScore('system', 0.9, 'test', false);
    }
  });

  describe('executeStrategy', () => {
    it('should execute trust recovery strategy successfully', async () => {
      // Codex: Ensure calculateEvolutionMetrics returns the same metrics for before/after
      mockTrustTracker.calculateEvolutionMetrics.mockResolvedValueOnce({
        baselineScore: 0.9,
        stabilityIndex: 0.95,
        improvementRate: 0.1,
        recoveryEfficiency: 0.85,
        adaptationSpeed: 0.8
      }).mockResolvedValueOnce({
        baselineScore: 0.9,
        stabilityIndex: 0.95,
        improvementRate: 0.1,
        recoveryEfficiency: 0.85,
        adaptationSpeed: 0.8
      });

      const result = await executor.executeStrategy('trust-recovery', {});

      expect(result.success).toBe(true);
      expect(result.metrics.before).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
      expect(result.metrics.after).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
      expect(result.duration).toBeGreaterThan(0);
      expect(result.errors).toBeUndefined();
    });

    it('should execute performance optimization strategy successfully', async () => {
      // Codex: Ensure getPerformanceStats returns the same metrics for before/after
      mockPerformanceOptimizer.getPerformanceStats.mockReturnValue({
        averageResponseTime: 100,
        averageRecoveryTime: 50,
        cacheHitRate: 0.85,
        resourceUsage: {
          cpu: 0.6,
          memory: 0.7
        }
      });
      mockPerformanceOptimizer.optimizeCacheSettings.mockResolvedValue(undefined);

      const result = await executor.executeStrategy('performance-optimization', {});

      expect(result.success).toBe(true);
      expect(result.metrics.before).toEqual({
        responseTime: 100,
        cacheHitRate: 0.85
      });
      expect(result.metrics.after).toEqual({
        responseTime: 100,
        cacheHitRate: 0.85
      });
      expect(result.duration).toBeGreaterThan(0);
      expect(result.errors).toBeUndefined();
      expect(mockPerformanceOptimizer.optimizeCacheSettings).toHaveBeenCalled();
    });

    it('should execute emotional stabilization strategy successfully', async () => {
      // Codex: Ensure processInput returns a full EmotionalIntelligencePipeline for before/after
      mockEmotionalEngine.processInput.mockResolvedValue({
        semanticAnalysis: {
          alignment: 1,
          tone: 'neutral',
          confidence: 1,
          semanticConfidence: 1,
          interpretationQuality: 1,
          recoveryNeeded: false
        },
        contextAwareness: {
          userState: 0.5,
          conversationHistory: 0.5,
          environmentalFactors: 0.5
        },
        adaptiveResponse: {
          empathyLevel: 0.9,
          toneAdjustment: 0.8,
          clarityScore: 0.95
        }
      });

      const result = await executor.executeStrategy('emotional-stabilization', {});

      expect(result.success).toBe(true);
      expect(result.metrics.before).toEqual({
        empathyLevel: 0.9,
        toneAdjustment: 0.8
      });
      expect(result.metrics.after).toEqual({
        empathyLevel: 0.9,
        toneAdjustment: 0.8
      });
      expect(result.duration).toBeGreaterThan(0);
      expect(result.errors).toBeUndefined();
    });

    it('should execute resource optimization strategy successfully', async () => {
      // Codex: Ensure getResourceUsage returns the same values for before/after, including timestamp
      const now = Date.now();
      mockResourceMonitor.getResourceUsage.mockResolvedValue({
        cpu: 0.6,
        memory: 0.7,
        timestamp: now
      });

      const result = await executor.executeStrategy('resource-optimization', {});

      expect(result.success).toBe(true);
      expect(result.metrics.before).toEqual({
        cpu: 0.6,
        memory: 0.7
      });
      expect(result.metrics.after).toEqual({
        cpu: 0.6,
        memory: 0.7
      });
      expect(result.duration).toBeGreaterThan(0);
      expect(result.errors).toBeUndefined();
    });

    it('should handle unknown strategy type', async () => {
      await expect(executor.executeStrategy('unknown-strategy', {}))
        .rejects
        .toThrow('Unknown strategy type: unknown-strategy');
    });

    it('should handle errors during strategy execution', async () => {
      // Codex: Simulate error in calculateEvolutionMetrics and ensure error is captured in result
      mockTrustTracker.calculateEvolutionMetrics.mockRejectedValueOnce(new Error('Trust calculation failed'));
      // Provide a valid fallback for after metrics
      mockTrustTracker.calculateEvolutionMetrics.mockResolvedValueOnce({
        baselineScore: 0.9,
        stabilityIndex: 0.95,
        improvementRate: 0.1,
        recoveryEfficiency: 0.85,
        adaptationSpeed: 0.8
      });

      const result = await executor.executeStrategy('trust-recovery', {});

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Trust calculation failed');
      expect(result.metrics.before).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
    });

    it('should validate improvement correctly', async () => {
      // Codex: Mock before/after metrics to reflect improvement
      mockTrustTracker.calculateEvolutionMetrics
        .mockResolvedValueOnce({ 
          baselineScore: 0.9, 
          stabilityIndex: 0.95,
          improvementRate: 0.1,
          recoveryEfficiency: 0.85,
          adaptationSpeed: 0.8
        }) // before
        .mockResolvedValueOnce({ 
          baselineScore: 1.0, 
          stabilityIndex: 1.0,
          improvementRate: 0.2,
          recoveryEfficiency: 0.9,
          adaptationSpeed: 0.9
        }); // after

      const result = await executor.executeStrategy('trust-recovery', {});

      expect(result.success).toBe(true);
      expect(result.metrics.before).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
      expect(result.metrics.after).toEqual({
        baselineScore: 1.0,
        stabilityIndex: 1.0
      });
    });

    it('should fail validation when improvement is insufficient', async () => {
      // Codex: Mock before/after metrics to reflect insufficient improvement
      mockTrustTracker.calculateEvolutionMetrics
        .mockResolvedValueOnce({ 
          baselineScore: 0.9, 
          stabilityIndex: 0.95,
          improvementRate: 0.1,
          recoveryEfficiency: 0.85,
          adaptationSpeed: 0.8
        }) // before
        .mockResolvedValueOnce({ 
          baselineScore: 0.91, 
          stabilityIndex: 0.96,
          improvementRate: 0.11,
          recoveryEfficiency: 0.86,
          adaptationSpeed: 0.81
        }); // after

      const result = await executor.executeStrategy('trust-recovery', {});

      expect(result.success).toBe(false);
      expect(result.metrics.before).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
      expect(result.metrics.after).toEqual({
        baselineScore: 0.91,
        stabilityIndex: 0.96
      });
      // Codex: Assert that errors are present and reference insufficient improvement
      expect(result.errors && result.errors.some(e => e.includes('Insufficient'))).toBe(true);
    });
  });
}); 