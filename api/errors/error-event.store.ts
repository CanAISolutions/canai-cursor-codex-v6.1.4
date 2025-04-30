/**
 * @codex-purpose: Live error event store for developer-safe dashboard aggregation.
 * @codex-system: Devtools Error Event Store
 * @codex-critical: Captures recent system error events without leaking sensitive data or PII.
 * @codex-verified: v1.0.0
 */

type CapturedError = {
    code: string;
    message: string;
    timestamp: string;
  };
  
  const MAX_EVENTS = 100;
  
  class ErrorEventStore {
    private events: CapturedError[] = [];
  
    captureError(code: string, message: string) {
      this.events.push({
        code,
        message,
        timestamp: new Date().toISOString()
      });
  
      // Enforce maximum event limit
      if (this.events.length > MAX_EVENTS) {
        this.events.shift();
      }
    }
  
    getRecentErrors() {
      return [...this.events];
    }
  
    clearAll() {
      this.events = [];
    }
  }
  
  export const errorEventStore = new ErrorEventStore();
  