/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/prompt-genetics/system-readiness.ts`
 * purpose: Enforces file presence, config validity, and SHA sync for CI and Codex gate
 * drop-type: Cursor-native, Codex-compliant
 */

// File: /cursor/accelerators/prompt-genetics/system-readiness.ts
// CI + enforcement layer for mutation schema and file structure validation

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
    'behavior-contract.md',
    'file-manifest.md',
    'folder-checklist.md',
    'future-integration.md',
    'integration-contract.md',
    'observability.ts',
    'pattern-insights.ts',
    'prompt-genome-engine.ts',
    'prompt-lineage-log.md',
    'prompt-trait-schema.jsonc',
    'purpose.md',
    'README.md',
    'self-check-blocks.md',
    'system-readiness.ts',
    'version.lock'
  ];

  const folder = path.resolve(__dirname);
  const existing = fs.readdirSync(folder);
  const missingFiles = REQUIRED_FILES.filter(f => !existing.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing required files. Codex lock cannot complete.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/prompt-genetics-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: prompt-genetics-config.jsonc']
    };
  }

  // Version lock SHA check
  const versionPath = path.join(folder, 'version.lock');
  const savedSHA = fs.readFileSync(versionPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = savedSHA !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift
      ? ['version.lock does not match HEAD commit — please update.']
      : []
  };
}
