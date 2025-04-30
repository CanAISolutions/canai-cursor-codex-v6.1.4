/**
 * @file heartbeat.ts
 * @description Heartbeat pulse emitter for system liveness monitoring.
 * 
 * Purpose:
 * - Provide lightweight ops-ready liveness detection.
 * - Enable real-time system monitoring independent of heavy selfchecks.
 */

let lastPulse = Date.now();
const DEFAULT_HEARTBEAT_THRESHOLD_MS = 10_000; // 10 seconds

export function pulseHeartbeat(): void {
  lastPulse = Date.now();
}

/**
 * Returns true if the system heartbeat is recent (within the threshold).
 */
export function isSystemAlive(thresholdMs: number = DEFAULT_HEARTBEAT_THRESHOLD_MS): boolean {
  return Date.now() - lastPulse <= thresholdMs;
}

/**
 * Returns timestamp of last pulse in ISO format.
 */
export function getLastPulseTimestamp(): string {
  return new Date(lastPulse).toISOString();
}
