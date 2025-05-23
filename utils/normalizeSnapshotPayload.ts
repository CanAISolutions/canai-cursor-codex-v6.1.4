/**
 * Snapshot Normalization Utility
 * 
 * What: Normalizes dynamic values in snapshot payloads for deterministic testing
 * Why: Prevents snapshot drift due to timestamps, UUIDs, and hashes
 * How: Replaces dynamic values with static test values while preserving structure
 * 
 * Codex v6.1.4 - DreamState Phase 2 Remediation
 */

export interface SnapshotPayload {
  timestamp?: string;
  sessionId?: string;
  traceId?: string;
  emotionIntentHash?: string;
  emotionalSnapshot?: string;
  [key: string]: any;
}

/**
 * Normalizes snapshot payload for deterministic testing
 * 
 * @param payload - The payload to normalize
 * @returns Normalized payload with static values
 */
export function normalizeSnapshotPayload(payload: SnapshotPayload): SnapshotPayload {
  const normalized = { ...payload };
  
  // Normalize top-level dynamic values
  if (normalized.timestamp) {
    normalized.timestamp = '2025-05-23T00:00:00.000Z';
  }
  
  if (normalized.sessionId) {
    normalized.sessionId = 'test-session-001';
  }
  
  if (normalized.traceId) {
    normalized.traceId = 'test-trace-001';
  }
  
  if (normalized.emotionIntentHash) {
    normalized.emotionIntentHash = 'static-hash-001';
  }
  
  // Normalize emotionalSnapshot JSON string
  if (normalized.emotionalSnapshot && typeof normalized.emotionalSnapshot === 'string') {
    try {
      const parsed = JSON.parse(normalized.emotionalSnapshot);
      
      // Normalize values within the JSON
      if (parsed.timestamp) {
        parsed.timestamp = '2025-05-23T00:00:00.000Z';
      }
      
      if (parsed.emotionIntentHash) {
        parsed.emotionIntentHash = 'static-hash-001';
      }
      
      // Re-stringify with normalized values
      normalized.emotionalSnapshot = JSON.stringify(parsed);
    } catch (error) {
      // If parsing fails, leave as-is
      console.warn('Failed to parse emotionalSnapshot for normalization:', error);
    }
  }
  
  return normalized;
}

/**
 * Normalizes an array of snapshot payloads
 * 
 * @param payloads - Array of payloads to normalize
 * @returns Array of normalized payloads
 */
export function normalizeSnapshotPayloads(payloads: SnapshotPayload[]): SnapshotPayload[] {
  return payloads.map(normalizeSnapshotPayload);
}

/**
 * Normalizes event-based payloads with nested data structures
 * 
 * @param events - Array of events with data payloads
 * @returns Array of normalized events
 */
export function normalizeEventPayloads(events: any[]): any[] {
  return events.map(event => {
    const normalized = { ...event };
    
    // Normalize event timestamp
    if (normalized.timestamp) {
      normalized.timestamp = 1640995200000; // Static timestamp: 2022-01-01T00:00:00.000Z
    }
    
    // Normalize data payload if present
    if (normalized.data) {
      normalized.data = normalizeSnapshotPayload(normalized.data);
    }
    
    return normalized;
  });
} 