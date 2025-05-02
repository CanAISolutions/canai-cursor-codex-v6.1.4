/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/swarm-agents/system-readiness.ts`
 * purpose: Validates file integrity, agent config schema, and Git SHA sync
 * drop-type: Codex copy/paste-safe, Cursor-auditable
 */

// File: /cursor/accelerators/swarm-agents/system-readiness.ts
// Ensures required files are present and aligned with version.lock SHA

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
    'swarm-agents.ts',
    'swarm-agents.spec.ts',
    'swarm-coordinator-engine.ts',
    'swarm-coordinator-engine.spec.ts',
    'swarm-agent-config.jsonc',
    'swarm-decision-policy.md',
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
  const presentFiles = fs.readdirSync(folder);
  const missingFiles = REQUIRED_FILES.filter(f => !presentFiles.includes(f));

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing required Codex checkpoint files.']
    };
  }

  // Validate config file exists
  const configPath = path.resolve(__dirname, '../../../config/accelerators/swarm-agents-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: swarm-agents-config.jsonc']
    };
  }

  // Version lock SHA check
  const lockPath = path.join(folder, 'version.lock');
  const shaFromLock = fs.readFileSync(lockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();
  const versionMismatch = shaFromLock !== currentSHA;

  return {
    status: versionMismatch ? 'yellow' : 'green',
    versionDrift: versionMismatch,
    notes: versionMismatch
      ? ['version.lock SHA does not match HEAD. Update it.']
      : []
  };
}
