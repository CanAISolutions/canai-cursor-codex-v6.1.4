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

// Mock interfaces for better type safety and test clarity
interface MockTrustScorer extends Partial<TrustScorer> {
  getTrustScore: jest.Mock;
  adjustTrustScore: jest.Mock;
  getTrustHistory: jest.Mock;
  getTrustTrend: jest.Mock;
  getTrustVolatility: jest.Mock;
  getTrustStability: jest.Mock;
  TRUST_FILE: string;
  MINIMUM_THRESHOLD: number;
  MAXIMUM_SCORE: number;
  MINIMUM_SCORE: number;
  HISTORY_WINDOW: number;
  MIN_SAMPLES: number;
  scoreHistory: Array<{ timestamp: number; score: number }>;
}

interface MockHeartbeatMonitor extends Partial<HeartbeatMonitor> {
  getAgentStatus: jest.Mock;
  getActiveAgents: jest.Mock;
  getAgentHistory: jest.Mock;
  getAgentTrends: jest.Mock;
  recordHeartbeat: jest.Mock;
  agents: Set<string>;
  PING_INTERVAL: number;
  RESPONSIVENESS_THRESHOLD: number;
  WARNING_THRESHOLD: number;
  MAX_HISTORY_SIZE: number;
  heartbeatHistory: Map<string, Array<{ timestamp: number; status: string }>>;
}

interface MockEvolutionManager extends Partial<EvolutionTriggerManager> {
  handleEvent: jest.Mock;
  getTriggerHistory: jest.Mock;
  getTriggerTrends: jest.Mock;
  recordTrigger: jest.Mock;
  triggers: Map<string, any>;
  DEFAULT_TIMEOUT: number;
  monitoringInterval: NodeJS.Timeout;
  trustTracker: any;
  MAX_HISTORY_SIZE: number;
  triggerHistory: Array<{ timestamp: number; type: string; data: any }>;
}

interface MockResourceMonitor extends Partial<ResourceMonitor> {
  getAgentResourceUsage: jest.Mock;
  getResourceHistory: jest.Mock;
  getResourceTrends: jest.Mock;
  recordResourceEvent: jest.Mock;
  DEFAULT_CPU_WARNING: number;
  DEFAULT_CPU_CRITICAL: number;
  DEFAULT_MEMORY_WARNING: number;
  DEFAULT_MEMORY_CRITICAL: number;
  MAX_HISTORY_SIZE: number;
  resourceHistory: Map<string, Array<{ timestamp: number; usage: any }>>;
}

describe('System Intel Module', () => {
  let intelAggregator: IntelAggregator;
  let eventBus: EventBus;
  let trustScorer: MockTrustScorer;
  let heartbeatMonitor: MockHeartbeatMonitor;
  let evolutionManager: MockEvolutionManager;
  let resourceMonitor: MockResourceMonitor;
  let statusSurface: AgentStatusSurface;
  let snapshotEmitter: SnapshotEmitter;
  let trustTimeline: TrustTimeline;

  beforeEach(() => {
    eventBus = new EventBus();
    trustScorer = {
      getTrustScore: jest.fn().mockResolvedValue(0.9),
      adjustTrustScore: jest.fn(),
      getTrustHistory: jest.fn().mockResolvedValue([]),
      getTrustTrend: jest.fn().mockResolvedValue({ trend: 'stable', averageDelta: 0 }),
      getTrustVolatility: jest.fn().mockResolvedValue(0.1),
      getTrustStability: jest.fn().mockResolvedValue(0.95),
      TRUST_FILE: 'trust.json',
      MINIMUM_THRESHOLD: 0.7,
      MAXIMUM_SCORE: 1.0,
      MINIMUM_SCORE: 0.0,
      HISTORY_WINDOW: 3600000,
      MIN_SAMPLES: 10,
      scoreHistory: []
    } as unknown as MockTrustScorer;

    heartbeatMonitor = {
      getAgentStatus: jest.fn().mockResolvedValue({
        lastHeartbeat: new Date().toISOString(),
        isActive: true
      }),
      getActiveAgents: jest.fn().mockResolvedValue(['agent-1', 'agent-2']),
      getAgentHistory: jest.fn().mockResolvedValue([]),
      getAgentTrends: jest.fn().mockResolvedValue({ trend: 'stable', averageDelta: 0 }),
      recordHeartbeat: jest.fn(),
      agents: new Set(['agent-1', 'agent-2']),
      PING_INTERVAL: 5000,
      RESPONSIVENESS_THRESHOLD: 10000,
      WARNING_THRESHOLD: 15000,
      MAX_HISTORY_SIZE: 1000,
      heartbeatHistory: new Map()
    } as unknown as MockHeartbeatMonitor;

    evolutionManager = {
      handleEvent: jest.fn(),
      getTriggerHistory: jest.fn().mockResolvedValue([]),
      getTriggerTrends: jest.fn().mockResolvedValue({ trend: 'stable', averageDelta: 0 }),
      recordTrigger: jest.fn(),
      triggers: new Map(),
      DEFAULT_TIMEOUT: 30000,
      monitoringInterval: setInterval(() => {}, 1000),
      trustTracker: {},
      MAX_HISTORY_SIZE: 1000,
      triggerHistory: []
    } as unknown as MockEvolutionManager;

    resourceMonitor = {
      getAgentResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.5,
        memory: 0.5,
        responseTime: 100
      }),
      getResourceHistory: jest.fn().mockResolvedValue([]),
      getResourceTrends: jest.fn().mockResolvedValue({ trend: 'stable', averageDelta: 0 }),
      recordResourceEvent: jest.fn(),
      DEFAULT_CPU_WARNING: 0.7,
      DEFAULT_CPU_CRITICAL: 0.9,
      DEFAULT_MEMORY_WARNING: 0.7,
      DEFAULT_MEMORY_CRITICAL: 0.9,
      MAX_HISTORY_SIZE: 1000,
      resourceHistory: new Map()
    } as unknown as MockResourceMonitor;

    statusSurface = new AgentStatusSurface(
      trustScorer as unknown as TrustScorer,
      heartbeatMonitor as unknown as HeartbeatMonitor,
      resourceMonitor as unknown as ResourceMonitor
    );
    snapshotEmitter = new SnapshotEmitter();
    trustTimeline = new TrustTimeline();

    intelAggregator = new IntelAggregator(
      eventBus,
      trustScorer as unknown as TrustScorer,
      heartbeatMonitor as unknown as HeartbeatMonitor,
      evolutionManager as unknown as EvolutionTriggerManager,
      resourceMonitor as unknown as ResourceMonitor
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
      await eventBus.publish({
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'agent-1',
          score: 0.95
        }
      }, 'medium');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].trustScore).toBe(0.95);
      expect(trustScorer.getTrustHistory).toHaveBeenCalled();
      expect(trustScorer.getTrustTrend).toHaveBeenCalled();
    });

    it('should handle trust warning events', async () => {
      await eventBus.publish({
        type: 'trust:warning',
        timestamp: new Date().toISOString(),
        data: {
          component: 'agent-1',
          score: 0.75
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('warning');
      expect(metrics.agents['agent-1'].trustScore).toBe(0.75);
      expect(trustScorer.getTrustVolatility).toHaveBeenCalled();
      expect(trustScorer.getTrustStability).toHaveBeenCalled();
    });

    it('should handle trust violation events', async () => {
      await eventBus.publish({
        type: 'trust:violation',
        timestamp: new Date().toISOString(),
        data: {
          component: 'agent-1',
          score: 0.5
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('critical');
      expect(metrics.recentViolations).toHaveLength(1);
      expect(metrics.systemHealth).toBe('critical');
      expect(trustScorer.getTrustHistory).toHaveBeenCalled();
      expect(trustScorer.getTrustTrend).toHaveBeenCalled();
    });

    it('should handle heartbeat events', async () => {
      await eventBus.publish({
        type: 'heartbeat:ping',
        timestamp: new Date().toISOString(),
        data: {
          agentId: 'agent-1',
          metrics: {
            resourceUsage: {
              cpu: 0.6,
              memory: 0.7
            }
          }
        }
      }, 'medium');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('healthy');
      expect(metrics.agents['agent-1'].resourceUsage).toEqual({
        cpu: 0.6,
        memory: 0.7
      });
      expect(heartbeatMonitor.getAgentHistory).toHaveBeenCalled();
      expect(heartbeatMonitor.getAgentTrends).toHaveBeenCalled();
    });

    it('should handle evolution events', async () => {
      await eventBus.publish({
        type: 'evolution:triggered',
        timestamp: new Date().toISOString(),
        data: {
          agentId: 'agent-1',
          triggerType: 'performance'
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].lastTrigger).toBe('performance');
      expect(evolutionManager.getTriggerHistory).toHaveBeenCalled();
      expect(evolutionManager.getTriggerTrends).toHaveBeenCalled();
    });

    it('should recover from metric ingestion failures', async () => {
      await eventBus.publish({
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'agent-1',
          score: 'invalid' // Invalid score type
        }
      }, 'medium');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.systemHealth).toBe('stable');

      await eventBus.publish({
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'agent-1',
          score: 0.9
        }
      }, 'medium');

      const updatedMetrics = intelAggregator.getCurrentMetrics();
      expect(updatedMetrics.agents['agent-1'].trustScore).toBe(0.9);
    });

    it('should handle concurrent metric updates', async () => {
      const events = [
        {
          type: 'trust:signal',
          timestamp: new Date().toISOString(),
          data: {
            component: 'agent-1',
            score: 0.95
          }
        },
        {
          type: 'trust:signal',
          timestamp: new Date().toISOString(),
          data: {
            component: 'agent-2',
            score: 0.85
          }
        }
      ];

      await Promise.all(events.map(event => eventBus.publish(event, 'medium')));
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].trustScore).toBe(0.95);
      expect(metrics.agents['agent-2'].trustScore).toBe(0.85);
    });

    it('should maintain violation history size limit', async () => {
      const events = Array.from({ length: 1100 }, (_, i) => ({
        type: 'trust:violation',
        timestamp: new Date().toISOString(),
        data: {
          component: `agent-${i}`,
          score: 0.3
        }
      }));

      await Promise.all(events.map(event => eventBus.publish(event, 'high')));
      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.recentViolations).toHaveLength(1000); // Should be capped
    });

    it('should handle resource threshold violations', async () => {
      await eventBus.publish({
        type: 'heartbeat:ping',
        timestamp: new Date().toISOString(),
        data: {
          agentId: 'agent-1',
          metrics: {
            resourceUsage: {
              cpu: 0.95, // Above critical threshold
              memory: 0.85 // Above warning threshold
            }
          }
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('critical');
      expect(metrics.agents['agent-1'].resourceUsage).toEqual({
        cpu: 0.95,
        memory: 0.85
      });
      expect(resourceMonitor.getResourceHistory).toHaveBeenCalled();
      expect(resourceMonitor.getResourceTrends).toHaveBeenCalled();
    });

    it('should handle evolution trigger failures', async () => {
      await eventBus.publish({
        type: 'evolution:failed',
        timestamp: new Date().toISOString(),
        data: {
          agentId: 'agent-1',
          triggerType: 'performance',
          error: 'Trigger failed'
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].lastError).toBe('Trigger failed');
      expect(metrics.agents['agent-1'].status).toBe('warning');
    });

    it('should handle heartbeat timeouts', async () => {
      const oldTimestamp = new Date(Date.now() - 20000).toISOString(); // 20 seconds ago
      await eventBus.publish({
        type: 'heartbeat:timeout',
        timestamp: new Date().toISOString(),
        data: {
          agentId: 'agent-1',
          lastHeartbeat: oldTimestamp,
          isActive: false
        }
      }, 'high');

      const metrics = intelAggregator.getCurrentMetrics();
      expect(metrics.agents['agent-1'].status).toBe('warning');
      expect(metrics.agents['agent-1'].lastHeartbeat).toBe(oldTimestamp);
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

    it('should handle monitor failures gracefully', async () => {
      (trustScorer.getTrustScore as jest.Mock).mockRejectedValueOnce(new Error('Trust score error'));
      (heartbeatMonitor.getAgentStatus as jest.Mock).mockRejectedValueOnce(new Error('Heartbeat error'));
      (resourceMonitor.getAgentResourceUsage as jest.Mock).mockRejectedValueOnce(new Error('Resource error'));

      const metrics = await statusSurface.getAgentStatus('agent-1');
      expect(metrics).toMatchObject({
        status: 'unknown',
        trustScore: 1.0,
        resourceUsage: {
          cpu: 0,
          memory: 0,
          responseTime: 0
        }
      });
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

    it('should handle file system errors gracefully', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Write error'));
      (fs.promises.readdir as jest.Mock).mockRejectedValueOnce(new Error('Read error'));

      const metrics: SystemIntelMetrics = {
        timestamp: new Date().toISOString(),
        agents: {},
        recentViolations: [],
        trustTimeline: [],
        systemHealth: 'stable'
      };

      await expect(snapshotEmitter.emitSnapshot(metrics)).resolves.not.toThrow();
      const snapshot = await snapshotEmitter.getLatestSnapshot();
      expect(snapshot).toBeNull();
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

    it('should handle concurrent delta recordings', async () => {
      const deltas = [
        { agentId: 'agent-1', score: 0.9 },
        { agentId: 'agent-2', score: 0.85 },
        { agentId: 'agent-1', score: 0.8 }
      ];

      await Promise.all(deltas.map(d => trustTimeline.recordDelta(d.agentId, d.score)));
      const agent1Deltas = await trustTimeline.getRecentDeltas('agent-1');
      const agent2Deltas = await trustTimeline.getRecentDeltas('agent-2');

      expect(agent1Deltas).toHaveLength(2);
      expect(agent2Deltas).toHaveLength(1);
      expect(agent1Deltas[1].currentScore).toBe(0.8);
      expect(agent2Deltas[0].currentScore).toBe(0.85);
    });

    it('should handle invalid time ranges gracefully', async () => {
      const endTime = new Date(Date.now() - 3600000).toISOString();
      const startTime = new Date().toISOString(); // Invalid: end before start

      const deltas = await trustTimeline.getDeltasInRange(startTime, endTime, 'agent-1');
      expect(deltas).toHaveLength(0);
    });
  });
}); 