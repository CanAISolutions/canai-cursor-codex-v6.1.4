/**
 * @file auditRetryUsage.ts
 * @description Scans project for direct p-retry usage instead of wrapped pRetryWithTrace.
 * Flags unsafe retry calls to enforce traceId logging and structured auditability.
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

function walk(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (extname(filePath) === '.ts') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function auditRetryUsage(root: string): void {
  const files = walk(root);
  const violations: { file: string; line: string; lineNumber: number }[] = [];

  files.forEach((file) => {
    const content = readFileSync(file, 'utf-8').split('\n');
    content.forEach((line, index) => {
      if (
        line.includes("from 'p-retry'") &&
        !file.endsWith('pRetry.ts') &&
        !line.includes('Codex Edition')
      ) {
        violations.push({ file, line, lineNumber: index + 1 });
      }
    });
  });

  if (violations.length === 0) {
    console.log('✅ No unsafe p-retry usage found.');
  } else {
    console.warn('\n🚨 Detected direct p-retry usage outside of Codex wrapper:\n');
    violations.forEach(({ file, line, lineNumber }) => {
      console.warn(`- ${file}:${lineNumber}\n  ${line.trim()}\n  💡 Use: import { pRetryWithTrace as pRetry } from './utils/pRetry'\n`);
    });
    process.exit(1);
  }
}

// Adjust the path as needed
auditRetryUsage(process.cwd());
