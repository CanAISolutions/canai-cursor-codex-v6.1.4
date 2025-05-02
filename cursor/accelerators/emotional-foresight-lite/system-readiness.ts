/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/emotional-foresight-lite/system-readiness.ts`
 * purpose: Validates folder integrity, SHA sync, and config presence for CI pass
 * drop-type: Cursor-native, Codex-mandated
 */

// File: /cursor/accelerators/emotional-foresight-lite/system-readiness.ts
// CI enforcement logic – checks file presence, version lock, config schema

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
    'emotional-foresight-lite.ts',
    'emotional-foresight-lite.spec.ts',
    'foresight-model-lite.ts',
    'emotion-signal-spec.jsonc',
    'intervention-policy.md',
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

  const dir = path.resolve(__dirname);
  const found = fs.readdirSync(dir);
  const missingFiles = REQUIRED_FILES.filter(f => !found.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing enforcement files — Codex lock cannot complete.']
    };
  }

  // Validate config schema presence
  const configPath = path.resolve(__dirname, '../../../config/accelerators/emotional-foresight-lite-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: emotional-foresight-lite-config.jsonc']
    };
  }

  // Version lock SHA check
  const versionLockPath = path.join(dir, 'version.lock');
  const savedSHA = fs.readFileSync(versionLockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = savedSHA !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift
      ? ['version.lock SHA is outdated — run `git rev-parse HEAD` to update.']
      : []
  };
}
