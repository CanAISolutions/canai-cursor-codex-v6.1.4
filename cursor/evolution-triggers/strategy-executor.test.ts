/**
 * evolution-triggers/strategy-executor.test.ts
 * 
 * Purpose:
 * Tests the evolution strategy executor's ability to execute and validate strategies.
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
      })
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
  });

  describe('executeStrategy', () => {
    it('should execute trust recovery strategy successfully', async () => {
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
      mockTrustTracker.calculateEvolutionMetrics.mockRejectedValueOnce(new Error('Trust calculation failed'));

      const result = await executor.executeStrategy('trust-recovery', {});

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Trust calculation failed');
      expect(result.metrics.before).toEqual({
        baselineScore: 0.9,
        stabilityIndex: 0.95
      });
    });

    it('should validate improvement correctly', async () => {
      // Mock improved metrics
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
      // Mock insufficient improvement
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
    });
  });
}); 