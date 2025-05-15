/**
 * ci-checklist-verification.test.ts
 *
 * Purpose: Enforces Codex-level checklist by parsing /cursor/system-intel/checklist-enforcement-status.md.
 * Fails CI if any checklist item is 🟡 (partial) or ⛔️ (missing).
 * Outputs results to /cursor/logs/enforcement-check-output.json for audit and dashboard use.
 *
 * Codex v6.1.4 — Enforcement Backbone
 */

import * as fs from 'fs';
import * as path from 'path';

const CHECKLIST_PATH = path.join(__dirname, '../../system-intel/checklist-enforcement-status.md');
const OUTPUT_PATH = path.join(__dirname, '../../logs/enforcement-check-output.json');

interface ChecklistItemStatus {
  item: string;
  status: '✅' | '🟡' | '⛔️';
  line: number;
}

function parseChecklistStatus(md: string): ChecklistItemStatus[] {
  const lines = md.split('\n');
  const tableStart = lines.findIndex(l => l.includes('| Checklist Item'));
  const tableEnd = lines.findIndex((l, i) => i > tableStart && l.trim() === '|');
  const items: ChecklistItemStatus[] = [];
  for (let i = tableStart + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('---')) break;
    const cols = line.split('|').map(s => s.trim());
    if (cols.length < 3 || !cols[1]) continue;
    const item = cols[1];
    const status = cols[2] as '✅' | '🟡' | '⛔️';
    if (item && status) {
      items.push({ item, status, line: i + 1 });
    }
  }
  return items;
}

function main() {
  const md = fs.readFileSync(CHECKLIST_PATH, 'utf8');
  const items = parseChecklistStatus(md);
  let enforced = 0, partial = 0, missing = 0;
  const itemStatus: Record<string, any> = {};
  for (const entry of items) {
    if (entry.status === '✅') enforced++;
    else if (entry.status === '🟡') partial++;
    else if (entry.status === '⛔️') missing++;
    itemStatus[entry.item] = { status: entry.status, line: entry.line };
  }
  const status = (partial === 0 && missing === 0) ? 'ENFORCED' : 'BLOCKED';
  const output = {
    enforced,
    partial,
    missing,
    status,
    lastVerified: new Date().toISOString(),
    items: itemStatus
  };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  if (status !== 'ENFORCED') {
    // Fail the test/CI
    throw new Error(`Checklist enforcement incomplete: ${partial} partial, ${missing} missing.`);
  }
}

main(); 