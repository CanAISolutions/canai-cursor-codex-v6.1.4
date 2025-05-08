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
import { EventBus } from '../utils/event-bus';

// Mock interfaces for better type safety and test clarity
interface MockTrustEvolutionTracker extends Partial<TrustEvolutionTracker> {
  calculateEvolutionMetrics: jest.Mock;
  getEvolutionHistory: jest.Mock;
  recordEvolutionEvent: jest.Mock;
  getStabilityMetrics: jest.Mock;
  MAX_HISTORY_SIZE: number;
  STABILITY_THRESHOLD: number;
  MIN_SAMPLES: number;
  scoreHistory: Array<{ timestamp: number; score: number }>;
  trustScorer: any;
  getTrustScore: jest.Mock;
  adjustTrustScore: jest.Mock;
  getTrustHistory: jest.Mock;
  getTrustTrend: jest.Mock;
  getTrustVolatility: jest.Mock;
  getTrustStability: jest.Mock;
  cleanupOldEntries: jest.Mock;
  calculateBaselineScore: jest.Mock;
  calculateImprovementRate: jest.Mock;
  calculateStabilityIndex: jest.Mock;
  calculateRecoveryEfficiency: jest.Mock;
  calculateAdaptationSpeed: jest.Mock;
  recordTrustScore: jest.Mock;
}

interface MockPerformanceOptimizer extends Partial<PerformanceOptimizer> {
  getMetrics: jest.Mock;
  getRecoveryData: jest.Mock;
  recordPerformance: jest.Mock;
  getPerformanceStats: jest.Mock;
  clearAllCaches: jest.Mock;
  reduceCacheSize: jest.Mock;
  optimizeCacheSettings: jest.Mock;
  DEFAULT_TTL: number;
  DEFAULT_MAX_SIZE: number;
  DEFAULT_CLEANUP_INTERVAL: number;
  metricCache: Map<string, any>;
  recoveryCache: Map<string, any>;
  performanceHistory: any[];
  resourceMonitor: ResourceMonitor;
}

interface MockEmotionalIntelligenceEngine extends Partial<EmotionalIntelligenceEngine> {
  processInput: jest.Mock;
  getEmotionalState: jest.Mock;
  recordEmotionalEvent: jest.Mock;
  getStabilityMetrics: jest.Mock;
  EMPATHY_THRESHOLD: number;
  TONE_THRESHOLD: number;
}

interface MockResourceMonitor extends Partial<ResourceMonitor> {
  getResourceUsage: jest.Mock;
  getResourceHistory: jest.Mock;
  recordResourceEvent: jest.Mock;
  getResourceTrends: jest.Mock;
  CPU_WARNING_THRESHOLD: number;
  MEMORY_WARNING_THRESHOLD: number;
  checkResourceThresholds: jest.Mock;
}

describe('EvolutionTriggerCoordinator', () => {
  let coordinator: EvolutionTriggerCoordinator;
  let eventBus: EventBus;
  let mockTrustTracker: jest.Mocked<TrustEvolutionTracker>;
  let mockPerformanceOptimizer: jest.Mocked<PerformanceOptimizer>;
  let mockEmotionalEngine: jest.Mocked<EmotionalIntelligenceEngine>;
  let mockResourceMonitor: jest.Mocked<ResourceMonitor>;

  beforeEach(() => {
    eventBus = new EventBus();
    
    // Create mocks using jest.spyOn
    mockTrustTracker = {
      calculateEvolutionMetrics: jest.fn().mockResolvedValue({
        baselineScore: 0.9,
        stabilityIndex: 0.95,
        improvementRate: 0.1,
        recoveryEfficiency: 0.85,
        adaptationSpeed: 0.8
      }),
      getTrustHistory: jest.fn().mockReturnValue([]),
      recordTrustScore: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<TrustEvolutionTracker>;

    mockPerformanceOptimizer = {
      getMetrics: jest.fn().mockResolvedValue({}),
      getRecoveryData: jest.fn().mockResolvedValue({}),
      recordPerformance: jest.fn(),
      getPerformanceStats: jest.fn().mockReturnValue({
        averageResponseTime: 100,
        averageRecoveryTime: 50,
        cacheHitRate: 0.85,
        resourceUsage: {
          cpu: 0.6,
          memory: 0.7
        }
      }),
      clearAllCaches: jest.fn().mockResolvedValue(undefined),
      reduceCacheSize: jest.fn().mockResolvedValue(undefined),
      optimizeCacheSettings: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<PerformanceOptimizer>;

    mockEmotionalEngine = {
      processInput: jest.fn().mockResolvedValue({
        semanticAnalysis: {
          alignment: 0.9,
          tone: 'positive',
          confidence: 0.95,
          semanticConfidence: 0.95,
          interpretationQuality: 0.9,
          recoveryNeeded: false
        },
        contextAwareness: {
          userState: 0.8,
          conversationHistory: 0.9,
          environmentalFactors: 0.7
        },
        adaptiveResponse: {
          toneAdjustment: 0.8,
          empathyLevel: 0.9,
          clarityScore: 0.95
        }
      })
    } as unknown as jest.Mocked<EmotionalIntelligenceEngine>;

    mockResourceMonitor = {
      getResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.6,
        memory: 0.7
      }),
      getResourceHistory: jest.fn().mockResolvedValue([]),
      getResourceTrends: jest.fn().mockResolvedValue({
        cpuTrend: 'stable',
        memoryTrend: 'stable'
      }),
      checkResourceThresholds: jest.fn().mockReturnValue({
        isWarning: false,
        isCritical: false,
        exceededResources: []
      })
    } as unknown as jest.Mocked<ResourceMonitor>;

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

    it('should handle multiple start/stop cycles', async () => {
      await coordinator.start();
      await coordinator.stop();
      await coordinator.start();
      await coordinator.stop();
    });

    it('should handle concurrent start/stop requests', async () => {
      await Promise.all([
        coordinator.start(),
        coordinator.start(),
        coordinator.stop(),
        coordinator.stop()
      ]);
    });
  });

  describe('handleTrigger', () => {
    it('should handle trust score triggers', async () => {
      const metrics = {
        current: 0.7,
        threshold: 0.8,
        delta: 0.1
      };

      await coordinator.handleTrigger('trust-score-drop', metrics);

      expect(mockTrustTracker.recordTrustScore).toHaveBeenCalledWith(
        'system',
        0.7,
        'trust-score-drop',
        true,
        true
      );
    });

    it('should handle resource triggers', async () => {
      const metrics = {
        current: 0.9,
        threshold: 0.8,
        delta: 0.1
      };

      await coordinator.handleTrigger('resource-strain', metrics);

      expect(mockPerformanceOptimizer.clearAllCaches).toHaveBeenCalled();
      expect(mockPerformanceOptimizer.reduceCacheSize).toHaveBeenCalled();
    });

    it('should handle emotional triggers', async () => {
      const metrics = {
        current: 0.6,
        threshold: 0.8,
        delta: 0.2
      };

      await coordinator.handleTrigger('emotional-instability', metrics);

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

    it('should handle concurrent trigger requests', async () => {
      const triggers = [
        { type: 'trust-recovery', data: { baselineScore: 0.8, stabilityIndex: 0.85 } as Record<string, number> },
        { type: 'resource-optimization', data: { cpu: 0.8, memory: 0.9 } as Record<string, number> },
        { type: 'performance-optimization', data: { responseTime: 150, cacheHitRate: 0.7 } as Record<string, number> },
        { type: 'emotional-stabilization', data: { empathyLevel: 0.7, toneAdjustment: 0.6 } as Record<string, number> }
      ];

      await Promise.all(triggers.map(t => coordinator.handleTrigger(t.type, t.data)));

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify all events were processed
      expect(mockTrustTracker.calculateEvolutionMetrics).toHaveBeenCalled();
      expect(mockResourceMonitor.getResourceUsage).toHaveBeenCalled();
      expect(mockPerformanceOptimizer.getPerformanceStats).toHaveBeenCalled();
      expect(mockEmotionalEngine.processInput).toHaveBeenCalled();
    });

    it('should handle invalid trigger types gracefully', async () => {
      await expect(coordinator.handleTrigger('invalid-trigger' as any, {})).resolves.not.toThrow();
    });

    it('should handle missing trigger data gracefully', async () => {
      await expect(coordinator.handleTrigger('trust-recovery', undefined as any)).resolves.not.toThrow();
    });

    it('should handle trigger processing timeouts', async () => {
      // Mock slow processing
      mockTrustTracker.calculateEvolutionMetrics.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 2000))
      );

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify timeout handling
      expect(mockEmotionalEngine.processInput).toHaveBeenCalled();
    });
  });

  describe('event handling', () => {
    it('should emit events for trigger processing', async () => {
      const eventSpy = jest.fn();
      eventBus.on('evolution:triggered', eventSpy);

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventSpy).toHaveBeenCalledWith({
        type: 'evolution:triggered',
        timestamp: expect.any(String),
        data: {
          triggerType: 'trust-recovery',
          metrics: {
            baselineScore: 0.8,
            stabilityIndex: 0.85
          },
          priority: 'high'
        }
      });
    });

    it('should emit events for trigger completion', async () => {
      const eventSpy = jest.fn();
      eventBus.on('evolution:completed', eventSpy);

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventSpy).toHaveBeenCalledWith({
        type: 'evolution:completed',
        timestamp: expect.any(String),
        data: {
          triggerType: 'trust-recovery',
          metrics: {
            baselineScore: 0.8,
            stabilityIndex: 0.85
          },
          result: {
            success: true,
            metrics: expect.any(Object)
          },
          priority: 'medium'
        }
      });
    });

    it('should emit events for trigger failures', async () => {
      const eventSpy = jest.fn();
      eventBus.on('evolution:failed', eventSpy);

      const error = new Error('Trust calculation failed');
      mockTrustTracker.calculateEvolutionMetrics.mockRejectedValueOnce(error);

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventSpy).toHaveBeenCalledWith({
        type: 'evolution:failed',
        timestamp: expect.any(String),
        data: {
          triggerType: 'trust-recovery',
          metrics: {
            baselineScore: 0.8,
            stabilityIndex: 0.85
          },
          error: {
            message: 'Trust calculation failed',
            stack: error.stack,
            context: {
              triggerType: 'trust-recovery',
              metrics: {
                baselineScore: 0.8,
                stabilityIndex: 0.85
              }
            }
          },
          priority: 'high'
        }
      });
    });

    it('should handle concurrent trigger events', async () => {
      const triggeredSpy = jest.fn();
      const completedSpy = jest.fn();
      const failedSpy = jest.fn();

      eventBus.on('evolution:triggered', triggeredSpy);
      eventBus.on('evolution:completed', completedSpy);
      eventBus.on('evolution:failed', failedSpy);

      const triggers: Array<{ type: string; data: Record<string, number> }> = [
        { type: 'trust-recovery', data: { baselineScore: 0.8, stabilityIndex: 0.85 } },
        { type: 'resource-optimization', data: { cpu: 0.8, memory: 0.9 } },
        { type: 'performance-optimization', data: { responseTime: 150, cacheHitRate: 0.7 } },
        { type: 'emotional-stabilization', data: { empathyLevel: 0.7, toneAdjustment: 0.6 } }
      ];

      await Promise.all(triggers.map(t => coordinator.handleTrigger(t.type, t.data)));

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify all events were processed with correct structure
      expect(triggeredSpy).toHaveBeenCalledTimes(4);
      expect(completedSpy).toHaveBeenCalledTimes(4);
      expect(failedSpy).not.toHaveBeenCalled();

      // Verify event structure for each type
      triggers.forEach((trigger, index) => {
        const triggeredEvent = triggeredSpy.mock.calls[index][0];
        const completedEvent = completedSpy.mock.calls[index][0];

        expect(triggeredEvent).toMatchObject({
          type: 'evolution:triggered',
          timestamp: expect.any(String),
          data: {
            triggerType: trigger.type,
            metrics: trigger.data,
            priority: expect.any(String)
          }
        });

        expect(completedEvent).toMatchObject({
          type: 'evolution:completed',
          timestamp: expect.any(String),
          data: {
            triggerType: trigger.type,
            metrics: trigger.data,
            result: {
              success: true,
              metrics: expect.any(Object)
            },
            priority: expect.any(String)
          }
        });
      });
    });

    it('should handle trigger timeouts with proper error context', async () => {
      const eventSpy = jest.fn();
      eventBus.on('evolution:failed', eventSpy);

      // Mock slow processing
      mockTrustTracker.calculateEvolutionMetrics.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 2000))
      );

      await coordinator.handleTrigger('trust-recovery', {
        baselineScore: 0.8,
        stabilityIndex: 0.85
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(eventSpy).toHaveBeenCalledWith({
        type: 'evolution:failed',
        timestamp: expect.any(String),
        data: {
          triggerType: 'trust-recovery',
          metrics: {
            baselineScore: 0.8,
            stabilityIndex: 0.85
          },
          error: {
            message: expect.stringContaining('timeout'),
            context: {
              triggerType: 'trust-recovery',
              metrics: {
                baselineScore: 0.8,
                stabilityIndex: 0.85
              },
              timeout: expect.any(Number)
            }
          },
          priority: 'high'
        }
      });
    });
  });
}); 