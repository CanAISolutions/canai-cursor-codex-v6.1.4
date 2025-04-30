// ✅ test-codex-header-comments.ts
// @codex-purpose: Enforce header comment metadata on all blueprint and snapshot files
// @codex-system: file-level metadata enforcement
// @codex-critical: Prevents untraceable tests, weak Copilot context, or schema drift
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const testDataDir = path.resolve(__dirname, '..');
const requiredHeaders = [
  '@codex-purpose',
  '@codex-system',
  '@codex-critical',
  '@codex-verified'
];

const violations: string[] = [];

function scan(dir: string) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const isDir = fs.statSync(full).isDirectory();

    if (isDir) {
      scan(full);
    } else if (file.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');

      requiredHeaders.forEach(tag => {
        if (!content.includes(tag)) {
          violations.push(`❌ Missing ${tag} in: ${file}`);
        }
      });
    }
  });
}

scan(testDataDir);

if (violations.length) {
  violations.forEach(v => console.error(v));
  console.error(`❌ ${violations.length} files missing Codex header comments.`);
  process.exit(1);
} else {
  console.log('✅ All .json files contain required Codex header metadata.');
}
