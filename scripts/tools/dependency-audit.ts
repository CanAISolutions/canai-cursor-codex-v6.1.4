#!/usr/bin/env ts-node

/**
 * dependency-audit.ts
 *
 * WHAT: CLI tool to audit test dependencies against the canonical mapping table.
 * WHY: Enforces Codex v6.1.4 compliance, auditability, and remediation tracking.
 * HOW: Parses the markdown table, checks file/dependency status, outputs actionable report.
 *
 * Codex standards: Modular, emotionally intelligent, operator voice, fallback logic, CLI-ready.
 */

import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// --- CLI Setup ---
const argv = yargs(hideBin(process.argv))
  .option('help', { alias: 'h', type: 'boolean', description: 'Show help' })
  .option('exclude', { type: 'string', description: 'Comma-separated list of files or directories to exclude' })
  .option('output', { alias: 'o', type: 'string', description: 'Output format: json or markdown', default: 'markdown' })
  .option('table', { alias: 't', type: 'string', description: 'Path to dependency table markdown', default: 'cursor/reports/Comprehensive Dependency Table with All Test Files.markdown' })
  .parseSync();

if (argv.help) {
  console.log(`\nCodex Dependency Audit\n----------------------\nAudits test dependencies for Codex v6.1.4 compliance.\n\nUsage:\n  ts-node scripts/tools/dependency-audit.ts [--table path] [--exclude files] [--output json|markdown]\n\nOptions:\n  --help, -h        Show help\n  --table, -t       Path to dependency table markdown\n  --exclude         Comma-separated files/dirs to exclude\n  --output, -o      Output format: json or markdown (default: markdown)\n`);
  process.exit(0);
}

// --- Utility Types ---
interface DependencyRow {
  dependency: string;
  frequency: string;
  testFiles: string[];
  role: string;
  status: string;
  usesMocking: boolean;
  usesSnapshot: boolean;
  usesEmotionAssertions: boolean;
  refactorStrategy: string;
  notes: string;
}

interface AuditFinding {
  testFile: string;
  dependency: string;
  status: string;
  issue: string;
  recommendedAction: string;
}

// --- Parse Markdown Table ---
/**
 * Parses the dependency table markdown into structured DependencyRow[]
 * Fallback: Returns [] and logs error if parsing fails.
 */
function parseDependencyTable(markdownPath: string): DependencyRow[] {
  try {
    const content = fs.readFileSync(markdownPath, 'utf-8');
    const lines = content.split('\n');
    const tableStart = lines.findIndex(l => l.startsWith('|'));
    if (tableStart === -1) return [];
    const tableLines = lines.slice(tableStart).filter(l => l.trim().startsWith('|'));
    if (tableLines.length < 2) return [];
    const headers = tableLines[0].split('|').map(h => h.trim());
    const rows = tableLines.slice(2).map(line => line.split('|').map(cell => cell.trim()));
    return rows.map(cells => ({
      dependency: cells[1] || '',
      frequency: cells[2] || '',
      testFiles: (cells[3] || '').split(',').map(f => f.trim()).filter(Boolean),
      role: cells[4] || '',
      status: cells[5] || '',
      usesMocking: /yes/i.test(cells[6] || ''),
      usesSnapshot: /yes/i.test(cells[7] || ''),
      usesEmotionAssertions: /yes/i.test(cells[8] || ''),
      refactorStrategy: cells[9] || '',
      notes: cells[10] || '',
    }));
  } catch (err) {
    console.error(`[Codex] Failed to parse dependency table:`, err);
    return [];
  }
}

// --- Main Audit Logic ---
/**
 * Audits all test files and dependencies for compliance.
 * Fallback: Flags as 'missing' if file/dependency not found.
 */
function auditDependencies(table: DependencyRow[], exclude: string[] = []): AuditFinding[] {
  const findings: AuditFinding[] = [];
  for (const dep of table) {
    for (const testFile of dep.testFiles) {
      if (!testFile || exclude.some(ex => testFile.includes(ex))) continue;
      const testPath = path.resolve(process.cwd(), testFile);
      // Check file existence
      const fileExists = fs.existsSync(testPath);
      if (!fileExists) {
        findings.push({
          testFile,
          dependency: dep.dependency,
          status: 'missing',
          issue: 'Test file not found',
          recommendedAction: 'Check path or restore file',
        });
        continue;
      }
      // Check dependency status
      if (/broken|not_installed|missing_mapping/i.test(dep.status)) {
        findings.push({
          testFile,
          dependency: dep.dependency,
          status: dep.status,
          issue: `Dependency issue: ${dep.status}`,
          recommendedAction: dep.refactorStrategy || 'Remediate dependency',
        });
      }
      // Flag non-canonical mocks/snapshots/emotion assertions
      if (dep.usesMocking && !/mock|migrate|canonical/i.test(dep.refactorStrategy)) {
        findings.push({
          testFile,
          dependency: dep.dependency,
          status: 'mocking',
          issue: 'Non-canonical mock usage',
          recommendedAction: 'Replace with real logic or justify as canonical',
        });
      }
      if (dep.usesSnapshot && !/snapshot|rebind/i.test(dep.refactorStrategy)) {
        findings.push({
          testFile,
          dependency: dep.dependency,
          status: 'snapshot',
          issue: 'Snapshot usage without rebind',
          recommendedAction: 'Rebind or justify snapshot',
        });
      }
      if (dep.usesEmotionAssertions && !/emotion|assert|rewrite/i.test(dep.refactorStrategy)) {
        findings.push({
          testFile,
          dependency: dep.dependency,
          status: 'emotion_assertion',
          issue: 'Emotion assertion without rewrite',
          recommendedAction: 'Rewrite with fallback-chain assert',
        });
      }
    }
  }
  return findings;
}

// --- Output Report ---
/**
 * Outputs the audit findings in the requested format.
 * Fallback: Defaults to markdown if unknown format.
 */
function outputReport(findings: AuditFinding[], format: string) {
  if (format === 'json') {
    console.log(JSON.stringify(findings, null, 2));
    return;
  }
  // Markdown output
  if (!findings.length) {
    console.log('✅ All test files and dependencies are Codex-compliant.');
    return;
  }
  console.log('| Test File | Dependency | Status | Issue | Recommended Action |');
  console.log('|-----------|------------|--------|-------|-------------------|');
  for (const f of findings) {
    console.log(`| ${f.testFile} | ${f.dependency} | ${f.status} | ${f.issue} | ${f.recommendedAction} |`);
  }
}

// --- Main Execution ---
(function main() {
  // Parse exclusions
  const exclude = argv.exclude ? argv.exclude.split(',').map((e: string) => e.trim()) : [];
  // Parse dependency table
  const table = parseDependencyTable(argv.table);
  if (!table.length) {
    console.error('[Codex] No dependency data found. Aborting audit.');
    process.exit(1);
  }
  // Run audit
  const findings = auditDependencies(table, exclude);
  // Output
  outputReport(findings, argv.output);
})(); 