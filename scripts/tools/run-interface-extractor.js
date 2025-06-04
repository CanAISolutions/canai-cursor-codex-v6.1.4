#!/usr/bin/env node

/**
 * JavaScript runner for the Interface Extractor
 * This allows running the extractor without TypeScript compilation
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Interface Extractor...');

try {
  // Use ts-node to run the TypeScript file directly
  const scriptPath = path.join(__dirname, 'interface-extractor.ts');
  execSync(`npx ts-node "${scriptPath}"`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('❌ Error running interface extractor:', error.message);
  process.exit(1);
} 