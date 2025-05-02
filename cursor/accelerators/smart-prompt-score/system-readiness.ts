/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/smart-prompt-score/system-readiness.ts`
 * purpose: Validates file presence, schema sync, and Git commit alignment
 * drop-type: Codex copy/paste-safe, Cursor-auditable
 */

// File: /cursor/accelerators/smart-prompt-score/system-readiness.ts
// CI gate for Codex compliance, schema sync, and commit integrity

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type ReadinessStatus = 'green' | 'yellow' | 'red';

type ReadinessReport = {
  status: ReadinessStatus;
  missingFiles?: string[];
  versionDrift?: boolean;
  notes?: string[];
};

export function systemReadiness(): ReadinessReport {
  const REQUIRED_FILES = [
    'smart-prompt-score.ts',
    'smart-prompt-score.spec.ts',
    'prompt-score-engine.ts',
    'prompt-score-engine.spec.ts',
    'scoring-signals.jsonc',
    'scoring-policy.md',
    'behavior-contract.md',
    'purpose.md',
    'integration-contract.md',
    'future-integration.md',
    'observability.ts',
    'pattern-insights.ts',
    'system-readiness.ts',
    'self-check-blocks.md',
    'folder-checklist.md',
    'file-manifest.md',
    'version.lock'
  ];

  const folder = path.resolve(__dirname);
  const present = fs.readdirSync(folder);
  const missing = REQUIRED_FILES.filter(file => !present.includes(file));

  if (missing.length > 0) {
    return {
      status: 'red',
      missingFiles: missing,
      notes: ['Codex checkpoint failure: missing required files.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/smart-prompt-score-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: smart-prompt-score-config.jsonc']
    };
  }

  // Version lock SHA check
  const lockPath = path.join(folder, 'version.lock');
  const shaFromLock = fs.readFileSync(lockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = shaFromLock !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift
      ? ['Git SHA mismatch — please update version.lock.']
      : []
  };
}
