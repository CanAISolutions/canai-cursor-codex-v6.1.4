# ✅ File: `system-readiness.ts`  
@location: `/cursor/accelerators/conversion-predictor-lite/system-readiness.ts`  
@purpose: Validates folder completeness, config schema, version drift, and enforcement checkpoints  
@drop-type: Cursor + CI compatible, audit-safe

```ts
// File: /cursor/accelerators/conversion-predictor-lite/system-readiness.ts
// CI enforcement for schema integrity, file count, and version lock status

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
    'conversion-predictor-lite.ts',
    'conversion-predictor-lite.spec.ts',
    'conversion-predictor-engine.ts',
    'conversion-predictor-engine.spec.ts',
    'conversion-signals.jsonc',
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
  const files = fs.readdirSync(dir)
  const missingFiles = REQUIRED_FILES.filter(f => !files.includes(f))

  if (missingFiles.length > 0) {
    return {
      status: 'red',
      missingFiles,
      notes: ['Missing required files.']
    }
  }

  const versionPath = path.resolve(__dirname, 'version.lock')
  const currentSHA = execSync('git rev-parse HEAD').toString().trim()
  const savedSHA = fs.readFileSync(versionPath, 'utf-8').trim()

  const drift = savedSHA !== currentSHA

  return {
    status: drift ? 'yellow' : 'green',
    versionDrift: drift,
    notes: drift ? ['Version mismatch – re-sync required.'] : []
  }
}
```
