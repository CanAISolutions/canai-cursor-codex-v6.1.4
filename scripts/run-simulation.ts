/**
 * Simulation Runner
 * 
 * Purpose: Executes the complete simulation suite, including stress tests,
 *          metrics validation, and improvement queue analysis.
 * 
 * TAP-Status: Locked
 * Codex: v2.7.8
 * Trust Score: 4.2
 */

import { runConfirmationUXSimulation } from '../stressbox/simulations/confirmation-ux-sim';
import { triggerImprovementQueue } from '../stressbox/improvement-queue';
import { EventBus } from '../utils/event-bus';

async function main() {
  const eventBus = EventBus.getInstance();
  console.log('Starting simulation suite...');

  try {
    // Run confirmation UX simulation
    console.log('Running confirmation UX simulation...');
    const results = await runConfirmationUXSimulation();
    console.log(`Completed simulation with ${results.length} scenarios`);

    // Trigger improvement queue
    console.log('Triggering improvement queue...');
    const tasks = await triggerImprovementQueue(results);
    console.log(`Created ${tasks.length} improvement tasks`);

    // Emit completion event
    await eventBus.emit('simulation:complete', {
      timestamp: new Date().toISOString(),
      totalScenarios: results.length,
      passedScenarios: results.filter(r => r.passed).length,
      totalTasks: tasks.length
    });

    console.log('Simulation suite completed successfully');
  } catch (error) {
    console.error('Simulation suite failed:', error);
    process.exit(1);
  }
}

// Run the simulation suite
main().catch(console.error); 