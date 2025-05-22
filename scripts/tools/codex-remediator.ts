#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { eventbusCanonicalizer } from './codemods/eventbus-canonicalizer';
import { importFix } from './codemods/import-fix';
import { typeAligner } from './codemods/type-aligner';
import { ensureReportDirs } from './codemods/ensure-report-dirs';

// Codemod imports (to be implemented)
// import { eventbusCanonicalizer } from './codemods/eventbus-canonicalizer';
// import { importFix } from './codemods/import-fix';
// import { typeAligner } from './codemods/type-aligner';

const AUTO_ACTIONS_LOG = path.resolve(__dirname, '../../../cursor/auto-actions.log.md');
const REMEDIATION_PENDING = path.resolve(__dirname, '../../../remediation-pending.md');
const REMEDIATION_PROGRESS = path.resolve(process.cwd(), 'cursor/auto-actions/remediation-progress.md');

export interface TestFailure {
  suite: string;
  file: string;
  error: string;
  rootCause: string;
}

interface RemediationEntry {
  testName: string;
  file: string;
  error?: string;
  remediation?: string;
  passConfirmation?: string;
  status: 'Open' | 'Remediated' | 'Flagged';
  detailsAnchor: string;
}

function runAllTests(): string {
  // Run the test suite and return the raw output (no --json, for reliability)
  return execSync('pnpm test', { encoding: 'utf-8' });
}

function parseFailures(testOutput: string): TestFailure[] {
  // Parse the standard Jest output to extract failed tests
  // Looks for 'FAIL' blocks and extracts test suite, file, and error message
  const failures: TestFailure[] = [];
  const failBlocks = testOutput.split(/\n(?=FAIL )/g);
  for (const block of failBlocks) {
    if (!block.startsWith('FAIL')) continue;
    const lines = block.split('\n');
    const suiteLine = lines[0];
    const fileMatch = suiteLine.match(/FAIL\s+(.+)/);
    const file = fileMatch ? fileMatch[1].trim() : '';
    let suite = '';
    let error = '';
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('  ● ')) {
        suite = lines[i].replace('  ● ', '').trim();
        // Next non-empty line is likely the error message
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) {
            error = lines[j].trim();
            break;
          }
        }
        failures.push({
          suite,
          file,
          error,
          rootCause: classifyRootCause(error),
        });
      }
    }
  }
  return failures;
}

function classifyRootCause(error: string): string {
  // Simple pattern matching for root cause classification
  if (error.includes('Cannot find module')) return 'import/module not found';
  if (error.includes('is not assignable')) return 'type/interface drift';
  if (error.includes('Expected') && error.includes('arguments')) return 'contract drift';
  // ...add more patterns as needed
  return 'unknown';
}

function logAction(what: string, why: string, how: string, confidence: number) {
  const logEntry = `\n## [${new Date().toISOString()}] Remediation Log\n\n**What:**  \n${what}\n\n**Why:**  \n${why}\n\n**How:**  \n${how}\n\n**Confidence:**  \n${(confidence * 100).toFixed(1)}%\n\n---\n`;
  fs.appendFileSync(AUTO_ACTIONS_LOG, logEntry);
}

function flagForManualReview(failure: TestFailure, attemptedFix: string) {
  const entry = `\n## [${new Date().toISOString()}] Pending Remediation\n\n**Test Suite:** ${failure.suite}\n**File:** ${failure.file}\n**Error:** ${failure.error}\n**Root Cause:** ${failure.rootCause}\n**Attempted Fix:** ${attemptedFix}\n\n---\n`;
  fs.appendFileSync(REMEDIATION_PENDING, entry);
}

function readRemediationProgress(): RemediationEntry[] {
  // Parse the remediation-progress.md file to extract the current list of tests and their statuses
  const content = fs.readFileSync(REMEDIATION_PROGRESS, 'utf8');
  const lines = content.split('\n');
  const entries: RemediationEntry[] = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith('| #')) inTable = true;
    else if (inTable && line.startsWith('|---')) continue;
    else if (inTable && line.startsWith('|')) {
      const cols = line.split('|').map(s => s.trim());
      if (cols.length >= 6 && cols[1] && cols[2]) {
        entries.push({
          testName: cols[1],
          file: cols[2],
          status: (cols[3] as RemediationEntry['status']) || 'Open',
          detailsAnchor: cols[4].replace('[Details](', '').replace(')', ''),
        });
      }
    } else if (inTable && !line.startsWith('|')) {
      break;
    }
  }
  return entries;
}

function updateRemediationEntry(entry: RemediationEntry & { error?: string; remediation?: string; passConfirmation?: string; status: 'Open' | 'Remediated' | 'Flagged'; }) {
  // Read the file
  let content = fs.readFileSync(REMEDIATION_PROGRESS, 'utf8');
  // Update the index table
  const tableRegex = new RegExp(`(\|\s*\d+\s*\|\s*${escapeRegExp(entry.testName)}\s*\|\s*${escapeRegExp(entry.file)}\s*\|\s*)(Open|Remediated|Flagged)(\s*\|)`, 'g');
  content = content.replace(tableRegex, `$1${entry.status}$3`);
  // Update the detailed entry
  const detailsRegex = new RegExp(`(###\s*${escapeRegExp(entry.detailsAnchor.replace('#', ''))}\n[\s\S]*?\*\*Error:\*\*\n)([\s\S]*?)(\n\*\*Remediation:\*\*\n)([\s\S]*?)(\n\*\*Test Pass Confirmation:\*\*\n)([\s\S]*?)(\n\*\*Status:\*\*\s*)(Open|Remediated|Flagged)`, 'g');
  content = content.replace(detailsRegex, (
    _match,
    p1, _oldError, p3, _oldRemediation, p5, _oldPass, p7, _oldStatus
  ) => {
    return (
      p1 + (entry.error || '') +
      p3 + (entry.remediation || '') +
      p5 + (entry.passConfirmation || '') +
      p7 + entry.status
    );
  });
  fs.writeFileSync(REMEDIATION_PROGRESS, content, 'utf8');
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  // 1. Read remediation progress and get open tests
  const remediationEntries = readRemediationProgress();
  // 2. Run all tests (to get fresh failures, if needed)
  const testOutput = runAllTests();
  const failures = parseFailures(testOutput);

  // 3. For each open test, attempt remediation
  for (const entry of remediationEntries.filter(e => e.status === 'Open')) {
    const failure = failures.find(f => f.file === entry.file && f.suite.includes(entry.testName.split('›')[0].trim()));
    if (!failure) continue; // Already passing or not found in latest run
    let confidence = 0;
    let attemptedFix = '';
    let remediation = '';
    let passConfirmation = '';
    let status: RemediationEntry['status'] = 'Open';
    switch (failure.rootCause) {
      case 'import/module not found':
        ({ confidence, summary: attemptedFix } = importFix(failure));
        break;
      case 'type/interface drift':
        ({ confidence, summary: attemptedFix } = typeAligner(failure));
        break;
      case 'contract drift':
        ({ confidence, summary: attemptedFix } = eventbusCanonicalizer(failure));
        break;
      default:
        if (failure.error.includes('ENOENT: no such file or directory')) {
          ({ confidence, summary: attemptedFix } = ensureReportDirs(failure));
        } else {
          confidence = 0;
          attemptedFix = 'No automated fix available.';
        }
    }
    remediation = attemptedFix;
    // Rerun the affected test
    try {
      execSync(`pnpm test -- ${failure.file}`, { stdio: 'ignore' });
      if (confidence >= 0.95) {
        passConfirmation = `✅ Passed on ${new Date().toISOString()}`;
        status = 'Remediated';
      } else {
        status = 'Flagged';
      }
    } catch {
      status = 'Flagged';
    }
    updateRemediationEntry({
      ...entry,
      error: failure.error,
      remediation,
      passConfirmation,
      status,
    });
  }
}

main(); 