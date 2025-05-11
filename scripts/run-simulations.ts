#!/usr/bin/env node

import { SimulationRunner } from '../simulation-engine/simulation-runner';
import { Logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

/**
 * CLI tool for running simulation scenarios
 * Usage: ts-node run-simulations.ts [scenarios-path]
 */
async function main() {
  const logger = new Logger('simulation-cli');
  
  try {
    // Get scenarios path from args or use default
    const scenariosPath = process.argv[2] || 
      path.join(__dirname, '../simulation-engine/scenarios.json');

    // Validate scenarios file exists
    if (!fs.existsSync(scenariosPath)) {
      logger.error(`Scenarios file not found: ${scenariosPath}`);
      process.exit(1);
    }

    // Initialize and run simulations
    const runner = new SimulationRunner();
    logger.info(`Starting simulations from: ${scenariosPath}`);
    
    await runner.runScenarios(scenariosPath);
    
    logger.info('Simulations completed successfully');
  } catch (error) {
    logger.error('Failed to run simulations', error);
    process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 