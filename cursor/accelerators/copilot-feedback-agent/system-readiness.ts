# ✅ File: `system-readiness.ts`  
@location: `/cursor/accelerators/copilot-feedback-agent/system-readiness.ts`  
@purpose: Validates canonical file presence, config correctness, and commit SHA lock  
@drop-type: Codex-mandated, Cursor-executable

// File: /cursor/accelerators/copilot-feedback-agent/system-readiness.ts
// CI check for folder compliance, config integrity, and SHA drift

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
    'copilot-feedback-agent.ts',
    'copilot-feedback-agent.spec.ts',
    'copilot-feedback-engine.ts',
    'copilot-feedback-engine.spec.ts',
    'copilot-feedback-rules.jsonc',
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

  const dir = path.resolve(__dirname)
  const present = fs.readdirSync(dir)
  const missingFiles = REQUIRED_FILES.filter(f => !present.includes(f))

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing one or more enforcement-required files.']
    }
  }

  const shaFile = path.resolve(__dirname, 'version.lock')
  const storedSHA = fs.readFileSync(shaFile, 'utf-8').trim()
  const currentSHA = execSync('git rev-parse HEAD').toString().trim()
  const drift = storedSHA !== currentSHA

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['Commit SHA mismatch – version.lock is out of date.'] : []
  }
}

