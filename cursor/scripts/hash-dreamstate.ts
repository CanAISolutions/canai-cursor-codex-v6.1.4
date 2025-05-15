import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

const DREAMSTATE_PATH = 'cursor/dna/cursor-dreamstate.md';

function updateDreamstateHash() {
  const content = readFileSync(DREAMSTATE_PATH, 'utf8');
  const hash = createHash('sha256').update(content).digest('hex');
  const updatedContent = content.replace(
    /hash: "{{SHA256_PLACEHOLDER}}"/,
    `hash: "${hash}"`
  );
  writeFileSync(DREAMSTATE_PATH, updatedContent);
  console.log(`Updated hash: ${hash}`);
}

updateDreamstateHash();