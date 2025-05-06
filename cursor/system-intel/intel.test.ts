/**
 * system-intel/intel.test.ts
 * 
 * Purpose:
 * Validates the system-intel module's aggregation and metrics handling.
 * Tests edge cases and integration scenarios.
 */

import { IntelAggregator, SystemIntelMetrics, AgentMetrics } from './intel-aggregator';
import { AgentStatusSurface } from './agent-status-surface';
import { SnapshotEmitter } from './snapshot-emitter';
import { TrustTimeline } from './trust-timeline';
import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { HeartbeatMonitor } from '../heartbeat/heartbeat-monitor';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';
import { ResourceMonitor } from '../optimization/resource-monitor';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('System Intel Module', () => {
  let intelAggregator: IntelAggregator;
  let eventBus: EventBus;
  let trustScorer: TrustScorer;
  let heartbeatMonitor: HeartbeatMonitor;
  let evolutionManager: EvolutionTriggerManager;
  let resourceMonitor: ResourceMonitor;
  let statusSurface: AgentStatusSurface;
  let snapshotEmitter: SnapshotEmitter;
  let trustTimeline: TrustTimeline;

  beforeEach(() => {
    eventBus = new EventBus();
    trustScorer = {
      getTrustScore: jest.fn().mockResolvedValue(0.9),
      adjustTrustScore: jest.fn()
    } as any;
    heartbeatMonitor = {
      getAgentStatus: jest.fn().mockResolvedValue({
        lastHeartbeat: new Date().toISOString(),
        isActive: true
      }),
      getActiveAgents: jest.fn().mockResolvedValue(['agent-1', 'agent-2'])
    } as any;
    evolutionManager = {
      handleEvent: jest.fn()
    } as any;
    resourceMonitor = {
      getAgentResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.5,
        memory: 0.5,
        responseTime: 100
      })
    } as any;

    statusSurface = new AgentStatusSurface(
      trustScorer,
      heartbeatMonitor,
      resourceMonitor
    );
    snapshotEmitter = new SnapshotEmitter();
    trustTimeline = new TrustTimeline();

    intelAggregator = new IntelAggregator(
      eventBus,
      trustScorer,
      heartbeatMonitor,
      evolutionManager,
      resourceMonitor
    );
  });

  describe('IntelAggregator', () => {
    it('should initialize with empty metrics', () => {
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents).toEqual({});
      expect(metrics.recentViolations).toEqual([]);
      expect(metrics.trustTimeline).toEqual([]);
      expect(metrics.systemHealth).toBe('stable');
    });

    it('should handle trust signal events', async () => {
      const event = {
        data: {
          component: 'agent-1',
          score: 0.95
        }
      };

      await eventBus.emit('trust:signal', event);
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].trustScore).toBe(0.95);
    });

    it('should handle trust warning events', async () => {
      const event = {
        data: {
          component: 'agent-1',
          score: 0.75
        }
      };

      await eventBus.emit('trust:warning', event);
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('warning');
      expect(metrics.agents['agent-1'].trustScore).toBe(0.75);
    });

    it('should handle trust violation events', async () => {
      const event = {
        data: {
          component: 'agent-1',
          score: 0.5
        }
      };

      await eventBus.emit('trust:violation', event);
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('critical');
      expect(metrics.recentViolations).toHaveLength(1);
      expect(metrics.systemHealth).toBe('critical');
    });

    it('should handle heartbeat events', async () => {
      const event = {
        data: {
          agentId: 'agent-1',
          metrics: {
            resourceUsage: {
              cpu: 0.6,
              memory: 0.7
            }
          }
        }
      };

      await eventBus.emit('heartbeat:ping', event);
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('healthy');
      expect(metrics.agents['agent-1'].resourceUsage).toEqual({
        cpu: 0.6,
        memory: 0.7
      });
    });

    it('should handle evolution events', async () => {
      const event = {
        data: {
          agentId: 'agent-1',
          triggerType: 'performance'
        }
      };

      await eventBus.emit('evolution:triggered', event);
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].lastTrigger).toBe('performance');
    });

    it('should recover from metric ingestion failures', async () => {
      // Simulate a failed metric ingestion
      const failedEvent = {
        data: {
          component: 'agent-1',
          score: 'invalid' // Invalid score type
        }
      };

      // Should not throw error
      await eventBus.emit('trust:signal', failedEvent);

      // Verify system remains stable
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.systemHealth).toBe('stable');

      // Verify subsequent valid events are processed
      const validEvent = {
        data: {
          component: 'agent-1',
          score: 0.9
        }
      };

      await eventBus.emit('trust:signal', validEvent);
      const updatedMetrics = intelAggregator.getCurrentMetrics();
      expect(updatedMetrics.agents['agent-1'].trustScore).toBe(0.9);
    });
  });

  describe('AgentStatusSurface', () => {
    it('should gather agent metrics', async () => {
      const metrics = await statusSurface.getAgentStatus('agent-1');
      expect(metrics).toMatchObject({
        status: 'healthy',
        trustScore: 0.9,
        resourceUsage: {
          cpu: 0.5,
          memory: 0.5,
          responseTime: 100
        }
      });
    });

    it('should handle missing monitors gracefully', async () => {
      const surface = new AgentStatusSurface();
      const metrics = await surface.getAgentStatus('agent-1');
      expect(metrics).toMatchObject({
        status: 'healthy',
        trustScore: 1.0,
        resourceUsage: {
          cpu: 0,
          memory: 0,
          responseTime: 0
        }
      });
    });

    it('should determine agent status correctly', async () => {
      const metrics = await statusSurface.getAgentStatus('agent-1');
      expect(metrics.status).toBe('healthy');

      // Test warning status
      (trustScorer.getTrustScore as jest.Mock).mockResolvedValueOnce(0.75);
      const warningMetrics = await statusSurface.getAgentStatus('agent-1');
      expect(warningMetrics.status).toBe('warning');

      // Test critical status
      (trustScorer.getTrustScore as jest.Mock).mockResolvedValueOnce(0.5);
      const criticalMetrics = await statusSurface.getAgentStatus('agent-1');
      expect(criticalMetrics.status).toBe('critical');
    });
  });

  describe('SnapshotEmitter', () => {
    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.readdir as jest.Mock).mockResolvedValue([]);
    });

    it('should emit snapshots at configured intervals', async () => {
      const metrics: SystemIntelMetrics = {
        timestamp: new Date().toISOString(),
        agents: {},
        recentViolations: [],
        trustTimeline: [],
        systemHealth: 'stable'
      };

      await snapshotEmitter.emitSnapshot(metrics);
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should maintain snapshot history size limit', async () => {
      const mockFiles = Array.from({ length: 1100 }, (_, i) => `snapshot_${i}.json`);
      (fs.promises.readdir as jest.Mock).mockResolvedValueOnce(mockFiles);
      (fs.statSync as jest.Mock).mockReturnValue({ mtime: { getTime: () => Date.now() } });

      const metrics: SystemIntelMetrics = {
        timestamp: new Date().toISOString(),
        agents: {},
        recentViolations: [],
        trustTimeline: [],
        systemHealth: 'stable'
      };

      await snapshotEmitter.emitSnapshot(metrics);
      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should handle partial agent failure during snapshot generation', async () => {
      const metrics: SystemIntelMetrics = {
        timestamp: new Date().toISOString(),
        agents: {
          'agent-1': {
            status: 'healthy',
            trustScore: 0.9,
            lastHeartbeat: new Date().toISOString()
          },
          'agent-2': {
            status: 'critical',
            trustScore: 0.3,
            lastHeartbeat: new Date(Date.now() - 60000).toISOString()
          }
        },
        recentViolations: [{
          agentId: 'agent-2',
          timestamp: new Date().toISOString(),
          violationType: 'trust',
          details: 'Trust score below threshold'
        }],
        trustTimeline: [],
        systemHealth: 'critical'
      };

      await snapshotEmitter.emitSnapshot(metrics);
      const snapshot = await snapshotEmitter.getLatestSnapshot();
      expect(snapshot).toBeDefined();
      expect(snapshot?.agents['agent-1'].status).toBe('healthy');
      expect(snapshot?.agents['agent-2'].status).toBe('critical');
      expect(snapshot?.systemHealth).toBe('critical');
    });
  });

  describe('TrustTimeline', () => {
    it('should record trust deltas', async () => {
      await trustTimeline.recordDelta('agent-1', 0.9);
      const deltas = await trustTimeline.getRecentDeltas('agent-1');
      expect(deltas).toHaveLength(1);
      expect(deltas[0].currentScore).toBe(0.9);
    });

    it('should calculate trust trends', async () => {
      // Record a series of deltas
      await trustTimeline.recordDelta('agent-1', 0.9);
      await trustTimeline.recordDelta('agent-1', 0.85);
      await trustTimeline.recordDelta('agent-1', 0.8);

      const trend = await trustTimeline.getTrustTrend('agent-1');
      expect(trend.trend).toBe('degrading');
      expect(trend.averageDelta).toBeLessThan(0);
    });

    it('should handle time range queries', async () => {
      const startTime = new Date(Date.now() - 3600000).toISOString();
      const endTime = new Date().toISOString();

      await trustTimeline.recordDelta('agent-1', 0.9);
      const deltas = await trustTimeline.getDeltasInRange(startTime, endTime, 'agent-1');
      expect(deltas).toHaveLength(1);
    });

    it('should calculate trust volatility over multiple time ranges', async () => {
      // Record deltas with varying volatility
      const timestamps = [
        Date.now() - 3600000, // 1 hour ago
        Date.now() - 1800000, // 30 minutes ago
        Date.now() - 900000,  // 15 minutes ago
        Date.now() - 450000,  // 7.5 minutes ago
        Date.now()            // now
      ];

      const scores = [0.9, 0.7, 0.8, 0.6, 0.9]; // High volatility pattern
      for (let i = 0; i < timestamps.length; i++) {
        await trustTimeline.recordDelta('agent-1', scores[i]);
      }

      // Check volatility in different time windows
      const shortTermTrend = await trustTimeline.getTrustTrend('agent-1', 3);
      const longTermTrend = await trustTimeline.getTrustTrend('agent-1', 5);

      expect(shortTermTrend.volatility).toBeGreaterThan(0);
      expect(longTermTrend.volatility).toBeGreaterThan(shortTermTrend.volatility);
    });
  });
}); 