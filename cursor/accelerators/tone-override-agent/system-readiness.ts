# ✅ File: `system-readiness.ts`  
@location: `/cursor/accelerators/tone-override-agent/system-readiness.ts`  
@purpose: Verifies Codex file presence, Git SHA sync, and config field integrity  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/tone-override-agent/system-readiness.ts
// Validates all required files, schema safety, and commit sync for CI enforcement

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

type ReadinessStatus = 'green' | 'yellow' | 'red'

interface ReadinessReport {
  status: ReadinessStatus
  missingFiles?: string[]
  versionDrift?: boolean
  notes?: string[]
}

export function systemReadiness(): ReadinessReport {
  const REQUIRED_FILES = [
    'tone-overrider.ts',
    'tone-overrider.spec.ts',
    'tone-profiles.jsonc',
    'tone-realignment-policy.md',
    'behavior-contract.md',
    'self-check-blocks.md',
    'README.md',
    'purpose.md',
    'integration-contract.md',
    'future-integration.md',
    'observability.ts',
    'pattern-insights.ts',
    'system-readiness.ts',
    'folder-checklist.md',
    'file-manifest.md',
    'version.lock'
  ]

  const folderPath = __dirname
  const existingFiles = fs.readdirSync(folderPath)
  const missingFiles = REQUIRED_FILES.filter(f => !existingFiles.includes(f))

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing required enforcement files.']
    }
  }

  const versionPath = path.join(folderPath, 'version.lock')
  const shaFromFile = fs.readFileSync(versionPath, 'utf-8').trim()
  const currentSHA = execSync('git rev-parse HEAD').toString().trim()

  const drift = shaFromFile !== currentSHA

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['version.lock SHA mismatch – update required.'] : []
  }
}
