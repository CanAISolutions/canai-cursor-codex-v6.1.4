// driftWatchdog.ts
import fs from 'fs';
import path from 'path';
import { EventBus } from '../event-bus/eventBus';

/**
 * DriftWatchdog — CI-Ready Drift Sentinel
 *
 * WHAT: Listens for contract, schema, and version change events on the event bus.
 * WHY: Ensures all drift is surfaced, logged, and testable for Codex observability and trust.
 * HOW: Emits all detected drift to /cursor/system-intel/drift-trace-log.json for CI and operator review.
 *
 * All modules must emit version/contract info on relevant changes. This is a living contract for drift immunity.
 */

const DRIFT_TRACE_LOG = path.resolve(__dirname, '../system-intel/drift-trace-log.json');

export async function startDriftWatchdog() {
  const eventBus = EventBus.getInstance();

  // Handler for contract, schema, and version change events
  const handleDriftEvent = async (event: any) => {
    const driftEntry = {
      event: event.event || 'unknown',
      data: event.data || event,
      timestamp: new Date().toISOString(),
    };
    // Append to drift trace log
    let log: any[] = [];
    try {
      if (fs.existsSync(DRIFT_TRACE_LOG)) {
        log = JSON.parse(fs.readFileSync(DRIFT_TRACE_LOG, 'utf-8'));
      }
    } catch (e) {
      log = [];
    }
    log.push(driftEntry);
    fs.writeFileSync(DRIFT_TRACE_LOG, JSON.stringify(log, null, 2));
  };

  // Listen for contract, schema, and version change events
  eventBus.on('contract.change', handleDriftEvent);
  eventBus.on('contract.compatibility.warning', handleDriftEvent);
  eventBus.on('schema.change', handleDriftEvent);
  eventBus.on('version.change', handleDriftEvent);

  // For CI: expose a way to clear the log
  return {
    clearLog: () => fs.writeFileSync(DRIFT_TRACE_LOG, '[]'),
    getLog: () => {
      if (fs.existsSync(DRIFT_TRACE_LOG)) {
        return JSON.parse(fs.readFileSync(DRIFT_TRACE_LOG, 'utf-8'));
      }
      return [];
    },
  };
}
