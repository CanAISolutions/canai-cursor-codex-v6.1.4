/**
 * @file blast-mapper.ts
 * @description Codex Edition v4.1.3 – Bug Detection Agent.
 * Detects bug context from logs using AI provider with fallback to regex-based inference,
 * retry resilience, structured logging, and escalation logic.
 */

import { AIProvider, BugContext } from '../engines/ai-provider';
import { recordMetric } from '../utils/telemetry';
import { appendToFixContextAsync } from '../context/fix-context-utils';
import { pRetryWithTrace } from '../utils/pRetry';
import { DebugConfig } from '../config/config';

const MIN_CONTEXT_LENGTH = 10;
const MAX_LOG_LINES = 100; // Performance limit

// Canonical bug types
export enum BugType {
  NullPointer = 'NullPointer',
  ReferenceError = 'ReferenceError',
  TypeError = 'TypeError',
  RuntimeAccessError = 'RuntimeAccessError',
  Timeout = 'Timeout',
  SyntaxError = 'SyntaxError',
  Unknown = 'Unknown',
}

/**
 * Main bug detection entry point.
 * Tries AI bug classification with retries, fallback to regex, logs all steps.
 */
export async function detectBug(
  log: string,
  aiProvider: AIProvider,
  config: DebugConfig,
  traceId: string
): Promise<BugContext> {
  try {
    const bugContext = await pRetryWithTrace(
      () => aiProvider.detectBug(log, traceId),
      {
        retries: config.bugDetectionRetries ?? 3,
        onFailedAttempt: async (error, attempt) => {
          await appendToFixContextAsync(`[${traceId}] Bug detection retry #${attempt} failed: ${error.message}`);
          recordMetric('bug_detection_retry_failed', { traceId, attempt, error: error.message });
        },
      }
    );

    if (!isValidBugContext(bugContext)) {
      await appendToFixContextAsync(`[${traceId}] AI returned invalid bug context. Fallback initiated.`);
      recordMetric('bug_detection_invalid', { traceId });
      return inferBugContext(log);
    }

    recordMetric('bug_detected', { traceId, type: bugContext.type });
    return bugContext;
  } catch (err: any) {
    await appendToFixContextAsync(`[${traceId}] AI bug detection failed: ${err.message}`);
    recordMetric('bug_detection_failed', { traceId, error: err.message });

    if (err.name === 'AIProviderError') {
      try {
        await aiProvider.generateEscalationTicket({
          summary: `Persistent AI bug detection failure: ${err.message}`,
          priority: config.escalationPriority ?? 'high',
        });
        await appendToFixContextAsync(`[${traceId}] Escalated bug detection failure to ticketing system.`);
      } catch (ticketErr: any) {
        await appendToFixContextAsync(`[${traceId}] Failed to escalate: ${ticketErr.message}`);
      }
    }

    return inferBugContext(log);
  }
}

/**
 * Validates an AI-generated BugContext object for structural safety.
 */
function isValidBugContext(bugContext: BugContext): boolean {
  return (
    bugContext &&
    typeof bugContext.message === 'string' &&
    bugContext.message.length >= MIN_CONTEXT_LENGTH &&
    ['low', 'medium', 'high'].includes(bugContext.likelihood) &&
    typeof bugContext.type === 'string' &&
    Object.values(BugType).includes(bugContext.type as BugType) &&
    Array.isArray(bugContext.impact)
  );
}

/**
 * Regex-based fallback inference engine. Scans the log for known bug phrases,
 * extracts likely impacted files, and maps to a fallback BugType.
 */
export function inferBugContext(log: string): BugContext {
  const lines = log.split('\n').slice(0, MAX_LOG_LINES);
  const impactMatches = lines
    .map(line => line.match(/\(([^)]+):\d+:\d+\)/)?.[1])
    .filter((f): f is string => !!f)
    .filter((f, i, arr) => arr.indexOf(f) === i) // Dedup
    .slice(0, 5); // Limit surface

  const typeMap: Record<string, BugType> = {
    'null reference': BugType.NullPointer,
    'undefined': BugType.ReferenceError,
    'type error': BugType.TypeError,
    'cannot read': BugType.RuntimeAccessError,
    'timeout': BugType.Timeout,
    'syntax': BugType.SyntaxError,
  };

  const inferred = Object.keys(typeMap).find(k => log.toLowerCase().includes(k));
  const resolvedType = inferred ? typeMap[inferred] : BugType.Unknown;

  return {
    message: log.slice(0, 1000),
    type: resolvedType,
    impact: impactMatches,
    likelihood: 'medium',
    retryAttempts: 0,
  };
}
