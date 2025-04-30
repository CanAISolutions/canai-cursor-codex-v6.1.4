/**
 * codex-memory-utils.ts
 * 
 * Purpose: Track loaded Codex directives, check system coverage, and expose version-aligned Codex memory.
 * Used by agents, auditors, and revision systems to ensure enforcement fidelity.
 */

import { readFileSync } from "fs";

const CODEX_VERSION = "v6.1.4";
const DIRECTIVES_PATH = "./cursor/system-intel/codex-directives.md";

export interface CodexDirective {
  id: string;
  description: string;
  required: boolean;
}

export interface DirectiveCoverageReport {
  total: number;
  covered: number;
  percent: number;
  missing: string[];
}

export function getCodexVersion(): string {
  return CODEX_VERSION;
}

export function loadCodexDirectives(): CodexDirective[] {
  const content = readFileSync(DIRECTIVES_PATH, "utf-8");
  const lines = content.split("\n").filter(l => l.startsWith("- ["));
  return lines.map((line, idx) => ({
    id: `D-${idx + 1}`,
    description: line.replace(/- \[.\]\s*/, "").trim(),
    required: true,
  }));
}

export function checkDirectiveCoverage(systemSnapshot: string): DirectiveCoverageReport {
  const directives = loadCodexDirectives();
  const covered = directives.filter(d => systemSnapshot.includes(d.description));
  const missing = directives
    .filter(d => !systemSnapshot.includes(d.description))
    .map(d => d.id);

  return {
    total: directives.length,
    covered: covered.length,
    percent: (covered.length / directives.length) * 100,
    missing,
  };
}
