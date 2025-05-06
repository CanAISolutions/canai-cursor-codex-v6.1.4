/**
 * evolution-triggers/evolution-trigger.test.ts
 * 
 * Purpose:
 * Tests the evolution trigger functionality, particularly the handleEvent method.
 */

import { EvolutionTriggerManager } from './evolution-trigger';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';
import { HeartbeatEvent } from '../heartbeat/heartbeat-monitor';

describe('EvolutionTriggerManager', () => {
  let manager: EvolutionTriggerManager;
  let trustTracker: TrustEvolutionTracker;
  let performanceOptimizer: PerformanceOptimizer;
  let emotionalEngine: EmotionalIntelligenceEngine;
  let resourceMonitor: ResourceMonitor;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    trustTracker = {
      calculateEvolutionMetrics: jest.fn().mockResolvedValue({
        baselineScore: 0.8,
        improvementRate: 0.1,
        stabilityIndex: 0.9,
        recoveryEfficiency: 0.8,
        adaptationSpeed: 0.7
      })
    } as any;

    performanceOptimizer = {
      getPerformanceStats: jest.fn().mockReturnValue({
        cacheHitRate: 0.9,
        averageResponseTime: 100
      })
    } as any;

    emotionalEngine = {
      processInput: jest.fn().mockResolvedValue({
        adaptiveResponse: {
          empathyLevel: 0.8
        }
      })
    } as any;

    resourceMonitor = {
      getResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.5,
        memory: 0.5
      })
    } as any;

    manager = new EvolutionTriggerManager(
      trustTracker,
      performanceOptimizer,
      emotionalEngine,
      resourceMonitor
    );

    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('handleEvent', () => {
    it('should handle performance trigger from heartbeat event', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.2,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.8
        },
        message: 'WARNING: Agent responsiveness below threshold'
      };

      await manager.handleEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Evolution trigger activated: performance'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Current metrics:',
        expect.objectContaining({
          responsiveness: 0.2
        })
      );
    });

    it('should handle resource trigger from heartbeat event', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.8
        },
        message: 'WARNING: High resource usage detected'
      };

      await manager.handleEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Evolution trigger activated: resource'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Current metrics:',
        expect.objectContaining({
          cpu: 0.95,
          memory: 0.95
        })
      );
    });

    it('should handle trust trigger from heartbeat event', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.4
        },
        message: 'WARNING: Trust score below threshold'
      };

      await manager.handleEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Evolution trigger activated: trust'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Current metrics:',
        expect.objectContaining({
          trustScore: 0.4
        })
      );
    });

    it('should handle emotional trigger as fallback', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.8
        },
        message: 'WARNING: Emotional drift detected'
      };

      await manager.handleEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Evolution trigger activated: emotional'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Current metrics:',
        expect.objectContaining({
          responsiveness: 0.8
        })
      );
    });

    it('should extract all relevant metrics from heartbeat event', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.2,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.4
        },
        message: 'WARNING: Multiple issues detected'
      };

      await manager.handleEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Current metrics:',
        expect.objectContaining({
          responsiveness: 0.2,
          cpu: 0.95,
          memory: 0.95,
          trustScore: 0.4
        })
      );
    });
  });
}); 