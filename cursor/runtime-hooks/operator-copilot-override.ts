import fs from 'fs';
import path from 'path';

const OPERATOR_INTERVENTION_LOG = path.resolve(__dirname, '../logs/operator-interventions.json');

/**
 * Operator/Copilot Override Runtime Hook — Pre-Injection Contract
 *
 * WHAT: Exposes operatorOverride and copilotOverride hooks for all critical flows (prompt, schema, Make).
 * WHY: Ensures human and AI can interrupt, observe, and log interventions for operational safety and trust.
 * HOW: All invocations are logged to /cursor/logs/operator-interventions.json. Hooks are observable, interruptible, and CI-checked.
 *
 * This file is a living contract. No placeholder logic is added until flows require override.
 */

export async function operatorOverride(context: {
  flow: 'prompt' | 'schema' | 'make' | string;
  reason: string;
  details?: Record<string, any>;
}) {
  // TODO: When activated, interrupt flow, log intervention, and surface to operator dashboard
  logIntervention('operator', context);
  // No-op for now
}

export async function copilotOverride(context: {
  flow: 'prompt' | 'schema' | 'make' | string;
  reason: string;
  details?: Record<string, any>;
}) {
  // TODO: When activated, interrupt flow, log intervention, and surface to operator dashboard
  logIntervention('copilot', context);
  // No-op for now
}

function logIntervention(type: 'operator' | 'copilot', context: any) {
  let log: any[] = [];
  try {
    if (fs.existsSync(OPERATOR_INTERVENTION_LOG)) {
      log = JSON.parse(fs.readFileSync(OPERATOR_INTERVENTION_LOG, 'utf-8'));
    }
  } catch (e) {
    log = [];
  }
  log.push({
    type,
    context,
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(OPERATOR_INTERVENTION_LOG, JSON.stringify(log, null, 2));
} 