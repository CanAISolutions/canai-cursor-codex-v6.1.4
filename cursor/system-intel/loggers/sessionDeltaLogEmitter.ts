// /cursor/system-intel/loggers/sessionDeltaLogEmitter.ts

/**
 * Session Delta Log Emitter
 * --------------------------
 * Logs per-session deltas in emotional score, modular validation, and Codex state.
 * Used to trace system behavior, track prompt evolution, and surface regression or upgrade triggers.
 *
 * 🧠 Feeds: journaling, DeltaMap visualization, self-healing systems.
 * 📦 Format: append-only JSON log. Markdown export for audits.
 */

import fs from 'fs';
import path from 'path';

const deltaLogPath = path.resolve(__dirname, 'session-delta-log.json');

export interface SessionDeltaEntry {
  sessionId: string;
  timestamp: string;
  promptType: string;
  inputSummary: string;
  outputHash: string;
  dreamStateScore: number;
  modularityWarnings: string[];
  codexVersion: string;
  notes?: string[];
}

export function loadSessionDeltaLog(): SessionDeltaEntry[] {
  if (!fs.existsSync(deltaLogPath)) return [];
  return JSON.parse(fs.readFileSync(deltaLogPath, 'utf-8'));
}

export function saveSessionDeltaLog(entries: SessionDeltaEntry[]): void {
  fs.writeFileSync(deltaLogPath, JSON.stringify(entries, null, 2));
}

export function emitSessionDelta(entry: SessionDeltaEntry): void {
  const log = loadSessionDeltaLog();
  log.push(entry);
  saveSessionDeltaLog(log);
}

export function exportLatestSessionMarkdown(): string {
  const log = loadSessionDeltaLog();
  if (log.length === 0) return '🟢 No session deltas recorded.';

  const latest = log[log.length - 1];

  return `# 🧾 Latest Session Delta

**Timestamp:** ${latest.timestamp}  
**Session ID:** ${latest.sessionId}  
**Prompt Type:** ${latest.promptType}  
**Dream-State Score:** ${latest.dreamStateScore}  
**Output Hash:** \`${latest.outputHash}\`  
**Codex Version:** ${latest.codexVersion}

## 🧠 Input Summary
${latest.inputSummary}

## ⚠️ Modularity Warnings
${latest.modularityWarnings.length > 0
    ? latest.modularityWarnings.map(w => `- ${w}`).join('\n')
    : '✅ No modular violations detected.'}

## 📝 Notes
${latest.notes?.map(n => `- ${n}`).join('\n') || 'None'}
`;
}
