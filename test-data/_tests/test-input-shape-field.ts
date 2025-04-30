// ✅ test-input-shape-field.ts
// @codex-purpose: Ensure all expected-error and expected-output files contain a valid inputShape block
// @codex-system: structural test QA
// @codex-critical: Prevents partial or drifted test data from weakening CI or Copilot simulations
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const testDataDir = path.resolve(__dirname, '../test-data');

function findExpectedFiles(): string[] {
  const results: string[] = [];

  function scan(dir: string) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (
        file.endsWith('.expected-error.json') ||
        file.endsWith('.expected-output.json')
      ) {
        results.push(full);
      }
    });
  }

  scan(testDataDir);
  return results;
}

const expectedFiles = findExpectedFiles();
const requiredFields = [
  'promptType', 'industry', 'audience', 'tone',
  'goal', 'productOrService', 'brandName',
  'founderName', 'promptInput'
];

const errors: string[] = [];

expectedFiles.forEach(file => {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (!json.inputShape) {
    errors.push(`❌ ${file} is missing top-level inputShape`);
    return;
  }

  requiredFields.forEach(field => {
    if (!(field in json.inputShape)) {
      errors.push(`❌ ${file} → inputShape missing field: '${field}'`);
    }
  });
});

if (errors.length > 0) {
  errors.forEach(err => console.error(err));
  console.error(`❌ ${errors.length} inputShape issues found across expected-* files.`);
  process.exit(1);
} else {
  console.log('✅ All expected files contain a valid inputShape with required fields.');
}
