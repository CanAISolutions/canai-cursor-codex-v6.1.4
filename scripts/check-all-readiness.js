#!/usr/bin/env node
// scripts/check-all-readiness.js

// Hook ts-node so we can require TypeScript modules
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: { module: 'commonjs' },
  });
  
  const agents = [
    'auto-rollback',
    'conversion-predictor-lite',
    'copilot-feedback-agent',
    'copilot-injector',
    'emotional-foresight-lite',
    'federated-memory-lite',
    'prompt-genetics',
    'reverse-synthesis-core',
    'smart-prompt-score',
    'swarm-agents',
    'tone-override-agent',
    'zombie-hunter'
  ];
  
  agents.forEach(agent => {
    try {
      // Note the .ts extension here
      const { systemReadiness } = require(`../cursor/accelerators/${agent}/system-readiness.ts`);
      const status = systemReadiness();
      console.log(`\n--- ${agent} ---\n`, status, '\n');
    } catch (e) {
      console.error(`${agent}: ERROR loading/running systemReadiness(): ${e.message}`);
    }
  });
  