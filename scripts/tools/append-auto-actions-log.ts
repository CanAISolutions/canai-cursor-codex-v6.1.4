#!/usr/bin/env ts-node
/**
 * WHAT: Sustainable, Codex-compliant log appender for auto-actions.log.md
 * WHY: Ensures every log entry is retained, never overwritten, and always auditable—even with frequent archiving.
 * HOW: Backs up the log, appends new entries above ## Summary, and supports CLI usage.
 */
import * as fs from 'fs';
import * as path from 'path';

const LOG_PATH = path.join('cursor', 'auto-actions.log.md');
const BACKUP_DIR = path.join('cursor');

function printHelp() {
  console.log(`\nUsage: append-auto-actions-log.ts --entry "Your log entry in markdown" [--log path/to/log.md]\n\nOptions:\n  --entry   The markdown log entry to append (required)\n  --log     Path to log file (default: cursor/auto-actions.log.md)\n  --help    Show this help message\n`);
}

/**
 * Create a timestamped backup of the log file before any write.
 */
function backupLogFile(logPath: string) {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const backupPath = path.join(BACKUP_DIR, `auto-actions.log.backup.${timestamp}.md`);
  fs.copyFileSync(logPath, backupPath);
  return backupPath;
}

/**
 * Insert the new log entry above the ## Summary section.
 * If ## Summary is not found, append to the end.
 */
function insertLogEntry(logContent: string, entry: string): string {
  const summaryIdx = logContent.indexOf('\n## Summary');
  if (summaryIdx !== -1) {
    // Insert before ## Summary
    return logContent.slice(0, summaryIdx) + '\n' + entry.trim() + '\n' + logContent.slice(summaryIdx);
  } else {
    // Append to end
    return logContent.trim() + '\n' + entry.trim() + '\n';
  }
}

/**
 * Main CLI logic: parse args, backup, insert, and write.
 */
function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
  }
  const entryIdx = args.indexOf('--entry');
  if (entryIdx === -1 || !args[entryIdx + 1]) {
    console.error('Error: --entry argument is required.');
    printHelp();
    process.exit(1);
  }
  const entry = args[entryIdx + 1];
  const logIdx = args.indexOf('--log');
  const logPath = logIdx !== -1 && args[logIdx + 1] ? args[logIdx + 1] : LOG_PATH;
  if (!fs.existsSync(logPath)) {
    console.error(`Error: Log file not found at ${logPath}`);
    process.exit(1);
  }
  // Backup
  const backupPath = backupLogFile(logPath);
  // Read, insert, and write
  const logContent = fs.readFileSync(logPath, 'utf8');
  const newContent = insertLogEntry(logContent, entry);
  fs.writeFileSync(logPath, newContent, 'utf8');
  console.log(`Log entry appended. Backup created at: ${backupPath}`);
}

if (require.main === module) {
  main();
} 