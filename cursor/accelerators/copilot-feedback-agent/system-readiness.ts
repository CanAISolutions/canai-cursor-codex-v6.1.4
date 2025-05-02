/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/copilot-feedback-agent/system-readiness.ts`
 * purpose: Validates canonical file presence, config correctness, and commit SHA lock
 * drop-type: Codex-mandated, Cursor-executable
 */

// File: /cursor/accelerators/copilot-feedback-agent/system-readiness.ts
// CI check for folder compliance, config integrity, and SHA drift

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
    'copilot-feedback-engine.ts',
    'copilot-feedback-engine.spec.ts',
    'copilot-feedback-logging.md',
    'copilot-feedback-policy.md',
    'copilot-feedback-rules.jsonc',
    'file-manifest.md',
    'folder-checklist.md',
    'future-integration.md',
    'integration-contract.md',
    'observability.ts',
    'pattern-insights.ts',
    'purpose.md',
    'README.md',
    'self-check-blocks.md',
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
      notes: ['Missing one or more enforcement-required files.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/copilot-feedback-agent-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: copilot-feedback-agent-config.jsonc']
    };
  }

  // Check version.lock against current Git SHA
  const versionLockPath = path.resolve(__dirname, 'version.lock');
  const storedSHA = fs.readFileSync(versionLockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = storedSHA !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['Commit SHA mismatch – version.lock is out of date.'] : []
  };
}
