// ritual-orchestrator.ts
// Polaris Ritual Engine: Central Orchestrator
// Linked Directive: /docs/directives/polaris-dreamstate.md
// Purpose: Execute and enforce all ritual contracts before deploy
// Exports:
//  - validateAllRituals
//  - getUnmetRituals
//  - assertRitualCoverage
//  - checkRitualsAndTrustScoreForCI
// Codex Pillars: Emotional UX, Operational Trust, Schema Stability
// CI Enforcement: Yes (fails build, logs to auto-actions)
// Trust Log: /trust/metrics.json
// Action Log: /cursor/auto-actions.log.md

import { checkEmotionalDrift } from './emotional-drift-detection';
import { checkTrustScoreThreshold } from './trustscore-threshold-protection';
import { checkFallbackDepthLimit } from './fallback-depth-limit';
import fs from 'fs';
import path from 'path';

const AUTO_ACTIONS_LOG = path.resolve(__dirname, '../auto-actions.log.md');
const TRUST_SCORE_REPORT = path.resolve(__dirname, '../reports/trustscore-summary.md');

/**
 * Executes all Polaris rituals in sequence.
 * Returns: array of ritual result objects
 */
export async function validateAllRituals() {
  const results = [
    await checkEmotionalDrift(),
    await checkTrustScoreThreshold(),
    await checkFallbackDepthLimit(),
    // 🚧 Add additional rituals here (e.g., checkOutputDeltaStability, etc.)
  ];
  return results;
}

/**
 * Returns rituals that did not pass.
 */
export async function getUnmetRituals() {
  const results = await validateAllRituals();
  return results.filter(r => !r.passed).map(r => r.name);
}

/**
 * CI Blocking Enforcement – fails if any ritual fails.
 */
export async function assertRitualCoverage() {
  const unmet = await getUnmetRituals();
  if (unmet.length > 0) {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ❌ Ritual Enforcement Failure – Unmet Rituals: ${unmet.join(', ')}`;
    console.error(message);
    fs.appendFileSync(AUTO_ACTIONS_LOG, `\n${message}`);
    throw new Error(message);
  }
}

/**
 * CI + TrustScore Enforcer.
 * Blocks deploy if:
 *  - Any ritual failed
 *  - TrustScore < 75 in trustscore-summary.md
 *  - Fallback system is not present
 */
export async function checkRitualsAndTrustScoreForCI() {
  const results = await validateAllRituals();
  const failed = results.filter(r => !r.passed);
  const timestamp = new Date().toISOString();
  let trustScoreLow = false;
  let trustScoreLine = '';
  let fallbackSafe = true;

  // Parse trustscore report
  if (fs.existsSync(TRUST_SCORE_REPORT)) {
    const report = fs.readFileSync(TRUST_SCORE_REPORT, 'utf-8').split('\n');
    for (const line of report) {
      if (line.includes('TrustScore')) {
        const match = line.match(/TrustScore: (\d+)/);
        if (match && parseInt(match[1], 10) < 75) {
          trustScoreLow = true;
          trustScoreLine = line.trim();
        }
      }
      if (line.includes('Fallback Present: ❌')) {
        fallbackSafe = false;
      }
    }
  }

  if (failed.length || trustScoreLow || !fallbackSafe) {
    const failReasons: string[] = [];
    if (failed.length) failReasons.push(`Failed Rituals: ${failed.map(f => f.name).join(', ')}`);
    if (trustScoreLow) failReasons.push(`TrustScore below threshold: ${trustScoreLine}`);
    if (!fallbackSafe) failReasons.push(`Fallback system missing or exceeded limit`);

    const logBlock = `\n## [${timestamp}] 🚫 CI Deploy Blocked\n- Reason(s): ${failReasons.join('\n- ')}\n`;
    fs.appendFileSync(AUTO_ACTIONS_LOG, logBlock);
    throw new Error(`CI Deploy Blocked:\n${failReasons.join('\n')}`);
  }

  console.log('✅ All rituals passed. TrustScore and fallback checks clear.');
}
