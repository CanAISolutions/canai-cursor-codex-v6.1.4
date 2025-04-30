// ✅ test-prompt-type-coverage.ts
// @codex-purpose: Ensure all 7 promptTypes are covered with input + snapshot + inputShape trace
// @codex-system: fulfillment test integrity
// @codex-critical: Prevents regression, routing gaps, or Copilot failures
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const promptTypes = [
  'business-plan',
  'social-content',
  'email-campaign',
  'ai-blueprint',
  'site-audit',
  'reverse-strategy',
  'ai-brand-identity'
];

const baseDir = path.resolve(__dirname, '..');
const promptsDir = path.join(baseDir, 'prompts');
const snapshotsDir = path.join(baseDir, 'snapshots');

const errors: string[] = [];

promptTypes.forEach((type) => {
  const inputFile = path.join(promptsDir, `${type}.input.json`);
  const snapshotFile = path.join(snapshotsDir, `${type}.snapshot.json`);

  // ✅ Ensure input file exists
  if (!fs.existsSync(inputFile)) {
    errors.push(`❌ Missing input file for ${type}: ${type}.input.json`);
  }

  // ✅ Ensure snapshot file exists
  if (!fs.existsSync(snapshotFile)) {
    errors.push(`❌ Missing snapshot file for ${type}: ${type}.snapshot.json`);
  } else {
    // ✅ Validate snapshot has valid inputShape block
    const snapshot = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
    const requiredFields = [
      'promptType', 'industry', 'audience', 'tone',
      'goal', 'productOrService', 'brandName',
      'founderName', 'promptInput'
    ];

    if (!snapshot.inputShape) {
      errors.push(`❌ ${type}.snapshot.json is missing inputShape`);
    } else {
      requiredFields.forEach(field => {
        if (!(field in snapshot.inputShape)) {
          errors.push(`❌ ${type}.snapshot.json → inputShape missing: '${field}'`);
        }
      });
    }
  }
});

if (errors.length > 0) {
  errors.forEach(e => console.error(e));
  console.error(`❌ ${errors.length} promptType coverage issues found.`);
  process.exit(1);
} else {
  console.log('✅ All promptTypes have input, snapshot, and valid inputShape.');
}
