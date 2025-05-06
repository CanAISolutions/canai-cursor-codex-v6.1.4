/**
 * evolution-triggers/trigger-manager.test.ts
 * 
 * Purpose:
 * Tests the evolution trigger coordinator's ability to manage and process evolution events.
 */

import { EvolutionTriggerCoordinator } from './trigger-manager';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';

describe('EvolutionTriggerCoordinator', () => {
  let coordinator: EvolutionTriggerCoordinator;
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

    coordinator = new EvolutionTriggerCoordinator(
      mockTrustTracker,
      mockPerformanceOptimizer,
      mockEmotionalEngine,
      mockResourceMonitor
    );
  });

  describe('start/stop', () => {
    it('should start and stop monitoring', async () => {
      await coordinator.start();
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for monitoring to start
      await coordinator.stop();
    });
  });

  describe('handleTrigger', () => {
    it('should add trust recovery event with highest priority', async () => {
      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify event was processed
      expect(mockTrustTracker.calculateEvolutionMetrics).toHaveBeenCalled();
    });

    it('should add resource optimization event with second priority', async () => {
      await coordinator.handleTrigger('resource-optimization', {
        cpu: 0.8,
        memory: 0.9
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify event was processed
      expect(mockResourceMonitor.getResourceUsage).toHaveBeenCalled();
    });

    it('should add performance optimization event with third priority', async () => {
      await coordinator.handleTrigger('performance-optimization', {
        responseTime: 150,
        cacheHitRate: 0.7
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify event was processed
      expect(mockPerformanceOptimizer.getPerformanceStats).toHaveBeenCalled();
    });

    it('should add emotional stabilization event with fourth priority', async () => {
      await coordinator.handleTrigger('emotional-stabilization', {
        empathyLevel: 0.7,
        toneAdjustment: 0.6
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify event was processed
      expect(mockEmotionalEngine.processInput).toHaveBeenCalled();
    });

    it('should handle multiple events in priority order', async () => {
      // Add events in reverse priority order
      await coordinator.handleTrigger('emotional-stabilization', {
        empathyLevel: 0.7,
        toneAdjustment: 0.6
      });
      await coordinator.handleTrigger('performance-optimization', {
        responseTime: 150,
        cacheHitRate: 0.7
      });
      await coordinator.handleTrigger('resource-optimization', {
        cpu: 0.8,
        memory: 0.9
      });
      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify events were processed in priority order
      expect(mockTrustTracker.calculateEvolutionMetrics).toHaveBeenCalled();
      expect(mockResourceMonitor.getResourceUsage).toHaveBeenCalled();
      expect(mockPerformanceOptimizer.getPerformanceStats).toHaveBeenCalled();
      expect(mockEmotionalEngine.processInput).toHaveBeenCalled();
    });

    it('should handle failed strategy execution', async () => {
      // Mock strategy execution failure
      mockTrustTracker.calculateEvolutionMetrics.mockRejectedValueOnce(new Error('Trust calculation failed'));

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify emotional stabilization was triggered as fallback
      expect(mockEmotionalEngine.processInput).toHaveBeenCalled();
    });
  });
}); 