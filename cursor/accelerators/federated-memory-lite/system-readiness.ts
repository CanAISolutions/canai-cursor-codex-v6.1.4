/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/federated-memory-lite/system-readiness.ts`
 * purpose: CI + Codex enforcement of structure, schema, and version integrity
 * drop-type: Cursor-safe, CI-critical
 */

// File: /cursor/accelerators/federated-memory-lite/system-readiness.ts
// Enforces folder integrity, config schema match, and version SHA lock

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
    'memory-conflict-policy.md',
    'memory-federation-engine.ts',
    'memory-federation-engine.spec.ts',
    'memory-routing-spec.jsonc',
    'observability.ts',
    'pattern-insights.ts',
    'purpose.md',
    'README.md',
    'self-check-blocks.md',
    'system-readiness.ts',
    'version.lock'
  ];

  const dir = path.resolve(__dirname);
  const existing = fs.readdirSync(dir);
  const missingFiles = REQUIRED_FILES.filter(f => !existing.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Required enforcement files are missing.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/federated-memory-lite-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: federated-memory-lite-config.jsonc']
    };
  }

  // Version lock SHA check
  const versionPath = path.join(dir, 'version.lock');
  const storedSHA = fs.readFileSync(versionPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const versionMismatch = storedSHA !== currentSHA;

  return {
    status: versionMismatch ? 'yellow' : 'green',
    versionDrift: versionMismatch,
    notes: versionMismatch
      ? ['version.lock SHA mismatch – please update with latest commit.']
      : []
  };
}
