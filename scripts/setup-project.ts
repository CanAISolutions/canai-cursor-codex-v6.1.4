/**
 * @file setup-project.ts
 * @description Automates project setup.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

async function setupProject(): Promise<void> {
  console.log('Setting up CanAI project...');
  
  // Create necessary directories
  const directories = [
    'cursor/agents',
    'cursor/docs',
    'cursor/context',
    'cursor/utils',
    'cursor/engines',
    'cursor/plugins',
    '.canai-context'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Copy .env.example to .env if it doesn't exist
  const envExample = path.join('.env.example');
  const env = path.join('.env');
  if (!fs.existsSync(env) && fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, env);
    console.log('Created .env from .env.example');
  }

  // Validate scaffold
  console.log('Validating scaffold...');
  try {
    execSync('node scripts/validate.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  }

  // Generate initial docs
  console.log('Generating documentation...');
  try {
    execSync('ts-node scripts/generate-docs.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('Documentation generation failed:', error);
    process.exit(1);
  }

  console.log('Setup complete! Run `npm test` to validate or `npm start` to begin.');
}

setupProject().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
}); 