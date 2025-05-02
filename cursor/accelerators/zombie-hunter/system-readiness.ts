/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/zombie-hunter/system-readiness.ts`
 * purpose: CI enforcement, file audit, and version sync for agent stability
 * drop-type: Codex copy/paste-safe, snapshot-safe
 */

// File: /cursor/accelerators/zombie-hunter/system-readiness.ts
// CI enforcement for Codex compliance, version integrity, and file safety

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type ReadinessStatus = 'green' | 'yellow' | 'red';

interface ReadinessReport {
  status: ReadinessStatus;
  missingFiles?: string[];
  versionDrift?: boolean;
  notes?: string[];
}

export function systemReadiness(): ReadinessReport {
  const REQUIRED_FILES = [
    'zombie-rescue-engine.ts',
    'zombie-rescue-engine.spec.ts',
    'zombie-detection-rules.jsonc',
    'stagnation-policy.md',
    'behavior-contract.md',
    'self-check-blocks.md',
    'README.md',
    'purpose.md',
    'integration-contract.md',
    'future-integration.md',
    'observability.ts',
    'pattern-insights.ts',
    'file-manifest.md',
    'folder-checklist.md',
    'system-readiness.ts',
    'version.lock'
  ];

  const folderPath = path.resolve(__dirname);
  const existingFiles = fs.readdirSync(folderPath);
  const missingFiles = REQUIRED_FILES.filter(f => !existingFiles.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing required enforcement files.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/zombie-hunter-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: zombie-hunter-config.jsonc']
    };
  }

  // Version lock SHA check
  const versionPath = path.join(folderPath, 'version.lock');
  const shaFromFile = fs.readFileSync(versionPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();

  const drift = shaFromFile !== currentSHA;

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift
      ? ['Git SHA mismatch — update version.lock to reflect current commit.']
      : ['All enforcement checks passed.']
  };
}
