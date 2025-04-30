// /cursor/system-intel/loggers/emotionDriftJournal.ts

/**
 * Emotion Drift Journal
 * ---------------------
 * Tracks dream-state score changes across sessions to detect tone regression, 
 * emotional decay, or UX degradation over time.
 *
 * 🧠 Used by: self-awareness, audit-reporting, revision triggers, journaling.
 * 🔒 Enforces longitudinal tone integrity and evolutionary traceability.
 */

import fs from 'fs';
import path from 'path';

const logPath = path.resolve(__dirname, 'emotion-drift-log.json');

export interface EmotionDriftEntry {
  timestamp: string;
  sessionId: string;
  promptType: string;
  score: number;
  delta?: number;
  severity: 'none' | 'low' | 'medium' | 'high';
  notes?: string[];
}

export function loadEmotionDriftLog(): EmotionDriftEntry[] {
  if (!fs.existsSync(logPath)) return [];
  const raw = fs.readFileSync(logPath, 'utf-8');
  return JSON.parse(raw);
}

export function saveEmotionDriftLog(log: EmotionDriftEntry[]): void {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

export function logEmotionDrift(entry: EmotionDriftEntry): void {
  const log = loadEmotionDriftLog();

  // Automatically calculate delta vs last score
  const last = log.findLast(e => e.promptType === entry.promptType);
  if (last) {
    entry.delta = parseFloat((entry.score - last.score).toFixed(3));
    entry.severity =
      entry.delta < -0.3 ? 'high' :
      entry.delta < -0.2 ? 'medium' :
      entry.delta < -0.1 ? 'low' :
      'none';

    if (entry.severity !== 'none') {
      entry.notes = entry.notes || [];
      entry.notes.push('⚠️ Emotional regression detected.');
    }
  } else {
    entry.severity = 'none';
  }

  log.push(entry);
  saveEmotionDriftLog(log);
}

export function exportEmotionDriftMarkdown(): string {
  const log = loadEmotionDriftLog();
  if (log.length === 0) return '🟢 No emotional regression history logged yet.';

  const latest = log[log.length - 1];

  return `# 💔 Emotion Drift Journal

**Latest Entry — ${latest.timestamp}**  
**Prompt Type:** ${latest.promptType}  
**Dream-State Score:** ${latest.score}  
**Delta vs Last:** ${latest.delta ?? 'N/A'}  
**Severity:** ${latest.severity.toUpperCase()}

## 📝 Notes
${latest.notes?.map(n => `- ${n}`).join('\n') || 'None recorded.'}
`;
}
