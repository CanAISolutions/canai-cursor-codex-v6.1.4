// ✅ test-output-delta-drift.ts
// @codex-purpose: Detect GPT output drift in snapshot.json files
// @codex-system: regression audit for generated output
// @codex-critical: Prevents silent decay, hallucination, or untracked prompt evolution
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const snapshotsDir = path.resolve(__dirname, '..', 'snapshots');
const hashLogPath = path.join(snapshotsDir, '.snapshot-hashes.json');

// Load prior snapshot hash records (if any)
let priorHashes: Record<string, string> = {};
if (fs.existsSync(hashLogPath)) {
  priorHashes = JSON.parse(fs.readFileSync(hashLogPath, 'utf8'));
}

const newHashes: Record<string, string> = {};
const errors: string[] = [];

fs.readdirSync(snapshotsDir)
  .filter(f => f.endsWith('.snapshot.json'))
  .forEach(file => {
    const fullPath = path.join(snapshotsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Remove volatile fields (like _meta or score) if needed
    const json = JSON.parse(content);
    delete json._meta;

    const hash = crypto.createHash('sha256').update(JSON.stringify(json)).digest('hex');
    newHashes[file] = hash;

    const previous = priorHashes[file];
    if (previous && previous !== hash) {
      errors.push(`❌ Snapshot drift detected in ${file} — output hash has changed.`);
    }
  });

// Save new hash log
fs.writeFileSync(hashLogPath, JSON.stringify(newHashes, null, 2));

if (errors.length > 0) {
  errors.forEach(e => console.error(e));
  console.error(`❌ ${errors.length} snapshot drift issues detected.`);
  process.exit(1);
} else {
  console.log('✅ No output drift — all snapshots are stable.');
}
