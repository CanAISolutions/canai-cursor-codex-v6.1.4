import { checkEmotionalDrift } from './rituals/emotional-drift-detection';

async function runAllRituals() {
  const results = [];

  results.push(await checkEmotionalDrift());
  // TODO: Add other rituals here

  const failed = results.filter(r => !r.passed);
  if (failed.length > 0) {
    console.error(`❌ ${failed.length} ritual(s) failed.`);
    process.exit(1);
  }

  console.log('✅ All Polaris rituals passed.');
}

runAllRituals();
