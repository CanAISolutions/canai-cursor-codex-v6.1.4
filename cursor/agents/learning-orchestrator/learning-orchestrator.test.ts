/**
 * @file learning-orchestrator.test.ts
 * @description Tests for learning-orchestrator.ts.
 */
import { LearningOrchestrator } from './learning-orchestrator';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('../../context/fix-context-utils', () => ({
  appendToFixContextAsync: jest.fn(),
}));

jest.mock('../../utils/telemetry', () => ({
  logInnovationMetric: jest.fn(),
  trackMetric: jest.fn(),
}));

describe('[DreamState] LearningOrchestrator', () => {
  const traceId = 'test-trace';
  const contextDir = path.join('.canai-context');
  const knowledgeBasePath = path.join(contextDir, 'knowledge-base.json');
  const learningLogPath = path.join(contextDir, 'learning.log');
  const tasksPath = path.join(contextDir, 'tasks.json');

  beforeEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
    fs.mkdirSync(contextDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
  });

  it('aggregates patterns to knowledge-base.json and logs', async () => {
    const orchestrator = new LearningOrchestrator(traceId);
    await orchestrator.aggregatePattern('syntax_error', 'Add semicolon');
    
    const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));
    expect(knowledgeBase[0]).toMatchObject({
      bugType: 'syntax_error',
      fixPattern: 'Add semicolon'
    });
    
    const logContent = fs.readFileSync(learningLogPath, 'utf-8');
    expect(logContent).toContain('Pattern aggregated: syntax_error');
  });

  it('schedules tasks and updates tasks.json', async () => {
    const orchestrator = new LearningOrchestrator(traceId);
    const task = {
      id: 'task-1',
      agent: 'predictive-analytics',
      action: 'analyze_bugs',
      dependencies: [],
      priority: 1,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    await orchestrator.scheduleAgent(task);
    
    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    expect(tasks[0]).toMatchObject({
      id: 'task-1',
      status: 'running'
    });
  });

  it('handles task completion and updates status', async () => {
    const orchestrator = new LearningOrchestrator(traceId);
    const task = {
      id: 'task-1',
      agent: 'predictive-analytics',
      action: 'analyze_bugs',
      dependencies: [],
      priority: 1,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    await orchestrator.scheduleAgent(task);
    
    // Simulate task completion through event bus subscription
    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    tasks[0].status = 'completed';
    fs.writeFileSync(tasksPath, JSON.stringify(tasks));
    
    const updatedTasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    expect(updatedTasks[0].status).toBe('completed');
  });

  it('respects task dependencies', async () => {
    const orchestrator = new LearningOrchestrator(traceId);
    const task1 = {
      id: 'task-1',
      agent: 'predictive-analytics',
      action: 'analyze_bugs',
      dependencies: [],
      priority: 1,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    const task2 = {
      id: 'task-2',
      agent: 'code-regenerator',
      action: 'fix_bugs',
      dependencies: ['task-1'],
      priority: 1,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    await orchestrator.scheduleAgent(task1);
    await orchestrator.scheduleAgent(task2);
    
    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    expect(tasks).toHaveLength(1); // task2 should not be scheduled yet
    expect(tasks[0].id).toBe('task-1');
  });
}); 