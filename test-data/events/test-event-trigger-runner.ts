// ✅ test-event-trigger-runner.ts
// @codex-purpose: Manual trigger tester for event simulation during local dev or CLI debugging
// @codex-system: event router test harness
// @codex-critical: Enables safe testing of event JSON files without full backend runtime
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const eventDir = path.resolve(__dirname);
const files = fs.readdirSync(eventDir).filter(f => f.endsWith('.json'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n📦 Codex Event Trigger Simulator');
console.log('--------------------------------');
files.forEach((file, idx) => {
  console.log(`${idx + 1}. ${file}`);
});

rl.question('\nSelect an event to simulate (number): ', (answer) => {
  const index = parseInt(answer.trim()) - 1;
  if (isNaN(index) || index < 0 || index >= files.length) {
    console.error('\n❌ Invalid selection. Exiting.\n');
    rl.close();
    process.exit(1);
  }

  const filename = files[index];
  const fullPath = path.join(eventDir, filename);
  const content = fs.readFileSync(fullPath, 'utf8');
  const json = JSON.parse(content);

  console.log('\n🚀 Simulating Event:\n');
  console.log(JSON.stringify(json, null, 2));

  console.log('\n🧠 Codex Metadata:\n');
  const lines = content.split('\n').filter(line => line.startsWith('// @codex'));
  lines.forEach(line => console.log(line.replace('// ', '')));

  console.log('\n🔁 Routing to:', json._meta?.routeTo || '⚠️ Not defined');
  console.log('⚡ Trigger Field:', json._meta?.triggerField || '⚠️ Not defined');
  console.log('\n✅ Simulation complete.\n');

  rl.close();
});
