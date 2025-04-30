// /cursor/system-intel/folderContractValidator.ts

/**
 * Folder Contract Validator
 * -------------------------
 * Enforces Codex folder contracts across `/cursor/`.
 * Validates structure, required files, and naming conventions.
 *
 * 🧠 Ensures modularity integrity and test-readiness.
 * 🔐 Used in boot audits, CI guards, and snapshot verifications.
 */

import fs from 'fs';
import path from 'path';

type FolderContract = {
  requiredFiles: string[];
  allowExtra?: boolean;
};

const basePath = path.resolve(__dirname, '..'); // /cursor/

const contracts: Record<string, FolderContract> = {
  'agents': {
    requiredFiles: ['alignmentAuditor.ts', 'codexExpansionAgent.ts', 'emotionalIntegrityAgent.ts', 'modularityEnforcer.ts', 'opportunityRadar.ts'],
  },
  'boot_sequence': {
    requiredFiles: [
      '01_dreamstate_alignment.ts',
      '02_system_integrity_audit.ts',
      '03_emotional_consistency_check.ts',
      '04_modularity_snapshot.ts',
      '05_codex_upgrade_detector.ts',
      '06_cursor_selfcheck_trigger.ts',
      '07_strategic_recommendation_emitter.ts',
      '08_generate_action_plan_issues.ts',
      '09_generate_action_plan_opportunities.ts',
      '10_execute_action_plan.ts'
    ]
  },
  'self-awareness': {
    requiredFiles: ['deltaMapGenerator.ts', 'journalWriter.ts']
  },
  'system-intel': {
    requiredFiles: ['audit-utils.ts', 'codex-directives.md', 'codex-memory-utils.ts', 'context-injection-glossary.md', 'dreamstate-utils.ts', 'modularity-utils.ts'],
  }
  // Extend contracts as needed
};

type ValidationResult = {
  folder: string;
  status: 'valid' | 'invalid';
  missing: string[];
  extra: string[];
};

export function validateFolderContracts(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const [folderName, contract] of Object.entries(contracts)) {
    const folderPath = path.join(basePath, folderName);
    const existingFiles = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];

    const missing = contract.requiredFiles.filter(file => !existingFiles.includes(file));
    const extra = contract.allowExtra ? [] : existingFiles.filter(f => !contract.requiredFiles.includes(f));

    results.push({
      folder: folderName,
      status: missing.length === 0 && extra.length === 0 ? 'valid' : 'invalid',
      missing,
      extra,
    });
  }

  return results;
}

/**
 * Emits Markdown output for human-friendly inspection
 */
export function exportFolderValidationMarkdown(): string {
  const results = validateFolderContracts();

  return results
    .map(r => {
      const summary = `## 📁 ${r.folder.toUpperCase()} — ${r.status === 'valid' ? '✅ VALID' : '❌ INVALID'}`;
      const missingList = r.missing.length ? `\n**Missing:**\n${r.missing.map(m => `- ${m}`).join('\n')}` : '';
      const extraList = r.extra.length ? `\n**Unexpected:**\n${r.extra.map(e => `- ${e}`).join('\n')}` : '';
      return `${summary}${missingList}${extraList}`;
    })
    .join('\n\n');
}
