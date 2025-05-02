/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/copilot-injector/system-readiness.ts`
 * purpose: Enforces canonical file presence, SHA lock integrity, and config safety
 * drop-type: Cursor-executable, CI-critical
 */

// File: /cursor/accelerators/copilot-injector/system-readiness.ts
// Validates structure, file presence, and version drift for CI

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
    'copilot-feedback-policy.md',
    'copilot-injector.spec.ts',
    'inject-feedback-suggestion.ts',
    'inject-feedback-suggestion.spec.ts',
    'copilot-trigger-rules.jsonc',
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
  const actual = fs.readdirSync(dir);
  const missingFiles = REQUIRED_FILES.filter(f => !actual.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['One or more required files are missing.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/copilot-injector-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: copilot-injector-config.jsonc']
    };
  }

  // Version lock check
  const lockPath = path.resolve(__dirname, 'version.lock');
  const savedSHA = fs.readFileSync(lockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const drift = savedSHA !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['SHA mismatch — version.lock needs update.'] : []
  };
}
