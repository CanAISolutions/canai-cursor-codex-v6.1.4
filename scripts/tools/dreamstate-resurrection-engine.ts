#!/usr/bin/env ts-node

/**
 * dreamstate-resurrection-engine.ts
 *
 * WHAT: Codex-native resurrection engine for DreamState/system-wide test remediation.
 * WHY: Enables batch resurrection, pillar enforcement, plugin-driven remediation, and full auditability per Codex v6.1.4.
 * HOW: Modular, extensible, emotionally intelligent, operator-aligned.
 *
 * All logic blocks are commented with what/why/how per Codex doc style.
 */

import * as fs from 'fs';
import * as path from 'path';

// --- Type Schemas ---
// What: Per-test resurrection plan entry
export interface ResurrectionExecutionEntry {
  testFile: string;
  dependencies: string[];
  codexPillar: CodexPillar | null;
  pluginInjection: PluginInjection[];
  resurrectionGroup: string;
  brokenImports: string[];
  fallbackSuggestions: FallbackSuggestion[];
  manualPatchRequired: boolean;
  refactorStrategy: string;
  status: 'ready' | 'blocked' | 'manual';
  notes?: string;
}

// What: Plugin suggestions for test resurrection
export type PluginInjection =
  | { type: 'MockPlugin'; reason: string }
  | { type: 'SnapshotPlugin'; reason: string }
  | { type: 'EmotionAuditPlugin'; reason: string }
  | { type: 'FallbackImportPlugin'; reason: string }
  | { type: 'Other'; name: string; reason: string };

// What: Codex pillar mapping
export type CodexPillar =
  | 'Emotional UX Fidelity'
  | 'Trust'
  | 'Operational Resilience'
  | 'Fallback Resilience'
  | 'Inclusion'
  | 'Security';

// What: Fallback suggestion for a broken import
export interface FallbackSuggestion {
  brokenImport: string;
  fallbackModule: string | null;
  manualPatchRequired: boolean;
  rationale: string;
}

// --- Utility: Parse dependency table ---
// What: Parse the canonical markdown table into structured objects
// Why: Foundation for all downstream analysis
// How: Reads, parses, and normalizes dependency/test data
function parseDependencyTable(markdownPath: string) {
  const content = fs.readFileSync(markdownPath, 'utf-8');
  const lines = content.split('\n');
  const tableStart = lines.findIndex(l => l.startsWith('|'));
  if (tableStart === -1) return [];
  const tableLines = lines.slice(tableStart).filter(l => l.trim().startsWith('|'));
  if (tableLines.length < 2) return [];
  const rows = tableLines.slice(2).map(line => line.split('|').map(cell => cell.trim()));
  return rows.map(cells => ({
    dependency: cells[1] || '',
    frequency: cells[2] || '',
    testFiles: (cells[3] || '').split(',').map(f => f.trim()).filter(Boolean),
    role: cells[4] || '',
    status: cells[5] || '',
    usesMocking: /yes/i.test(cells[6] || ''),
    usesSnapshot: /yes/i.test(cells[7] || ''),
    usesEmotionAssertions: /yes/i.test(cells[8] || ''),
    refactorStrategy: cells[9] || '',
    notes: cells[10] || '',
  }));
}

// --- Utility: Infer Codex pillar ---
// What: Assign Codex pillar(s) to each test/dependency
// Why: Ensures every test defends a Codex value; flags gaps
// How: Uses a mapping of keywords/roles to pillars
const codexPillarMap: Record<string, CodexPillar> = {
  emotional: 'Emotional UX Fidelity',
  trust: 'Trust',
  resilience: 'Operational Resilience',
  fallback: 'Fallback Resilience',
  inclusion: 'Inclusion',
  security: 'Security',
};
function inferCodexPillar(row: any): CodexPillar | null {
  const role = row.role.toLowerCase();
  for (const key in codexPillarMap) {
    if (role.includes(key)) return codexPillarMap[key];
  }
  return null;
}

// --- Utility: Suggest plugin injections ---
// What: Recommend plugins for each test based on dependency/refactor needs
// Why: Enables automated or guided resurrection
// How: Maps behaviors (mock, snapshot, emotion, fallback) to plugins
function suggestPluginInjection(row: any): PluginInjection[] {
  const plugins: PluginInjection[] = [];
  if (row.usesMocking) plugins.push({ type: 'MockPlugin', reason: 'Test uses mocking' });
  if (row.usesSnapshot) plugins.push({ type: 'SnapshotPlugin', reason: 'Test uses snapshot' });
  if (row.usesEmotionAssertions) plugins.push({ type: 'EmotionAuditPlugin', reason: 'Test uses emotion assertions' });
  if (/broken|not_installed|missing_mapping/i.test(row.status)) plugins.push({ type: 'FallbackImportPlugin', reason: 'Dependency is broken or missing' });
  return plugins;
}

// --- Utility: Group by resurrection group ---
// What: Batch tests for parallel remediation
// Why: Optimizes execution and reporting
// How: Groups by primary dependency or pillar
function groupByResurrectionGroup(row: any, codexPillar: CodexPillar | null): string {
  if (codexPillar) return codexPillar;
  if (row.dependency) return row.dependency;
  return 'misc';
}

// --- Utility: Detect broken imports ---
// What: Find broken/missing dependencies for a test
// Why: Drives fallback suggestion and manual patch flag
// How: Checks status field for broken/missing
function detectBrokenImports(row: any): string[] {
  if (/broken|not_installed|missing_mapping/i.test(row.status)) return [row.dependency];
  return [];
}

// --- Utility: Suggest fallback for broken import ---
// What: Auto-suggest fallback modules for broken imports
// Why: Accelerates remediation, flags manual patches
// How: Looks up in fallback-import-map.json or flags as manual
function suggestFallbackForBrokenImport(brokenImport: string, fallbackMap: Record<string, string>): FallbackSuggestion {
  if (fallbackMap && fallbackMap[brokenImport]) {
    return {
      brokenImport,
      fallbackModule: fallbackMap[brokenImport],
      manualPatchRequired: false,
      rationale: 'Found in fallback-import-map.json',
    };
  }
  return {
    brokenImport,
    fallbackModule: null,
    manualPatchRequired: true,
    rationale: 'No fallback found; manual patch required',
  };
}

// --- Main Execution ---
(function main() {
  // What: Load dependency table and fallback map
  // Why: Foundation for resurrection plan
  // How: Read files, parse, fallback to empty map if not found
  const depTablePath = 'cursor/reports/Comprehensive Dependency Table with All Test Files.markdown';
  const fallbackMapPath = 'cursor/reports/fallback-import-map.json';
  const depRows = parseDependencyTable(depTablePath);
  let fallbackMap: Record<string, string> = {};
  try {
    fallbackMap = JSON.parse(fs.readFileSync(fallbackMapPath, 'utf-8'));
  } catch { /* fallback to empty map */ }

  // What: Build resurrection execution plan
  // Why: Enables batch, pillar-aligned remediation
  // How: For each test, infer pillar, plugins, group, fallbacks
  const executionPlan: ResurrectionExecutionEntry[] = [];
  for (const row of depRows) {
    for (const testFile of row.testFiles) {
      const codexPillar = inferCodexPillar(row);
      const pluginInjection = suggestPluginInjection(row);
      const resurrectionGroup = groupByResurrectionGroup(row, codexPillar);
      const brokenImports = detectBrokenImports(row);
      const fallbackSuggestions = brokenImports.map(broken =>
        suggestFallbackForBrokenImport(broken, fallbackMap)
      );
      const manualPatchRequired = fallbackSuggestions.some(f => f.manualPatchRequired);
      executionPlan.push({
        testFile,
        dependencies: [row.dependency],
        codexPillar,
        pluginInjection,
        resurrectionGroup,
        brokenImports,
        fallbackSuggestions,
        manualPatchRequired,
        refactorStrategy: row.refactorStrategy,
        status: manualPatchRequired ? 'manual' : 'ready',
        notes: row.notes,
      });
    }
  }

  // What: Generate pillar summary
  // Why: Operator/CI visibility, Codex audit
  // How: Aggregate group counts, plugin usage, broken import density
  const pillarCounts: Record<string, number> = {};
  const pluginCounts: Record<string, number> = {};
  let brokenImportCount = 0;
  for (const entry of executionPlan) {
    if (entry.codexPillar) pillarCounts[entry.codexPillar] = (pillarCounts[entry.codexPillar] || 0) + 1;
    for (const plugin of entry.pluginInjection) pluginCounts[plugin.type] = (pluginCounts[plugin.type] || 0) + 1;
    brokenImportCount += entry.brokenImports.length;
  }
  const pillarSummary = [
    '# DreamState Pillar Summary',
    '',
    '| Codex Pillar | Test Count |',
    '|--------------|------------|',
    ...Object.entries(pillarCounts).map(([pillar, count]) => `| ${pillar} | ${count} |`),
    '',
    '| Plugin | Usage Count |',
    '|--------|-------------|',
    ...Object.entries(pluginCounts).map(([plugin, count]) => `| ${plugin} | ${count} |`),
    '',
    `**Total Broken Imports:** ${brokenImportCount}`,
    '',
  ].join('\n');

  // What: Write reports
  // Why: Traceability, CI, operator review
  // How: Write JSON and markdown files
  fs.writeFileSync('cursor/reports/dreamstate-resurrection-execution-plan.json', JSON.stringify(executionPlan, null, 2));
  fs.writeFileSync('cursor/reports/dreamstate-pillar-summary.md', pillarSummary);

  // What: Log execution
  // Why: Audit trail, Codex enforcement
  // How: Append Codex Resurrection Phase VI – Engine Activation stamp
  const logPath = 'cursor/auto-actions.log.md';
  const now = new Date().toISOString();
  const logEntry = [
    `### [${now}] Codex Resurrection Phase VI – Engine Activation`,
    '- **Action**: DreamState Resurrection Engine executed. Reports generated.',
    '- **Why**: Batch remediation, pillar enforcement, plugin-driven resurrection, Codex v6.1.4 compliance.',
    '- **How**: See `/cursor/reports/dreamstate-resurrection-execution-plan.json` and `/cursor/reports/dreamstate-pillar-summary.md`.',
    '- **Codex Enforcement**: All future resurrection actions must reference this execution plan. Escalate any manualPatchRequired to Cofounder.',
    '',
  ].join('\n');
  fs.appendFileSync(logPath, logEntry + '\n');

  // What: Operator output
  // Why: Confirm successful execution
  // How: Print emotionally intelligent, Codex-aligned message
  console.log('✅ DreamState Resurrection Engine complete. Reports and log updated. Ready for Polaris Ritual Phase.');
})(); 