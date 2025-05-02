/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/auto-rollback/system-readiness.ts`
 * purpose: CI health check and config/version enforcement for auto-rollback agent
 * drop-type: Copy/paste-safe (Codex-critical)
 */

// File: /cursor/accelerators/auto-rollback/system-readiness.ts
// Enforces system readiness scoring for the auto-rollback agent

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
    'auto-rollback.ts',            // intended entrypoint
    'auto-rollback.spec.ts',       // wrapper tests
    'rollback-engine.ts',          
    'rollback-engine.test.ts',     
    'trigger-conditions.jsonc',    
    'rollback-policy.md',          
    'behavior-contract.md',
    'purpose.md',
    'integration-contract.md',
    'future-integration.md',
    'observability.ts',
    'pattern-insights.ts',
    'self-check-blocks.md',
    'folder-checklist.md',
    'file-manifest.md',
    'system-readiness.ts',
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

  // Version lock SHA check
  const versionLockPath = path.join(dir, 'version.lock');
  const savedSHA = fs.readFileSync(versionLockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = savedSHA !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['version.lock is out of sync with git HEAD'] : []
  };
}
