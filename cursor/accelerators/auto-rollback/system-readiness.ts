/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/auto-rollback/system-readiness.ts`
 * purpose: CI health check and config/schema enforcement for auto-rollback agent
 * drop-type: Copy/paste-safe (Codex-critical)
 */

// File: /cursor/accelerators/auto-rollback/system-readiness.ts
// Enforces system readiness scoring for the auto-rollback agent

import fs from 'fs';
import path from 'path';
import { autoRollbackConfigSchema, minimumFields } from './auto-rollback.schema';

type ReadinessStatus = 'green' | 'yellow' | 'red';

type ReadinessReport = {
  status: ReadinessStatus;
  missingFields?: string[];
  missingFiles?: string[];
  versionDrift?: boolean;
  notes?: string[];
};

export function systemReadiness(): ReadinessReport {
  const REQUIRED_FILES = [
    'behavior-contract.md',
    'auto-rollback.ts',
    'auto-rollback.spec.ts',
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
  const files = fs.readdirSync(dir);

  const missingFiles = REQUIRED_FILES.filter(f => !files.includes(f));
  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing one or more required enforcement files.']
    };
  }

  const configPath = path.resolve(__dirname, '../../../config/accelerators/auto-rollback-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: auto-rollback-config.jsonc']
    };
  }

  const configRaw = fs.readFileSync(configPath, 'utf-8');
  const configParsed = JSON.parse(configRaw);
  const presentKeys = Object.keys(configParsed);
  const missingFields = minimumFields.filter(key => !presentKeys.includes(key));

  if (missingFields.length > 0) {
    return {
      status: 'yellow',
      missingFields,
      notes: ['Config present but missing required fields.']
    };
  }

  const versionLockPath = path.resolve(__dirname, 'version.lock');
  const versionSHA = fs.readFileSync(versionLockPath, 'utf-8').trim();
  const currentSHA = require('child_process').execSync('git rev-parse HEAD').toString().trim();

  const versionDrift = versionSHA !== currentSHA;

  return {
    status: versionDrift ? 'yellow' : 'green',
    versionDrift,
    notes: versionDrift ? ['version.lock is out of sync with git SHA'] : []
  };
}
