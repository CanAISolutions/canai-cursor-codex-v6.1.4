/**
 * agent-oversight/agent-memory.test.ts
 * 
 * Purpose:
 * Tests the AgentMemory class for proper record management and event emission.
 */

import { EventBus } from '../event-bus/eventBus';
import { AgentMemory } from './agent-memory';
import * as fs from 'fs';
import * as path from 'path';

describe('AgentMemory', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  const testMemoryDir = 'test-memory';

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    agentMemory = new AgentMemory(eventBus, testMemoryDir);
  });

  afterEach(async () => {
    // Clean up test files
    if (fs.existsSync(testMemoryDir)) {
      const files = await fs.promises.readdir(testMemoryDir);
      await Promise.all(
        files.map(file => fs.promises.unlink(path.join(testMemoryDir, file)))
      );
      await fs.promises.rmdir(testMemoryDir);
    }
  });

  describe('updateAgentRecord', () => {
    it('should create a new record if it does not exist', async () => {
      const agentId = 'test-agent';
      const updates = {
        trustScore: 0.8,
        failureRate: 0.1,
        status: 'active' as const
      };

      await agentMemory.updateAgentRecord(agentId, updates);

      const record = await agentMemory.getAgent(agentId);
      expect(record).toBeDefined();
      expect(record?.trustScore).toBe(0.8);
      expect(record?.failureRate).toBe(0.1);
      expect(record?.status).toBe('active');
    });

    it('should update an existing record', async () => {
      const agentId = 'test-agent';
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const updates = {
        trustScore: 0.8,
        failureRate: 0.1
      };

      await agentMemory.updateAgentRecord(agentId, updates);

      const record = await agentMemory.getAgent(agentId);
      expect(record?.trustScore).toBe(0.8);
      expect(record?.failureRate).toBe(0.1);
      expect(record?.status).toBe('active'); // Unchanged
    });

    it('should update trust history when trust score changes', async () => {
      const agentId = 'test-agent';
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [0.4, 0.5],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const updates = {
        trustScore: 0.8
      };

      await agentMemory.updateAgentRecord(agentId, updates);

      const record = await agentMemory.getAgent(agentId);
      expect(record?.trustHistory).toEqual([0.4, 0.5, 0.8]);
    });

    it('should emit agent:record:updated event', async () => {
      const agentId = 'test-agent';
      const updates = {
        trustScore: 0.8,
        failureRate: 0.1
      };

      const eventPromise = new Promise<any>(resolve => {
        eventBus.on('agent:record:updated', async (event) => { resolve(event); });
      });

      await agentMemory.updateAgentRecord(agentId, updates);

      const event = await eventPromise;
      expect(event.agentId).toBe(agentId);
      expect(event.updates).toEqual(updates);
      expect(event.timestamp).toBeDefined();
      expect(event.previousState).toBeDefined();
      expect(event.newState).toBeDefined();
    });

    it('should emit metric:recorded event', async () => {
      const agentId = 'test-agent';
      const updates = {
        trustScore: 0.8,
        failureRate: 0.1
      };

      const eventPromise = new Promise<any>(resolve => {
        eventBus.on('metric:recorded', async (event) => { resolve(event); });
      });

      await agentMemory.updateAgentRecord(agentId, updates);

      const event = await eventPromise;
      expect(event.metric).toBe('agent:record:update');
      expect(event.value).toBe(1);
      expect(event.context.agentId).toBe(agentId);
      expect(event.context.updateTypes).toEqual(['trustScore', 'failureRate']);
      expect(event.context.source).toBe('agent-memory');
    });
  });

  describe('getAgent', () => {
    it('should return undefined for non-existent agent', async () => {
      const record = await agentMemory.getAgent('non-existent');
      expect(record).toBeUndefined();
    });

    it('should return the agent record if it exists', async () => {
      const agentId = 'test-agent';
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const record = await agentMemory.getAgent(agentId);
      expect(record).toEqual(initialRecord);
    });
  });

  describe('getAllAgents', () => {
    it('should return an empty array when no agents exist', async () => {
      const agents = await agentMemory.getAllAgents();
      expect(agents).toEqual([]);
    });

    it('should return all agent records', async () => {
      const agent1 = {
        agentName: 'agent1',
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      const agent2 = {
        agentName: 'agent2',
        trustScore: 0.7,
        trustHistory: [],
        failureRate: 0.1,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(agent1);
      await agentMemory.addAgent(agent2);

      const agents = await agentMemory.getAllAgents();
      expect(agents).toHaveLength(2);
      expect(agents).toContainEqual(agent1);
      expect(agents).toContainEqual(agent2);
    });
  });

  describe('getActiveAgents', () => {
    it('should return only active agents', async () => {
      const activeAgent = {
        agentName: 'active-agent',
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      const inactiveAgent = {
        agentName: 'inactive-agent',
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'inactive' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(activeAgent);
      await agentMemory.addAgent(inactiveAgent);

      const activeAgents = await agentMemory.getActiveAgents();
      expect(activeAgents).toHaveLength(1);
      expect(activeAgents[0]).toEqual(activeAgent);
    });
  });

  describe('getDegradedAgents', () => {
    it('should return only degraded agents', async () => {
      const degradedAgent = {
        agentName: 'degraded-agent',
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'degraded' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      const activeAgent = {
        agentName: 'active-agent',
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(degradedAgent);
      await agentMemory.addAgent(activeAgent);

      const degradedAgents = await agentMemory.getDegradedAgents();
      expect(degradedAgents).toHaveLength(1);
      expect(degradedAgents[0]).toEqual(degradedAgent);
    });
  });

  describe('getAgentTrustScore', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(agentMemory.getAgentTrustScore('non-existent')).rejects.toThrow();
    });

    it('should return the trust score for an existing agent', async () => {
      const agentId = 'test-agent';
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const trustScore = await agentMemory.getAgentTrustScore(agentId);
      expect(trustScore).toBe(0.5);
    });
  });

  describe('getAgentFailureRate', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(agentMemory.getAgentFailureRate('non-existent')).rejects.toThrow();
    });

    it('should return the failure rate for an existing agent', async () => {
      const agentId = 'test-agent';
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const failureRate = await agentMemory.getAgentFailureRate(agentId);
      expect(failureRate).toBe(0.2);
    });
  });

  describe('getAgentTrustHistory', () => {
    it('should throw error for non-existent agent', async () => {
      await expect(agentMemory.getAgentTrustHistory('non-existent')).rejects.toThrow();
    });

    it('should return a copy of the trust history for an existing agent', async () => {
      const agentId = 'test-agent';
      const trustHistory = [0.4, 0.5, 0.6];
      const initialRecord = {
        agentName: agentId,
        trustScore: 0.6,
        trustHistory,
        failureRate: 0.2,
        lastUsed: Date.now(),
        status: 'active' as const,
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      };

      await agentMemory.addAgent(initialRecord);

      const history = await agentMemory.getAgentTrustHistory(agentId);
      expect(history).toEqual(trustHistory);
      expect(history).not.toBe(trustHistory); // Should be a copy
    });
  });
}); 