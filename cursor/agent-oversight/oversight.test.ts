/**
 * agent-oversight/oversight.test.ts
 * 
 * Purpose:
 * Test suite for the agent oversight module, covering behavior tracking,
 * stagnation detection, and memory management.
 */

// Codex: Legacy non-canonical AIProvider methods and types removed as part of interface standardization (2025-05-15). All trust logic now uses canonical AIProvider from engines/ai-provider. See failure tracker for audit trail.
// If import error persists, fallback to local mock interface for test continuity.

import { OversightEngine } from './oversight-engine';
import { AgentMemory } from './agent-memory';
import { StagnationDetector } from './stagnation-detector';
import { EventBus } from '../event-bus/eventBus';
import { EventBusAgent } from '../agents/event-bus/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { AIProvider } from '../../agents/debug/engines/ai-provider';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';
import { SmartRevisionLoop } from '../self-healing/smart-revision-loop';
import { EnhancedVisionProcessor } from '../vision-injection/enhanced-vision-processor';
import * as fs from 'fs';
import * as path from 'path';

// Mock AIProvider implementation
class MockAIProvider implements AIProvider {
  async ping(): Promise<boolean> { return true; }
  async detectBug(log: string, traceId: string): Promise<any> { return { message: '', type: '', likelihood: 'high', impact: [] }; }
  async proposeFix(bug: any, traceId: string): Promise<any> { return { patch: '', filepath: '', reason: '' }; }
  async generateEscalationTicket(input: any): Promise<void> { return; }
}

jest.mock('fs');
jest.mock('path');
jest.mock('../utils/config-manager', () => ({
  loadConfig: jest.fn(() => ({ SESSION_ID: 'test-session', AGENT_VERSION: '1.1.0' }))
}));

describe('Agent Oversight Module', () => {
  let eventBus: EventBus;
  let eventBusAgent: EventBusAgent;
  let trustScorer: TrustScorer;
  let aiProvider: AIProvider;
  let evolutionManager: EvolutionTriggerManager;
  let agentMemory: AgentMemory;
  let stagnationDetector: StagnationDetector;
  let oversightEngine: OversightEngine;
  let trustTracker: TrustEvolutionTracker;
  let performanceOptimizer: PerformanceOptimizer;
  let emotionalEngine: EmotionalIntelligenceEngine;
  let resourceMonitor: ResourceMonitor;
  let revisionLoop: SmartRevisionLoop;
  let visionProcessor: EnhancedVisionProcessor;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    eventBusAgent = new EventBusAgent();
    aiProvider = new MockAIProvider();
    trustScorer = new TrustScorer(eventBusAgent, aiProvider);
    emotionalEngine = new EmotionalIntelligenceEngine();
    visionProcessor = new EnhancedVisionProcessor(emotionalEngine, trustScorer);
    trustTracker = new TrustEvolutionTracker(trustScorer);
    revisionLoop = new SmartRevisionLoop();
    performanceOptimizer = new PerformanceOptimizer(trustTracker, revisionLoop, visionProcessor);
    resourceMonitor = new ResourceMonitor();
    evolutionManager = new EvolutionTriggerManager(
      trustTracker,
      performanceOptimizer,
      emotionalEngine,
      resourceMonitor
    );
    agentMemory = new AgentMemory(eventBus);
    stagnationDetector = new StagnationDetector(agentMemory, eventBus);
    oversightEngine = new OversightEngine(
      eventBus,
      trustScorer,
      evolutionManager,
      agentMemory,
      stagnationDetector
    );

    // Mock fs.promises methods
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify({
      agentName: 'test-agent',
      sessionsTracked: 1,
      avgTrustDelta: 0.5,
      recoveryAttempts: 0,
      patternSubstitutions: 0,
      trustVolatility: 0.1,
      recentTriggers: []
    }));
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['test-agent.json']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('OversightEngine', () => {
    it('should handle trust signals and update metrics', async () => {
      const event = {
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'test-agent',
          score: 0.8,
          context: {
            sessionId: 'test-session',
            source: 'user-interaction'
          }
        }
      };

      await oversightEngine['handleTrustSignal'](event);

      expect(fs.promises.writeFile).toHaveBeenCalled();
      const writeCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.avgTrustDelta).toBeDefined();
      expect(writtenData.trustVolatility).toBeDefined();
      expect(writtenData.lastUpdated).toBeDefined();
    });

    it('should detect and handle stagnation', async () => {
      jest.spyOn(stagnationDetector, 'checkStagnation').mockResolvedValue(true);

      const event = {
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'test-agent',
          score: 0.5,
          context: {
            sessionId: 'test-session',
            source: 'user-interaction'
          }
        }
      };

      await oversightEngine['handleTrustSignal'](event);

      expect(eventBus.emit).toHaveBeenCalledWith(
        'oversight:stagnation',
        expect.objectContaining({
          agentId: 'test-agent',
          context: {
            stagnantSince: expect.any(String),
            trustHistory: expect.any(Array),
            recoveryAttempts: expect.any(Number)
          },
          priority: 'high',
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle recovery fatigue', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify({
        agentName: 'test-agent',
        sessionsTracked: 1,
        avgTrustDelta: 0.5,
        recoveryAttempts: 3,
        patternSubstitutions: 0,
        trustVolatility: 0.1,
        recentTriggers: [],
        lastUpdated: new Date().toISOString()
      }));

      const event = {
        type: 'trust:warning',
        timestamp: new Date().toISOString(),
        data: {
          component: 'test-agent',
          score: 0.3,
          context: {
            sessionId: 'test-session',
            source: 'user-interaction'
          }
        }
      };

      await oversightEngine['handleTrustWarning'](event);

      expect(eventBus.emit).toHaveBeenCalledWith(
        'oversight:recovery-fatigue',
        expect.objectContaining({
          agentId: 'test-agent',
          attempts: 4,
          context: {
            lastAttempt: expect.any(String),
            trustHistory: expect.any(Array),
            recoveryStrategy: expect.any(String)
          },
          priority: 'high',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('AgentMemory', () => {
    it('should store and retrieve agent records', async () => {
      const record = await agentMemory.getAgentRecord('test-agent');
      expect(record).toBeDefined();
      expect(record?.agentName).toBe('test-agent');
    });

    it('should handle evolution triggers', async () => {
      await agentMemory.updateAgentRecord('test-agent', {
        recentTriggers: ['trust:violation']
      });

      expect(fs.promises.writeFile).toHaveBeenCalled();
      const writeCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.recentTriggers).toHaveLength(1);
      expect(writtenData.recentTriggers[0]).toBe('trust:violation');
    });

    it('should maintain history size limits', async () => {
      // Mock a record with many triggers
      const manyTriggers = Array(2000).fill('test:trigger');

      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 1,
        avgTrustDelta: 0.5,
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: manyTriggers
      });

      // Add a new trigger
      await agentMemory.updateAgentRecord('test-agent', {
        recentTriggers: [...manyTriggers, 'new:trigger']
      });

      const writeCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.recentTriggers.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('StagnationDetector', () => {
    it('should detect stagnant trust scores', async () => {
      // Mock a record with stagnant trust scores
      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 5,
        avgTrustDelta: 0.001, // Below threshold
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: [
          'trust:signal',
          'trust:signal'
        ]
      });

      const isStagnant = await stagnationDetector.checkStagnation('test-agent');
      expect(isStagnant).toBe(true);
    });

    it('should detect low evolution rates', async () => {
      // Mock a record with low evolution rate
      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 10,
        avgTrustDelta: 0.5,
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: [
          'evolution:triggered',
          'trust:signal',
          'trust:signal',
          'trust:signal',
          'trust:signal'
        ]
      });

      const isStagnant = await stagnationDetector.checkStagnation('test-agent');
      expect(isStagnant).toBe(true);
    });

    it('should detect high pattern substitution rates', async () => {
      // Mock a record with high pattern substitution rate
      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 10,
        avgTrustDelta: 0.5,
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: [
          'pattern:substitution',
          'pattern:substitution',
          'pattern:substitution',
          'trust:signal'
        ]
      });

      const isStagnant = await stagnationDetector.checkStagnation('test-agent');
      expect(isStagnant).toBe(true);
    });
  });

  describe('Stagnation Detection', () => {
    it('should detect no trust improvement over 5 sessions', async () => {
      // Mock a record with stagnant trust scores over 5 sessions
      const stagnantRecord = {
        agentName: 'test-agent',
        sessionsTracked: 5,
        avgTrustDelta: 0.001, // Below threshold
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: Array(5).fill('trust:signal')
      };

      await agentMemory.updateAgentRecord('test-agent', stagnantRecord);

      const event = {
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'test-agent',
          score: 0.5,
          context: {
            sessionId: 'test-session',
            source: 'user-interaction'
          }
        }
      };

      await oversightEngine['handleTrustSignal'](event);

      // Verify stagnantSince is set
      const writeCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.stagnantSince).toBeDefined();

      // Verify warning is emitted
      expect(eventBus.emit).toHaveBeenCalledWith(
        'oversight:stagnation',
        expect.objectContaining({
          agentId: 'test-agent',
          context: {
            stagnantSince: expect.any(String),
            trustHistory: expect.any(Array),
            recoveryAttempts: expect.any(Number)
          },
          priority: 'high',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('Overcorrection Detection', () => {
    it('should detect trust score volatility', async () => {
      // Mock a record with volatile trust scores
      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 3,
        avgTrustDelta: 0,
        recoveryAttempts: 0,
        trustVolatility: 0.2, // Above threshold
        recentTriggers: [
          'trust:signal',
          'trust:signal',
          'trust:signal'
        ]
      });

      const event = {
        type: 'trust:signal',
        timestamp: new Date().toISOString(),
        data: {
          component: 'test-agent',
          score: 0.5,
          context: {
            sessionId: 'test-session',
            source: 'user-interaction'
          }
        }
      };

      await oversightEngine['handleTrustSignal'](event);

      // Verify volatility is flagged
      expect(eventBus.emit).toHaveBeenCalledWith(
        'oversight:trust-volatility',
        expect.objectContaining({
          agentId: 'test-agent',
          volatility: expect.any(Number),
          context: {
            trustHistory: expect.any(Array),
            threshold: expect.any(Number)
          },
          priority: 'high',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('Trigger Overuse Detection', () => {
    it('should detect repeated evolution triggers', async () => {
      // Mock a record with repeated evolution triggers
      const triggerRecord = {
        agentName: 'test-agent',
        sessionsTracked: 3,
        avgTrustDelta: 0.5,
        recoveryAttempts: 0,
        patternSubstitutions: 0,
        trustVolatility: 0.1,
        recentTriggers: [
          { type: 'evolution:triggered', triggerType: 'performance', timestamp: new Date().toISOString() },
          { type: 'evolution:triggered', triggerType: 'performance', timestamp: new Date().toISOString() },
          { type: 'evolution:triggered', triggerType: 'performance', timestamp: new Date().toISOString() }
        ]
      };

      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(triggerRecord));

      const event = {
        data: {
          agentId: 'test-agent',
          triggerType: 'performance'
        }
      };

      await oversightEngine['handleEvolutionTrigger'](event);

      // Verify trigger fatigue is logged
      expect(eventBus.emit).toHaveBeenCalledWith(
        'oversight:trigger-repetition',
        expect.objectContaining({
          agentId: 'test-agent',
          triggers: expect.arrayContaining([
            expect.objectContaining({ type: 'performance' })
          ])
        })
      );
    });
  });

  describe('Agent Memory Management', () => {
    it('should track session metrics correctly', async () => {
      // Simulate multiple sessions
      const initialRecord = {
        agentName: 'test-agent',
        sessionsTracked: 0,
        avgTrustDelta: 0,
        recoveryAttempts: 0,
        trustVolatility: 0,
        recentTriggers: []
      };

      await agentMemory.updateAgentRecord('test-agent', initialRecord);

      // Simulate trust signals
      const events = [
        { score: 0.6, recoveryAttempts: 1 },
        { score: 0.7, recoveryAttempts: 0 },
        { score: 0.8, recoveryAttempts: 2 }
      ];

      for (const event of events) {
        await oversightEngine['handleTrustSignal']({
          type: 'trust:signal',
          timestamp: new Date().toISOString(),
          data: {
            component: 'test-agent',
            score: event.score,
            context: {
              sessionId: 'test-session',
              source: 'user-interaction'
            }
          }
        });

        if (event.recoveryAttempts > 0) {
          await oversightEngine['handleRecoveryAttempt']({
            type: 'recovery:attempt',
            timestamp: new Date().toISOString(),
            data: {
              agentId: 'test-agent',
              context: {
                sessionId: 'test-session',
                source: 'user-interaction'
              }
            }
          });
        }
      }

      // Verify final record state
      const writeCalls = (fs.promises.writeFile as jest.Mock).mock.calls;
      const finalRecord = JSON.parse(writeCalls[writeCalls.length - 1][1]);

      expect(finalRecord.sessionsTracked).toBe(3);
      expect(finalRecord.recoveryAttempts).toBe(3);
      expect(finalRecord.avgTrustDelta).toBeGreaterThan(0);
      expect(finalRecord.trustVolatility).toBeDefined();
    });

    it('should maintain history size limits', async () => {
      // Mock a record with many triggers
      const manyTriggers = Array(2000).fill('test:trigger');

      await agentMemory.updateAgentRecord('test-agent', {
        agentName: 'test-agent',
        sessionsTracked: 1,
        avgTrustDelta: 0.5,
        recoveryAttempts: 0,
        trustVolatility: 0.1,
        recentTriggers: manyTriggers
      });

      // Add a new trigger
      await agentMemory.updateAgentRecord('test-agent', {
        recentTriggers: [...manyTriggers, 'new:trigger']
      });

      const writeCall = (fs.promises.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.recentTriggers.length).toBeLessThanOrEqual(1000);
    });
  });
}); 