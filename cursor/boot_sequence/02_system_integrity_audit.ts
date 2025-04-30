/**
 * 02_system_integrity_audit.ts
 * 
 * Purpose: Perform deep structural system audit on boot to guarantee operational stability.
 * Triggered: On startup, forced refresh, or pre-critical action plan deployment.
 * Enforces: Type safety, modular loadability, Codex memory integrity.
 */

import { validateSystemModules, validateTypesAndSchemas } from "../utils/modularity-utils";
import { checkCodexMemoryIntegrity } from "../codex/codex-memory-utils";
import { emitSystemLog } from "../system-intel/audit-utils";

interface SystemIntegrityAuditResult {
  passed: boolean;
  issues?: string[];
}

export async function runSystemIntegrityAudit(): Promise<SystemIntegrityAuditResult> {
  const moduleValidation = await validateSystemModules();
  const schemaValidation = await validateTypesAndSchemas();
  const codexMemoryValidation = await checkCodexMemoryIntegrity();

  const passed = moduleValidation.passed && schemaValidation.passed && codexMemoryValidation.passed;
  const issues = [
    ...moduleValidation.issues || [],
    ...schemaValidation.issues || [],
    ...codexMemoryValidation.issues || [],
  ];

  if (!passed) {
    emitSystemLog("system-integrity-failed", { issues });
  } else {
    emitSystemLog("system-integrity-passed", {});
  }

  return {
    passed,
    issues: passed ? undefined : issues,
  };
}
