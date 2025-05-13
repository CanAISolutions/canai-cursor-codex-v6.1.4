/**
 * tactical_recovery_generator.ts
 * What: Tactical recovery logic for failure-capture layer
 * Why: Enables 1 retry per unique error, manual override, and root-cause tagging
 * How: Emits recovery events, logs all actions, and supports Codex audit
 * Phase: 2.8.8
 */

import { EventBus } from '../event-bus/eventBus';

// In-memory retry tracker (reset on process restart)
const retryTracker: Record<string, number> = {};

export interface RecoveryContext {
  originModule: string;
  error: Error;
  extra?: Record<string, unknown>;
}

export type RecoveryOutcome = 'success' | 'manual' | 'fail';

/**
 * Attempt tactical recovery for a captured failure
 * @param fingerprint Unique error fingerprint (string)
 * @param context RecoveryContext
 * @returns RecoveryOutcome
 */
export async function attemptTacticalRecovery(
  fingerprint: string,
  context: RecoveryContext
): Promise<RecoveryOutcome> {
  const eventBus = EventBus.getInstance();
  const originModule = context.originModule;
  let recoveryAttempted = false;
  let recoveryOutcome: RecoveryOutcome = 'fail';

  // Retry logic: allow 1 retry per unique fingerprint
  if (!retryTracker[fingerprint]) {
    retryTracker[fingerprint] = 1;
    recoveryAttempted = true;
    eventBus.emit('recovery:retry', { fingerprint, context });
    recoveryOutcome = 'success';
    logRecoveryPath({ fingerprint, originModule, recoveryAttempted, recoveryOutcome });
    return 'success';
  }

  // Manual override stub if retry fails (allow only 1 manual override per fingerprint)
  if (retryTracker[fingerprint] === 1) {
    retryTracker[fingerprint] = 2;
    eventBus.emit('recovery:manual-required', { fingerprint, context });
    recoveryAttempted = true;
    recoveryOutcome = 'manual';
    await logManualOverride({ fingerprint, originModule, context });
    logRecoveryPath({ fingerprint, originModule, recoveryAttempted, recoveryOutcome });
    return 'manual';
  }

  // Fail-closure: all recovery paths exhausted
  eventBus.emit('recovery:fail-closure', { fingerprint, context });
  recoveryAttempted = true;
  recoveryOutcome = 'fail';
  await logFailClosure({ fingerprint, originModule, context });
  logRecoveryPath({ fingerprint, originModule, recoveryAttempted, recoveryOutcome });
  return 'fail';
}

/**
 * Log recovery path to auto-actions.log.md
 */
function logRecoveryPath({ fingerprint, originModule, recoveryAttempted, recoveryOutcome }: {
  fingerprint: string;
  originModule: string;
  recoveryAttempted: boolean;
  recoveryOutcome: RecoveryOutcome;
}) {
  const fs = require('fs');
  const logEntry = `\n[${new Date().toISOString()}] TacticalRecovery: { "fingerprint": "${fingerprint}", "originModule": "${originModule}", "recoveryAttempted": ${recoveryAttempted}, "recoveryOutcome": "${recoveryOutcome}" }`;
  fs.appendFileSync('cursor/auto-actions.log.md', logEntry);
}

/**
 * Log manual override requirement to recovery-deferred.log.md
 */
async function logManualOverride({ fingerprint, originModule, context }: {
  fingerprint: string;
  originModule: string;
  context: RecoveryContext;
}) {
  const fs = require('fs');
  const logEntry = `\n[${new Date().toISOString()}] ManualOverrideRequired: { "fingerprint": "${fingerprint}", "originModule": "${originModule}", "error": "${context.error.message}" }`;
  fs.appendFileSync('cursor/system-intel/recovery-deferred.log.md', logEntry);
}

/**
 * Log fail-closure event to both auto-actions.log.md and recovery-deferred.log.md
 */
async function logFailClosure({ fingerprint, originModule, context }: {
  fingerprint: string;
  originModule: string;
  context: RecoveryContext;
}) {
  const fs = require('fs');
  const logEntry = `\n[${new Date().toISOString()}] FailClosure: { "fingerprint": "${fingerprint}", "originModule": "${originModule}", "error": "${context.error.message}" }`;
  fs.appendFileSync('cursor/auto-actions.log.md', logEntry);
  fs.appendFileSync('cursor/system-intel/recovery-deferred.log.md', logEntry);
}
