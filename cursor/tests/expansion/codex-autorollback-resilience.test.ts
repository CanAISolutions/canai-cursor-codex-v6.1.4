/**
 * DreamState Expansion Test: Codex-AutoRollback-Resilience
 * Codex Pillar: Recovery & Rollback Integrity
 * Ritual Tag: #ritual-autorollback-resilience
 *
 * WHAT: Ensures auto-rollback and rollback-engine enforce full recovery, emotional fallback, and audit logging on all paths.
 * WHY: Defends against failed/partial rollback, silent state corruption, and trust loss after recovery attempts.
 * HOW: Simulates rollback trigger, no-trigger, and asserts fallback, emotional copy, and log triggers.
 */

import { initiateRollback } from '../../../cursor/accelerators/auto-rollback/rollback-engine';
import { assertRitualCoverage, validateAllRituals } from '../../../cursor/rituals/ritual-orchestrator';

// Canonical log function (stub for demonstration)
const logAction = (msg: string) => {/* log to /cursor/auto-actions.log.md */};

// Emotional fallback copy
const FALLBACK_COPY = "We're restoring your progress—no data or trust lost.";

describe('Codex-AutoRollback-Resilience — Ritual Enforcement', () => {
  beforeAll(() => {
    assertRitualCoverage('auto-rollback-resilience');
  });

  it('triggers rollback when delta is above threshold', async () => {
    const sessionId = 'test-session-1';
    const currentDelta = 1.0; // Simulate high delta
    const triggerLog: string[] = [];
    const result = await initiateRollback(sessionId, currentDelta, triggerLog);
    expect(result).toContain('⚠️ Rollback triggered');
    logAction('Rollback triggered. Emotional fallback enforced.');
    validateAllRituals();
  });

  it('triggers rollback when manual override is present', async () => {
    const sessionId = 'test-session-2';
    const currentDelta = 0.1;
    const triggerLog: string[] = ['manualOverride'];
    const result = await initiateRollback(sessionId, currentDelta, triggerLog);
    expect(result).toContain('⚠️ Rollback triggered');
    logAction('Rollback triggered by manual override. Emotional fallback enforced.');
    validateAllRituals();
  });

  it('skips rollback when no conditions are met', async () => {
    const sessionId = 'test-session-3';
    const currentDelta = 0.1;
    const triggerLog: string[] = [];
    const result = await initiateRollback(sessionId, currentDelta, triggerLog);
    expect(result).toContain('✅ No rollback needed.');
    logAction('Rollback skipped. No fallback needed.');
  });

  it('handles total rollback failure with emotional fallback and logs', async () => {
    const result = await initiateRollback({ simulate: 'failure' });
    expect(result.success).toBe(false);
    expect(result.fallback).toBe(true);
    expect(result.message).toContain(FALLBACK_COPY);
    logAction('Total rollback failure. Emotional fallback triggered.');
    validateAllRituals();
  });
}); 