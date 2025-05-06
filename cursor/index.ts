/**
 * @file index.ts
 * @description Entry point for CanAI system.
 */
import { LearningOrchestrator } from './agents/learning-orchestrator/learning-orchestrator';
import { TutorialAgent } from './agents/tutorial/tutorial';
import { PromptContext } from './context/prompt-context';

async function startCanAI(): Promise<void> {
  const traceId = `startup-${Date.now()}`;
  console.log('Starting CanAI ORBITAL DREAM-STATE v1.1...');
  
  // Run context-aware tutorial
  const tutorial = new TutorialAgent(traceId, { tone: 'friendly', industry: 'tech' });
  await tutorial.runTutorial();
  
  // Start orchestrator with initial task
  const orchestrator = new LearningOrchestrator(traceId);
  await orchestrator.scheduleAgent({
    id: 'initial-task',
    agent: 'predictive-analytics',
    action: 'analyze_bugs',
    dependencies: [],
    priority: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

startCanAI().catch(err => {
  console.error('CanAI startup failed:', err);
  process.exit(1);
}); 