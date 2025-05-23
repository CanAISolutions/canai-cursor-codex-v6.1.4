// verify-fallback-cascade.ts
// Simple script to verify the fallback cascade tests are working properly

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

try {
  console.log('Running fallback cascade integrity tests...');
  
  // Run the test command
  const result = execSync('npx jest tests/dreamstate/fallback-cascade-integrity.test.ts --no-cache', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  // Save the output
  const logPath = path.join(__dirname, 'fallback-cascade-test-results.log');
  fs.writeFileSync(logPath, result);
  
  // Check if there are failing tests by looking for 'FAIL' in the output
  if (result.includes('FAIL ') || result.includes('× ')) {
    console.log('❌ TESTS FAILED');
    console.log('Error details:');
    console.log(result.substring(0, 500) + '...');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED');
    console.log(`Coverage information saved to: ${logPath}`);
    process.exit(0);
  }
} catch (error: any) {
  console.error('Error running tests:', error.message);
  
  // Save error details
  const errorPath = path.join(__dirname, 'fallback-cascade-test-error.log');
  fs.writeFileSync(errorPath, String(error));
  
  console.log(`Error details written to: ${errorPath}`);
  process.exit(1);
} 