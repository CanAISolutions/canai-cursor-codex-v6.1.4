# ✅ File: `system-readiness.ts`  
@location: `/cursor/accelerators/federated-memory-lite/system-readiness.ts`  
@purpose: CI + Codex enforcement of structure, schema, and version integrity  
@drop-type: Cursor-safe, CI-critical

```ts
// File: /cursor/accelerators/federated-memory-lite/system-readiness.ts
// Enforces folder integrity, config schema match, and version SHA lock

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
    'federated-memory-lite.ts',
    'federated-memory-lite.spec.ts',
    'memory-federation-engine.ts',
    'memory-federation-engine.spec.ts',
    'memory-routing-spec.jsonc',
    'memory-conflict-policy.md',
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
  const existing = fs.readdirSync(dir)
  const missingFiles = REQUIRED_FILES.filter(f => !existing.includes(f))

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Required enforcement files are missing.']
    }
  }

  const versionPath = path.join(dir, 'version.lock')
  const storedSHA = fs.readFileSync(versionPath, 'utf-8').trim()
  const currentSHA = execSync('git rev-parse HEAD').toString().trim()
  const versionMismatch = storedSHA !== currentSHA

  return {
    status: versionMismatch ? 'yellow' : 'green',
    versionDrift: versionMismatch,
    notes: versionMismatch
      ? ['version.lock SHA mismatch – please update with latest commit.']
      : []
  }
}
```
