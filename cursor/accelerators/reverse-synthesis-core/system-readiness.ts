# ✅ File: `system-readiness.ts`  
@location: `/cursor/accelerators/reverse-synthesis-core/system-readiness.ts`  
@purpose: CI enforcement for file structure, schema presence, and version locking  
@drop-type: Codex copy/paste-safe, Cursor-compatible

// File: /cursor/accelerators/reverse-synthesis-core/system-readiness.ts
// CI contract for file validation, Codex SHA lock, and pattern config integrity

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

type ReadinessStatus = 'green' | 'yellow' | 'red'

type ReadinessReport = {
  status: ReadinessStatus
  missingFiles?: string[]
  versionDrift?: boolean
  notes?: string[]
}

export function systemReadiness(): ReadinessReport {
  const REQUIRED_FILES = [
    'reverse-synthesis-core.ts',
    'reverse-synthesis-core.spec.ts',
    'reverse-synthesis-engine.ts',
    'reverse-synthesis-engine.spec.ts',
    'synthesis-patterns.jsonc',
    'synthesis-trace-schema.md',
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
  ]

  const folder = path.resolve(__dirname)
  const existingFiles = fs.readdirSync(folder)
  const missing = REQUIRED_FILES.filter(f => !existingFiles.includes(f))

  if (missing.length > 0) {
    return {
      status: 'red',
      missingFiles: missing,
      notes: ['Missing required Codex checkpoint files.']
    }
  }

  const versionPath = path.join(folder, 'version.lock')
  const savedSHA = fs.readFileSync(versionPath, 'utf-8').trim()
  const currentSHA = execSync('git rev-parse HEAD').toString().trim()

  const versionMismatch = savedSHA !== currentSHA

  return {
    status: versionMismatch ? 'yellow' : 'green',
    versionDrift: versionMismatch,
    notes: versionMismatch
      ? ['Commit SHA mismatch – update version.lock to match HEAD.']
      : []
  }
}
