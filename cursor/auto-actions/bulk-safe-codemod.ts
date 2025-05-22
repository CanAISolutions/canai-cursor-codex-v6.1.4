#!/usr/bin/env ts-node
/**
 * bulk-safe-codemod.ts
 *
 * What: Safely proposes and (optionally) applies bulk codemods for high-confidence, low-risk issues (e.g., import path drift, type/interface renames) across the codebase.
 * Why: To accelerate remediation of common test failures (import/module not found, type/interface drift) while maintaining Codex v6.1.4 trust, auditability, and emotional continuity standards.
 * How: Scans for known patterns, proposes changes, logs all actions, and only applies changes if explicitly enabled. Dry-run by default. Modular, auditable, and CLI-ready.
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import readline from 'readline';

// Codex safeguard: Block unhandled rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// CLI options
const args = process.argv.slice(2);
const HELP = args.includes('--help');
const APPLY = args.includes('--apply');
const DRY_RUN = !APPLY;

if (HELP) {
  console.log(`\nCodex Bulk Safe Codemod\n========================\n
Usage: ts-node bulk-safe-codemod.ts [--apply] [--help]

--apply   Actually apply changes (default is dry-run)
--help    Show this help message

What: Proposes and (optionally) applies safe, bulk codemods for high-confidence, low-risk issues (import path drift, type/interface renames).
Why: Accelerate remediation of common test failures while maintaining Codex trust and auditability.
How: Scans for known patterns, logs all actions, and only applies changes if --apply is set.\n`);
  process.exit(0);
}

// Configurable patterns for bulk correction (expand as needed)
const BULK_PATTERNS = [
  // Example: Replace all 'EventBus' with 'EventBus'
  {
    description: 'Replace EventBus with EventBus',
    fileGlob: '**/*.{ts,tsx}',
    search: /EventBus/g,
    replace: 'EventBus',
  },
  // Example: Update import paths for ai-provider
  {
    description: 'Update ai-provider import path',
    fileGlob: '**/ai-provider.ts',
    search: /from ['"](\.\.\/ai-provider)['"]/g,
    replace: "from 'cursor/agents/debug/engines/ai-provider'",
  },
  // Add more patterns as needed for your codebase
];

// Utility: Recursively find files matching a glob pattern
function findFiles(pattern: string): string[] {
  return glob.sync(pattern, { cwd: process.cwd(), absolute: true, ignore: 'node_modules/**' });
}

// Utility: Propose and (optionally) apply a codemod
function processFile(file: string, search: RegExp, replace: string, dryRun: boolean): boolean {
  const content = fs.readFileSync(file, 'utf8');
  if (!search.test(content)) return false;
  const newContent = content.replace(search, replace);
  if (dryRun) {
    console.log(`[DRY-RUN] Would update: ${file}`);
    return true;
  } else {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`[APPLIED] Updated: ${file}`);
    return true;
  }
}

// Main logic: Iterate over patterns and files
function runBulkCodemod() {
  let totalProposed = 0;
  let totalApplied = 0;
  for (const pattern of BULK_PATTERNS) {
    console.log(`\n---\nPattern: ${pattern.description}`);
    const files = findFiles(pattern.fileGlob);
    for (const file of files) {
      const changed = processFile(file, pattern.search, pattern.replace, DRY_RUN);
      if (changed) {
        totalProposed++;
        if (!DRY_RUN) totalApplied++;
      }
    }
  }
  // Summary
  console.log(`\nSummary: ${DRY_RUN ? 'Proposed' : 'Applied'} ${totalProposed} changes.`);
  if (DRY_RUN) {
    console.log('Run with --apply to make these changes.');
  }
}

// Entry point
runBulkCodemod(); 