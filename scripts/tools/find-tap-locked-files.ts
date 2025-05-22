#!/usr/bin/env ts-node
/**
 * find-tap-locked-files.ts
 *
 * Purpose: CLI tool to recursively scan the project for TAP-related metadata, comments, or headers.
 * What: Finds files referencing TAP-locked status, TAP metadata, or trust score enforcement.
 * Why: Ensures all TAP-locked or TAP-relevant files are discoverable for audit and compliance.
 * How: Recursively searches for TAP-related keywords and outputs file paths and line numbers.
 *
 * Usage: ts-node scripts/tools/find-tap-locked-files.ts [--help]
 *
 * Codex v6.1.4 CLI standards enforced.
 */

import * as fs from 'fs';
import * as path from 'path';

const KEYWORDS = [
  'TAP-locked',
  'TAP-Status',
  'TAP Version',
  'Trust Score',
  'Trust Lock',
  'Codex Version',
  'Trust Score Threshold',
  // Also match just 'TAP' as a word (not as part of another word)
  /\bTAP\b/
];

const IGNORED_DIRS = ['node_modules', '.git', 'coverage', 'dist', 'build', '.next', '.turbo'];

function printHelp() {
  console.log(`\nfind-tap-locked-files.ts\n------------------------\nRecursively scans for TAP-related files and metadata.\n\nUsage:\n  ts-node scripts/tools/find-tap-locked-files.ts\n  ts-node scripts/tools/find-tap-locked-files.ts --help\n\nOptions:\n  --help    Show this help message\n\nCodex v6.1.4 CLI standards enforced.\n`);
}

function isIgnoredDir(dir: string): boolean {
  return IGNORED_DIRS.some(ignored => dir.includes(ignored));
}

function scanFile(filePath: string, results: {file: string, line: number, match: string}[]) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const keyword of KEYWORDS) {
      if (typeof keyword === 'string') {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          results.push({ file: filePath, line: idx + 1, match: line.trim() });
        }
      } else if (keyword instanceof RegExp) {
        if (keyword.test(line)) {
          results.push({ file: filePath, line: idx + 1, match: line.trim() });
        }
      }
    }
  });
}

function scanDir(dir: string, results: {file: string, line: number, match: string}[]) {
  if (isIgnoredDir(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, results);
    } else if (entry.isFile()) {
      // Only scan text/code files
      if (/\.(ts|js|md|json|yaml|yml|txt)$/i.test(entry.name)) {
        scanFile(fullPath, results);
      }
    }
  }
}

function main() {
  if (process.argv.includes('--help')) {
    printHelp();
    process.exit(0);
  }
  const results: {file: string, line: number, match: string}[] = [];
  scanDir(process.cwd(), results);
  if (results.length === 0) {
    console.log('No TAP-related files or metadata found.');
    return;
  }
  console.log('\nTAP-Related Files and Metadata Found:\n-------------------------------------');
  for (const {file, line, match} of results) {
    console.log(`${file}:${line}: ${match}`);
  }
  console.log(`\nTotal matches: ${results.length}`);
}

main(); 