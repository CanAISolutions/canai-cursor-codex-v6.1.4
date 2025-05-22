/*
WHAT: Placeholder for error-event.store module required by error-event-capture and related tests.
WHY: Unblocks import errors and test execution. Ensures Codex audit and emotional continuity standards.
HOW: Exports a minimal errorEventStore object with fallback logic and clear TODOs.
*/

/**
 * In-memory error event store (placeholder implementation).
 * WHAT: Minimal stub for test and import resolution.
 * WHY: Prevents silent failures and enables test suite to run.
 * HOW: Provides a safe default array and methods for test continuity.
 */
export const errorEventStore = {
  events: [] as any[], // Accepts any event type for maximum compatibility (Codex fallback)
  push(event: unknown) {
    // TODO: Implement actual event storage logic (Phase 2.8.6)
    // Fallback: Push to in-memory array
    (this.events as any[]).push(event);
  },
  getAll() {
    // Fallback: Return all stored events
    return this.events;
  },
  clearAll() {
    // WHAT: Clears all stored error events.
    // WHY: Required for test isolation and Codex auditability.
    // HOW: Empties the in-memory events array.
    this.events = [];
  },
  getRecentErrors(count: number = 10) {
    // WHAT: Returns the most recent error events, up to 'count'.
    // WHY: Enables targeted test assertions and Codex-aligned diagnostics.
    // HOW: Returns the last N events from the in-memory array.
    return this.events.slice(-count);
  },
  captureError(code: string, message: string) {
    // WHAT: Captures a structured error event with code, message, and timestamp.
    // WHY: Required for middleware and devtools dashboard observability.
    // HOW: Pushes a structured event to the in-memory events array.
    const event = {
      code,
      message,
      timestamp: new Date().toISOString()
    };
    this.events.push(event);
  }
}; 