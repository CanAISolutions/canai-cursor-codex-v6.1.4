// trustscore-threshold-protection.ts
// Polaris Ritual: TrustScore Threshold Protection
// Linked DreamState Test: #17 (Lifecycle Confidence Audit)
// Codex Pillar: Trust & Operational Resilience
// Emotional Contract: Prevents production deployment when user/system trust drops below critical threshold
// CI Enforcement: Yes — fails if TrustScore < threshold
// TrustScore Source: /reports/trustscore-summary.md
// Logs: /cursor/auto-actions.log.md + /trust/metrics.json

import fs from 'fs';
import path from 'path';

interface TrustScoreResult {
  name: string;
  passed: boolean;
  trustScore: number;
  threshold: number;
  details: string;
  timestamp: string;
  trustScoreDelta: number;
}

export async function checkTrustScoreThreshold(): Promise<TrustScoreResult> {
  const threshold = 75;
  const summaryPath = path.resolve(__dirname, '../reports/trustscore-summary.md');
  const logPath = path.resolve(__dirname, '../auto-actions.log.md');
  const metricsPath = path.resolve(__dirname, '../../trust/metrics.json');
  const name = 'trustscore-threshold-protection';
  const timestamp = new Date().toISOString();

  let trustScore = 100; // Default if no file found
  let sourceLine = '';

  if (fs.existsSync(summaryPath)) {
    const content = fs.readFileSync(summaryPath, 'utf-8').split('\n');
    for (const line of content) {
      if (line.includes('TrustScore')) {
        const match = line.match(/TrustScore: (\d+)/);
        if (match) {
          trustScore = parseInt(match[1], 10);
          sourceLine = line;
          break;
        }
      }
    }
  }

  const passed = trustScore >= threshold;

  const result: TrustScoreResult = {
    name,
    passed,
    trustScore,
    threshold,
    details: passed
      ? `TrustScore (${trustScore}) is above threshold (${threshold}).`
      : `TrustScore dropped to ${trustScore}, below Codex threshold (${threshold})!`,
    timestamp,
    trustScoreDelta: passed ? 0 : -25,
  };

  // CLI log
  const icon = passed ? '✅' : '❌';
  console.log(`[${icon}] Polaris Ritual – TrustScore Threshold → ${result.details}`);

  // Append to auto-actions log
  const logEntry = `\n[${timestamp}] ${icon} TrustScore Check – ${result.details}`;
  fs.appendFileSync(logPath, logEntry);

  // Write to trust/metrics.json
  const metric = {
    ritual: name,
    trustScore,
    threshold,
    passed,
    trustScoreDelta: result.trustScoreDelta,
    timestamp,
  };
  if (fs.existsSync(metricsPath)) {
    const existing = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
    existing.metrics.push(metric);
    fs.writeFileSync(metricsPath, JSON.stringify(existing, null, 2));
  }

  if (!passed && process.env.CI === 'true') {
    throw new Error(`[CI FAIL] TrustScore check failed: ${trustScore} < ${threshold}`);
  }

  return result;
}
