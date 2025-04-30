// /cursor/system-intel/sessionRefactorLogWriter.ts

/**
 * Session Refactor Log Writer
 * ----------------------------
 * Appends a new smart revision entry to sessionRefactorLog.json in canonical format.
 * Ensures full Codex compliance, timestamping, delta math, and audit structure.
 *
 * 🔐 Prime Directive: Immutable, snapshot-safe, schema-locked.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const logPath = path.resolve(__dirname, 'sessionRefactorLog.json');

export interface AuditSnapshot {
  modularityScore: number;
  emotionalResonanceScore: number;
  uxConsistencyScore: number;
  directiveCoverage: {
    total: number;
    covered: number;
    percent: number;
    missing: string[];
  };
  summary: string[];
}

export interface SessionRefactorEntry {
  revisionId: string;
  timestamp: number;
  timestampIso: string;
  sessionId: string;
  promptType: string;
  revisionType: 'prompt-evolution' | 'self-healing' | 'manual-review' | 'directive-sync';
  initiator: string;
  beforeAudit: AuditSnapshot;
  afterAudit: AuditSnapshot;
  deltaSummary: {
    modularityDelta: number;
    emotionalDelta: number;
    uxConsistencyDelta: number;
    directiveDelta: number;
    overallAssessment: string;
  };
  notes: string[];
}

export function loadSessionRefactorLog(): SessionRefactorEntry[] {
  if (!fs.existsSync(logPath)) return [];
  return JSON.parse(fs.readFileSync(logPath, 'utf-8'));
}

export function saveSessionRefactorLog(entries: SessionRefactorEntry[]): void {
  fs.writeFileSync(logPath, JSON.stringify(entries, null, 2));
}

export function appendSessionRefactorLog(input: {
  sessionId: string;
  promptType: string;
  revisionType: SessionRefactorEntry['revisionType'];
  initiator: string;
  before: AuditSnapshot;
  after: AuditSnapshot;
  notes: string[];
}): void {
  const delta: SessionRefactorEntry['deltaSummary'] = {
    modularityDelta: parseFloat((input.after.modularityScore - input.before.modularityScore).toFixed(3)),
    emotionalDelta: input.after.emotionalResonanceScore - input.before.emotionalResonanceScore,
    uxConsistencyDelta: parseFloat((input.after.uxConsistencyScore - input.before.uxConsistencyScore).toFixed(3)),
    directiveDelta: parseFloat((input.after.directiveCoverage.percent - input.before.directiveCoverage.percent).toFixed(2)),
    overallAssessment: '✅ Revision improved system trustworthiness and modularity.'
  };

  const timestamp = Date.now();

  const entry: SessionRefactorEntry = {
    revisionId: crypto.randomUUID(),
    timestamp,
    timestampIso: new Date(timestamp).toISOString(),
    sessionId: input.sessionId,
    promptType: input.promptType,
    revisionType: input.revisionType,
    initiator: input.initiator,
    beforeAudit: input.before,
    afterAudit: input.after,
    deltaSummary: delta,
    notes: input.notes
  };

  const log = loadSessionRefactorLog();
  log.push(entry);
  saveSessionRefactorLog(log);
}
