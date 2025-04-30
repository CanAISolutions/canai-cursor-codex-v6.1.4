// ✅ codex-check.ts
// @codex-purpose: Central runner for all Codex QA integrity tests
// @codex-system: test-data self-validation layer
// @codex-critical: Prevents fragmented QA, missed errors, and silent test decay
// @codex-verified: v1.4.2

import { execSync } from 'child_process';
import path from 'path';

const tests = [
  'test-input-shape-field.ts',
  'test-prompt-type-coverage.ts',
  'test-codex-header-comments.ts',
  'test-snapshot-consistency.ts',
  'test-output-delta-drift.ts'
];

const testDir = path.resolve(__dirname, '../test-data/_tests');

try {
  for (const file of tests) {
    console.log(`\n🧪 Running ${file}...`);
    execSync(`npx ts-node ${path.join(testDir, file)}`, { stdio: 'inherit' });
  }

  console.log('\n✅ All Codex QA checks passed. System is verified.\n');
} catch {
  console.error('\n❌ Codex QA check failed. Fix required before commit.\n');
  process.exit(1);
}
