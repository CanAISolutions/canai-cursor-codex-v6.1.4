/**
 * @file learning-orchestrator.ts
 * @description Coordinates tasks and aggregates patterns.
 * @pillar Compoundable Leverage
 * @maturity Stable
 * @status Active
 */
import { appendToFixContextAsync } from '../../context/fix-context-utils';
import { logInnovationMetric, trackMetric } from '../../utils/telemetry';
import { EventBusAgent } from '../event-bus/event-bus';
import * as fs from 'fs';
import * as path from 'path';

interface KnowledgePattern {
  id: string;
  bugType: string;
  fixPattern: string;
  timestamp: string;
}

interface Task {
  id: string;
  agent: string;
  action: string;
  dependencies: string[];
  priority: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
}

export class LearningOrchestrator {
  private traceId: string;
  private knowledgeBasePath = path.join('.canai-context', 'knowledge-base.json');
  private learningLogPath = path.join('.canai-context', 'learning.log');
  private tasksPath = path.join('.canai-context', 'tasks.json');
  private eventBus: EventBusAgent;

  constructor(traceId: string) {
    this.traceId = traceId;
    this.eventBus = new EventBusAgent(traceId);
    const contextDir = path.join('.canai-context');
    if (!fs.existsSync(contextDir)) fs.mkdirSync(contextDir, { recursive: true });
    this.eventBus.subscribe('task:completed', async (event) => this.handleTaskCompletion(event.data.taskId, event.data.outcome));
    this.eventBus.subscribe('task:failed', async (event) => this.handleTaskFailure(event.data.taskId, event.data.reason));
  }

  async aggregatePattern(bugType: string, fixPattern: string): Promise<void> {
    try {
      const pattern: KnowledgePattern = {
        id: `${this.traceId}-${Date.now()}`,
        bugType,
        fixPattern,
        timestamp: new Date().toISOString()
      };
      const existing = fs.existsSync(this.knowledgeBasePath)
        ? JSON.parse(fs.readFileSync(this.knowledgeBasePath, 'utf-8'))
        : [];
      existing.push(pattern);
      fs.writeFileSync(this.knowledgeBasePath, JSON.stringify(existing, null, 2));
      fs.appendFileSync(this.learningLogPath, `[${pattern.timestamp}] Pattern aggregated: ${bugType}, ID: ${pattern.id}\n`);
      await appendToFixContextAsync(`[${this.traceId}] Aggregated pattern: ${bugType}`);
      await logInnovationMetric('pattern_aggregated', { bugType, patternId: pattern.id }, this.traceId);
    } catch (err) {
      const reason = (err as Error).message;
      await appendToFixContextAsync(`[${this.traceId}] Pattern aggregation failed: ${reason}`);
      await logInnovationMetric('pattern_aggregation_failed', { error: reason }, this.traceId);
      throw err;
    }
  }

  async scheduleAgent(task: Task, retryCount = 0): Promise<void> {
    try {
      const tasks: Task[] = fs.existsSync(this.tasksPath)
        ? JSON.parse(fs.readFileSync(this.tasksPath, 'utf-8'))
        : [];
      const dependenciesMet = task.dependencies.every(depId =>
        tasks.find((t: Task) => t.id === depId)?.status === 'completed'
      );
      if (!dependenciesMet) {
        const reason = `Dependencies not met for task ${task.id}`;
        await appendToFixContextAsync(`[${this.traceId}] ${reason}`);
        await logInnovationMetric('task_scheduling_blocked', { taskId: task.id, reason }, this.traceId);
        return;
      }
      task.status = 'running';
      tasks.push(task);
      fs.writeFileSync(this.tasksPath, JSON.stringify(tasks, null, 2));
      const startTime = Date.now();
      await this.eventBus.publish({
        type: `task:${task.agent}`,
        data: { taskId: task.id, action: task.action },
        timestamp: new Date().toISOString()
      }, 'medium');
      fs.appendFileSync(this.learningLogPath, `[${task.createdAt}] Scheduled task: ${task.id}, Agent: ${task.agent}, Action: ${task.action}\n`);
      await appendToFixContextAsync(`[${this.traceId}] Scheduled task ${task.id} for ${task.agent}`);
      await logInnovationMetric('agent_scheduled', { agentName: task.agent, taskId: task.id }, this.traceId);
      await trackMetric('task_execution_time_ms', Date.now() - startTime, { taskId: task.id }, this.traceId);
    } catch (err) {
      const reason = (err as Error).message;
      if (retryCount < 3) {
        await appendToFixContextAsync(`[${this.traceId}] Retrying task ${task.id} (${retryCount + 1}/3)`);
        await this.scheduleAgent(task, retryCount + 1);
      } else {
        await this.handleTaskFailure(task.id, reason);
      }
    }
  }

  private async handleTaskCompletion(taskId: string, outcome: any): Promise<void> {
    try {
      const tasks: Task[] = JSON.parse(fs.readFileSync(this.tasksPath, 'utf-8'));
      const task = tasks.find((t: Task) => t.id === taskId);
      if (task) {
        task.status = 'completed';
        fs.writeFileSync(this.tasksPath, JSON.stringify(tasks, null, 2));
        fs.appendFileSync(this.learningLogPath, `[${new Date().toISOString()}] Task completed: ${taskId}, Outcome: ${JSON.stringify(outcome)}\n`);
        await this.aggregatePattern(outcome.bugType || 'unknown', outcome.fixPattern || 'unknown');
        await appendToFixContextAsync(`[${this.traceId}] Task ${taskId} completed`);
        await logInnovationMetric('task_completed', { taskId, outcome }, this.traceId);
      }
    } catch (err) {
      await appendToFixContextAsync(`[${this.traceId}] Task completion handling failed: ${(err as Error).message}`);
    }
  }

  private async handleTaskFailure(taskId: string, reason: string): Promise<void> {
    try {
      const tasks: Task[] = JSON.parse(fs.readFileSync(this.tasksPath, 'utf-8'));
      const task = tasks.find((t: Task) => t.id === taskId);
      if (task) {
        task.status = 'failed';
        fs.writeFileSync(this.tasksPath, JSON.stringify(tasks, null, 2));
        fs.appendFileSync(this.learningLogPath, `[${new Date().toISOString()}] Task failed: ${taskId}, Reason: ${reason}\n`);
        await appendToFixContextAsync(`[${this.traceId}] Task ${taskId} failed: ${reason}`);
        await logInnovationMetric('task_failed', { taskId, reason }, this.traceId);
      }
    } catch (err) {
      await appendToFixContextAsync(`[${this.traceId}] Task failure handling failed: ${(err as Error).message}`);
    }
  }
} 