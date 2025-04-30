// ✅ test-snapshot-consistency.ts
// @codex-purpose: Ensure all .snapshot.json files match their .input.json for input field alignment
// @codex-system: prompt replay validator
// @codex-critical: Prevents schema drift, replay mismatches, and Copilot snapshot failures
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const promptsDir = path.resolve(__dirname, '..', 'prompts');
const snapshotsDir = path.resolve(__dirname, '..', 'snapshots');

const requiredFields = [
  'promptType', 'industry', 'audience', 'tone',
  'goal', 'productOrService', 'brandName',
  'founderName', 'promptInput'
];

const errors: string[] = [];

fs.readdirSync(snapshotsDir)
  .filter(f => f.endsWith('.snapshot.json'))
  .forEach(snapshotFile => {
    const baseName = snapshotFile.replace('.snapshot.json', '');
    const inputFile = path.join(promptsDir, `${baseName}.input.json`);
    const snapshotPath = path.join(snapshotsDir, snapshotFile);

    if (!fs.existsSync(inputFile)) {
      errors.push(`❌ No matching .input.json found for snapshot: ${snapshotFile}`);
      return;
    }

    const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

    // ✅ Check snapshot has inputShape
    if (!snapshot.inputShape) {
      errors.push(`❌ Missing inputShape in: ${snapshotFile}`);
      return;
    }

    // ✅ Check all required fields match
    requiredFields.forEach(field => {
      const inputVal = input[field];
      const snapshotVal = snapshot.inputShape[field];

      if (inputVal !== snapshotVal) {
        errors.push(`❌ Mismatch in ${field} for ${baseName} → input: "${inputVal}" vs snapshot: "${snapshotVal}"`);
      }
    });
  });

if (errors.length > 0) {
  errors.forEach(err => console.error(err));
  console.error(`❌ ${errors.length} snapshot consistency issues found.`);
  process.exit(1);
} else {
  console.log('✅ All snapshot.json files are consistent with their input.json source.');
}
