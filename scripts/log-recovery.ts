// Log Recovery Script: Rebuilds missing log entries by scanning diffs, commits, and file metadata
// What/Why/How: Backfills auto-actions.log.md with retroactive entries

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { LogEntry } from '../log-utils';

const logPath = path.resolve('cursor/auto-actions.log.md');

function rebuildLogEntries(): void {
  const logEntries: LogEntry[] = [];
  const gitLog = execSync('git log --name-status --pretty=format:"%h %ad %s" --date=iso').toString();
  const lines = gitLog.split('\n');
  let currentEntry: Partial<LogEntry> = {};

  for (const line of lines) {
    if (line.startsWith('commit')) {
      if (Object.keys(currentEntry).length > 0) {
        logEntries.push(currentEntry as LogEntry);
      }
      currentEntry = {
        timestamp: new Date().toISOString(),
        phase: 'REBUILD',
        module: 'LogRecovery',
        action: 'Rebuilding log entries',
        outputPaths: [logPath],
        flags: ['REBUILD'],
        notes: `Rebuilt from commit: ${line.split(' ')[1]}`
      };
    }
  }

  if (Object.keys(currentEntry).length > 0) {
    logEntries.push(currentEntry as LogEntry);
  }

  const logContent = logEntries.map(entry => `## [${entry.timestamp}] ${entry.phase} (${entry.module})
- Action: ${entry.action}
- Output Paths: ${entry.outputPaths.join(', ')}
- Flags: ${entry.flags?.join(', ')}
- Notes: ${entry.notes}
`).join('\n');

  fs.appendFileSync(logPath, logContent);
  console.log('Log entries rebuilt and appended to auto-actions.log.md');
}

rebuildLogEntries(); 