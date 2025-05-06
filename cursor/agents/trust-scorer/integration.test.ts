/**
 * @file integration.test.ts
 * @description End-to-end integration tests for trust-scorer with other components.
 */
import { TrustScorer } from './trust-scorer';
import { EventBusAgent } from '../event-bus/event-bus';
import { LearningOrchestrator } from '../learning-orchestrator/learning-orchestrator';
import { runEmotionalStabilizer } from '../../self-healing/emotionalStabilizer';
import { runModularitySelfCorrector } from '../../self-healing/modularitySelfCorrector';
import { runEarlyDriftDetectors } from '../../self-healing/earlyDriftDetectors';
import { predictEmotionalDrift } from '../../self-awareness/emotionalDriftPredictor';
import { analyzeDreamTrends } from '../../self-awareness/dreamTrendAnalyzer';
import { scoreEmotionalOutput } from '../../vision-injection/output-emotion-score';
import { TrustEventType, TrustEventData, TrustViolationData, TrustWarningData, TrustSignalData } from './types';
import fs from 'fs';
import path from 'path';

interface Event {
  type: string;
  data: any;
  timestamp: string;
  sessionId?: string;
  agentVersion?: string;
  metricSeverity?: 'low' | 'medium' | 'high';
}

jest.mock('../debug/utils/telemetry', () => ({
  recordMetric: jest.fn(),
}));

describe('[DreamState] TrustScorer Integration', () => {
  const traceId = 'integration-test';
  const contextDir = path.join('.canai-context');
  let trustScorer: TrustScorer;
  let eventBus: EventBusAgent;
  let learningOrchestrator: LearningOrchestrator;

  beforeEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
    fs.mkdirSync(contextDir, { recursive: true });
    eventBus = new EventBusAgent(traceId);
    trustScorer = new TrustScorer(eventBus);
    learningOrchestrator = new LearningOrchestrator(traceId);
  });

  afterEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
  });

  describe('Event Bus Integration', () => {
    it('propagates trust events through event bus to all subscribers', async () => {
      const receivedEvents: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      
      // Subscribe to trust events
      await eventBus.subscribe('trust:signal', (event) => {
        receivedEvents.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
      });
      await eventBus.subscribe('trust:warning', (event) => {
        receivedEvents.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
      });
      await eventBus.subscribe('trust:violation', (event) => {
        receivedEvents.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
      });

      // Evaluate trust with varying scores
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      });

      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.85,
        safety: 0.85,
        performance: 0.85,
        ethical: 0.85
      });

      await expect(trustScorer.evaluateTrust('test-component', {
        reliability: 0.5,
        safety: 0.5,
        performance: 0.5,
        ethical: 0.5
      })).rejects.toThrow();

      expect(receivedEvents).toHaveLength(3);
      expect(receivedEvents[0].type).toBe('trust:signal');
      expect(receivedEvents[1].type).toBe('trust:warning');
      expect(receivedEvents[2].type).toBe('trust:violation');
    });
  });

  describe('Learning Orchestrator Integration', () => {
    it('maintains trust scores during task execution', async () => {
      const taskId = 'test-task-1';
      
      // Schedule a task
      await learningOrchestrator.scheduleAgent({
        id: taskId,
        agent: 'test-agent',
        action: 'test-action',
        dependencies: [],
        priority: 1,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Evaluate task trust
      await trustScorer.evaluateTaskTrust(taskId, {
        success: true,
        duration: 500,
        quality: 0.95
      });

      const score = trustScorer.getTrustScore(`task:${taskId}`);
      expect(score).toBeGreaterThanOrEqual(0.9);
    });

    it('handles task failures with appropriate trust scoring', async () => {
      const taskId = 'test-task-2';
      
      await learningOrchestrator.scheduleAgent({
        id: taskId,
        agent: 'test-agent',
        action: 'test-action',
        dependencies: [],
        priority: 1,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      await expect(trustScorer.evaluateTaskTrust(taskId, {
        success: false,
        duration: 1000,
        quality: 0.5,
        error: 'Task failed'
      })).rejects.toThrow();

      const score = trustScorer.getTrustScore(`task:${taskId}`);
      expect(score).toBeLessThan(0.9);
    });
  });

  describe('System-wide Trust Maintenance', () => {
    const components: string[] = [
      'learning-orchestrator',
      'event-bus',
      'trust-scorer',
      'pattern-analyzer'
    ];

    it('maintains trust scores above threshold for critical components', async () => {
      for (const component of components) {
        const score = await trustScorer.evaluateTrust(component, {
          reliability: 0.95,
          safety: 0.95,
          performance: 0.95,
          ethical: 0.95
        });
        expect(score).toBeGreaterThanOrEqual(0.9);
      }
    });

    it('handles concurrent trust evaluations', async () => {
      const evaluations = components.map(component => 
        trustScorer.evaluateTrust(component, {
          reliability: 0.95,
          safety: 0.95,
          performance: 0.95,
          ethical: 0.95
        })
      );

      const scores: number[] = await Promise.all(evaluations);
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0.9);
      });
    });
  });

  describe('Edge Cases and Recovery', () => {
    it('recovers from temporary trust violations', async () => {
      const component = 'test-component';
      
      // Initial high trust
      await trustScorer.evaluateTrust(component, {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      });

      // Temporary violation
      await expect(trustScorer.evaluateTrust(component, {
        reliability: 0.5,
        safety: 0.5,
        performance: 0.5,
        ethical: 0.5
      })).rejects.toThrow();

      // Recovery
      const recoveredScore = await trustScorer.evaluateTrust(component, {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      });

      expect(recoveredScore).toBeGreaterThanOrEqual(0.9);
    });

    it('handles rapid trust score fluctuations', async () => {
      const component = 'test-component';
      const scores: number[] = [];

      // Rapid sequence of evaluations
      for (let i = 0; i < 5; i++) {
        try {
          const score = await trustScorer.evaluateTrust(component, {
            reliability: 0.9 + (i % 2 ? 0.1 : -0.1),
            safety: 0.9 + (i % 2 ? 0.1 : -0.1),
            performance: 0.9 + (i % 2 ? 0.1 : -0.1),
            ethical: 0.9 + (i % 2 ? 0.1 : -0.1)
          });
          scores.push(score);
        } catch (error) {
          scores.push(0);
        }
      }

      // Verify trust history
      const history = trustScorer.getTrustHistory(component);
      expect(history).toHaveLength(scores.filter(s => s > 0).length);
    });
  });

  describe('Concurrent Drift and Vision Recovery', () => {
    it('should handle concurrent emotional drift and vision misinterpretation', async () => {
      const publishCalls: Event[] = [];
      eventBus.publish = jest.fn(async (event: Event, severity?: 'low' | 'medium' | 'high') => {
        publishCalls.push(event);
      });

      // Simulate concurrent drift and vision issues
      const driftPromise = predictEmotionalDrift();
      const visionScore = scoreEmotionalOutput('This is a misinterpreted vision with emotional drift');
      
      const drift = await driftPromise;
      expect(drift.driftRiskLevel).toBe('moderate');
      expect(visionScore.alignment).toBeLessThan(5);

      // Trigger trust evaluation with both issues
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.82,
        safety: 0.85,
        performance: 0.83,
        ethical: 0.84
      });

      // Verify recovery sequence
      const actions = await runEmotionalStabilizer();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].actionType).toBe('prompt-tune');
      expect(actions[0].priority).toBe('moderate');

      // Verify event sequence
      const eventSequence = publishCalls.map(call => call.type);
      expect(eventSequence).toContain('trust:warning');
      expect(eventSequence).toContain('trust:violation');
      expect(eventSequence.indexOf('trust:warning')).toBeLessThan(eventSequence.indexOf('trust:violation'));

      // Verify recovery
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.92,
        safety: 0.93,
        performance: 0.91,
        ethical: 0.94
      });

      const history = await trustScorer.getTrustHistory('test-component');
      expect(history[1].score).toBeGreaterThan(0.9);
      expect(history[1].score).toBeGreaterThan(history[0].score);
    });
  });

  describe('Complex Recovery Scenarios', () => {
    it('handles multiple concurrent trust violations', async () => {
      const publishCalls: Event[] = [];
      eventBus.publish = jest.fn(async (event: Event, severity?: 'low' | 'medium' | 'high') => {
        publishCalls.push(event);
      });

      // Simulate concurrent issues
      const driftPromise = predictEmotionalDrift();
      const visionScore = scoreEmotionalOutput('This is a misinterpreted vision with emotional drift');
      const modularPromise = runModularitySelfCorrector();
      
      const [drift, modularResults] = await Promise.all([driftPromise, modularPromise]);
      
      // Verify initial state
      expect(drift.driftRiskLevel).toBe('moderate');
      expect(visionScore.alignment).toBeLessThan(5);
      expect(modularResults.some(r => r.actionTaken === 'requires-human-review')).toBe(true);

      // Trigger trust evaluation with multiple issues
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.82,
        safety: 0.85,
        performance: 0.83,
        ethical: 0.84
      });

      // Verify recovery sequence
      const actions = await runEmotionalStabilizer();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].actionType).toBe('prompt-tune');
      expect(actions[0].priority).toBe('moderate');

      // Verify event sequence
      const eventSequence = publishCalls.map(call => call.type);
      expect(eventSequence).toContain('trust:warning');
      expect(eventSequence).toContain('trust:violation');
      expect(eventSequence.indexOf('trust:warning')).toBeLessThan(eventSequence.indexOf('trust:violation'));

      // Verify recovery
      const recoveredScore = await trustScorer.evaluateTrust('test-component', {
        reliability: 0.92,
        safety: 0.93,
        performance: 0.91,
        ethical: 0.94
      });
      expect(recoveredScore).toBeGreaterThanOrEqual(0.9);
    });

    it('validates recovery sequence ordering', async () => {
      const publishCalls: Event[] = [];
      eventBus.publish = jest.fn(async (event: Event, severity?: 'low' | 'medium' | 'high') => {
        publishCalls.push(event);
      });

      // Simulate sequential issues
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.82,
        safety: 0.85,
        performance: 0.83,
        ethical: 0.84
      });

      // Trigger emotional drift
      const drift = await predictEmotionalDrift();
      expect(drift.driftRiskLevel).toBe('moderate');

      // Trigger vision issue
      const visionScore = scoreEmotionalOutput('This is a misinterpreted vision');
      expect(visionScore.alignment).toBeLessThan(5);

      // Verify recovery sequence
      const actions = await runEmotionalStabilizer();
      const modularResults = await runModularitySelfCorrector();

      // Verify event ordering
      const eventSequence = publishCalls.map(call => call.type);
      const warningIndex = eventSequence.indexOf('trust:warning');
      const violationIndex = eventSequence.indexOf('trust:violation');
      const recoveryIndex = eventSequence.indexOf('trust:recovery');

      expect(warningIndex).toBeLessThan(violationIndex);
      expect(violationIndex).toBeLessThan(recoveryIndex);

      // Verify final state
      const finalScore = await trustScorer.evaluateTrust('test-component', {
        reliability: 0.92,
        safety: 0.93,
        performance: 0.91,
        ethical: 0.94
      });
      expect(finalScore).toBeGreaterThanOrEqual(0.9);
    });
  });
}); 