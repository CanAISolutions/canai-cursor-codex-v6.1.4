/**
 * ✅ File: `system-readiness.ts`
 * location: `/cursor/accelerators/conversion-predictor-lite/system-readiness.ts`
 * purpose: CI check for file structure, config presence, and version lock
 * drop-type: Codex copy/paste-safe
 */

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
    'conversion-predictor-engine.ts',
    'conversion-predictor-engine.spec.ts',
    'conversion-signals.jsonc',
    'behavior-contract.md',
    'purpose.md',
    'integration-contract.md',
    'future-integration.md',
    'observability.ts',
    'pattern-insights.ts',
    'file-manifest.md',
    'folder-checklist.md',
    'self-check-blocks.md',
    'README.md',
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

  const configPath = path.resolve(__dirname, '../../../config/accelerators/conversion-predictor-lite-config.jsonc');
  if (!fs.existsSync(configPath)) {
    return {
      status: 'red',
      notes: ['Missing config file: conversion-predictor-lite-config.jsonc']
    };
  }

  const lockPath = path.join(dir, 'version.lock');
  const savedSHA = fs.readFileSync(lockPath, 'utf-8').trim();
  const currentSHA = execSync('git rev-parse HEAD').toString().trim();

  if (savedSHA !== currentSHA) {
    return {
      status: 'yellow',
      versionDrift: true,
      notes: ['version.lock is out of sync with git HEAD.']
    };
  }

  return { status: 'green' };
}
