/**
 * deltaMapGenerator.ts
 * 
 * Purpose: Generate delta maps that capture changes over time in emotional state, modular loadout, and Codex directive alignment.
 * Triggered: On scheduled intervals, after major events, or upon self-check audits.
 * Enforces: System self-awareness, evolutionary foresight, predictive drift detection.
 */

import fs from 'fs';
import path from 'path';
import { readSelfAwarenessJournal } from "./selfAwarenessJournal";
import { calculateDreamAlignmentScore } from "../utils/dreamstate-utils";
import { introspectModules } from "../utils/modularity-utils";
import { fetchCanonicalCodexDirectives } from "../codex/codex-memory-utils";

export interface DeltaRecord {
  timestamp: number;
  dimension: "emotional" | "modular" | "codex";
  deltaType: "emotional-drift" | "modular-shift" | "codex-evolution";
  oldState: any;
  newState: any;
}

// --- Primary delta generator ---
export async function generateDeltaMap(): Promise<DeltaRecord[]> {
  const journal = await readSelfAwarenessJournal();
  const deltas: DeltaRecord[] = [];

  const currentEmotional = await calculateDreamAlignmentScore();
  if (currentEmotional.score !== journal.lastEmotionalScore) {
    deltas.push({
      timestamp: Date.now(),
      dimension: "emotional",
      deltaType: "emotional-drift",
      oldState: journal.lastEmotionalScore,
      newState: currentEmotional.score,
    });
  }

  const currentModules = await introspectModules();
  if (JSON.stringify(currentModules) !== JSON.stringify(journal.lastModularSnapshot)) {
    deltas.push({
      timestamp: Date.now(),
      dimension: "modular",
      deltaType: "modular-shift",
      oldState: journal.lastModularSnapshot,
      newState: currentModules,
    });
  }

  const currentCodex = await fetchCanonicalCodexDirectives();
  if (currentCodex.version !== journal.lastCodexVersion) {
    deltas.push({
      timestamp: Date.now(),
      dimension: "codex",
      deltaType: "codex-evolution",
      oldState: journal.lastCodexVersion,
      newState: currentCodex.version,
    });
  }

  return deltas;
}

// --- Delta Markdown exporter ---
export function exportDeltaMapMarkdown(deltas: DeltaRecord[]): string {
  if (deltas.length === 0) {
    return '🟢 No deltas detected. System steady.';
  }

  return `# 📈 Delta Map Snapshot

${deltas.map(d => `
## 🧠 ${d.dimension.toUpperCase()} Change

- **Timestamp:** ${new Date(d.timestamp).toISOString()}
- **Delta Type:** ${d.deltaType}
- **Old State:** ${JSON.stringify(d.oldState)}
- **New State:** ${JSON.stringify(d.newState)}
`).join('\n')}
`;
}

// --- Delta journal logger ---
const deltaLogPath = path.resolve(__dirname, '../system-intel/loggers/delta-map-log.json');

export function loadDeltaMapLog(): DeltaRecord[] {
  if (!fs.existsSync(deltaLogPath)) return [];
  return JSON.parse(fs.readFileSync(deltaLogPath, 'utf-8'));
}

export function saveDeltaMapLog(log: DeltaRecord[]): void {
  fs.writeFileSync(deltaLogPath, JSON.stringify(log, null, 2));
}

export function logDeltaRecords(deltas: DeltaRecord[]): void {
  const existing = loadDeltaMapLog();
  const combined = [...existing, ...deltas];
  saveDeltaMapLog(combined);
}
