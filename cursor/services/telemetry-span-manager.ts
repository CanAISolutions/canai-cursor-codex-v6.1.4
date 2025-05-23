/**
 * @file cursor/services/telemetry-span-manager.ts
 * @description TelemetrySpanManager for OpenTelemetry span continuity and gap detection
 * @version 6.1.4
 * @pillar Observability Integrity
 */

import { EventBus } from '../event-bus/eventBus';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentId?: string;
  step: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TelemetrySpan {
  context: SpanContext;
  operation: string;
  status: 'active' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  tags: Record<string, any>;
  logs: SpanLog[];
  children: string[];
  trustScoreAttribution?: TrustScoreAttribution;
}

export interface SpanLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, any>;
}

export interface TrustScoreAttribution {
  stepId: string;
  beforeScore: number;
  afterScore: number;
  delta: number;
  reason: string;
  timestamp: string;
}

export interface SpanGap {
  expectedParentId: string;
  missingSpanId: string;
  detectedAt: string;
  gapType: 'missing_parent' | 'broken_chain' | 'orphaned_span';
  recoveryAction?: string;
}

export interface SessionTrace {
  rootSpanId: string;
  traceId: string;
  sessionId: string;
  spans: Map<string, TelemetrySpan>;
  gaps: SpanGap[];
  startTime: string;
  endTime?: string;
  isComplete: boolean;
}

export class TelemetrySpanManager {
  private static instance: TelemetrySpanManager;
  private eventBus: EventBus;
  private activeSessions: Map<string, SessionTrace>;
  private spanRegistry: Map<string, TelemetrySpan>;

  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.activeSessions = new Map();
    this.spanRegistry = new Map();
    this.initializeEventListeners();
  }

  public static getInstance(): TelemetrySpanManager {
    if (!TelemetrySpanManager.instance) {
      TelemetrySpanManager.instance = new TelemetrySpanManager();
    }
    return TelemetrySpanManager.instance;
  }

  private initializeEventListeners(): void {
    this.eventBus.on('span:created', this.handleSpanCreated.bind(this));
    this.eventBus.on('span:completed', this.handleSpanCompleted.bind(this));
    this.eventBus.on('span:failed', this.handleSpanFailed.bind(this));
    this.eventBus.on('trustscore:updated', this.handleTrustScoreUpdate.bind(this));
  }

  /**
   * Creates a new root span for a session
   */
  public createRootSpan(sessionId: string, operation: string, metadata: Record<string, any> = {}): TelemetrySpan {
    const traceId = uuidv4();
    const spanId = uuidv4();
    const timestamp = new Date().toISOString();

    const context: SpanContext = {
      traceId,
      spanId,
      step: 'root',
      timestamp,
      metadata
    };

    const span: TelemetrySpan = {
      context,
      operation,
      status: 'active',
      startTime: timestamp,
      tags: { sessionId, isRoot: true },
      logs: [],
      children: []
    };

    // Create session trace
    const sessionTrace: SessionTrace = {
      rootSpanId: spanId,
      traceId,
      sessionId,
      spans: new Map([[spanId, span]]),
      gaps: [],
      startTime: timestamp,
      isComplete: false
    };

    this.activeSessions.set(sessionId, sessionTrace);
    this.spanRegistry.set(spanId, span);

    this.eventBus.emit('span:created', { span, sessionId });

    return span;
  }

  /**
   * Creates a child span linked to a parent
   */
  public createChildSpan(
    parentSpanId: string,
    operation: string,
    step: string,
    metadata: Record<string, any> = {}
  ): TelemetrySpan {
    const parentSpan = this.spanRegistry.get(parentSpanId);
    if (!parentSpan) {
      throw new Error(`Parent span ${parentSpanId} not found`);
    }

    const spanId = uuidv4();
    const timestamp = new Date().toISOString();

    const context: SpanContext = {
      traceId: parentSpan.context.traceId,
      spanId,
      parentId: parentSpanId,
      step,
      timestamp,
      metadata
    };

    const span: TelemetrySpan = {
      context,
      operation,
      status: 'active',
      startTime: timestamp,
      tags: { parentId: parentSpanId },
      logs: [],
      children: []
    };

    // Link to parent
    parentSpan.children.push(spanId);

    // Add to session trace
    const sessionTrace = this.findSessionByTraceId(parentSpan.context.traceId);
    if (sessionTrace) {
      sessionTrace.spans.set(spanId, span);
    }

    this.spanRegistry.set(spanId, span);
    this.eventBus.emit('span:created', { span, parentSpanId });

    return span;
  }

  /**
   * Validates span continuity and detects gaps
   */
  public validateSpanContinuity(sessionId: string): { isValid: boolean; gaps: SpanGap[] } {
    const sessionTrace = this.activeSessions.get(sessionId);
    if (!sessionTrace) {
      return { isValid: false, gaps: [{ 
        expectedParentId: 'unknown',
        missingSpanId: 'session',
        detectedAt: new Date().toISOString(),
        gapType: 'missing_parent'
      }] };
    }

    const gaps: SpanGap[] = [];
    const spans = Array.from(sessionTrace.spans.values());

    // Check for orphaned spans (spans with parentId that doesn't exist)
    for (const span of spans) {
      if (span.context.parentId && !sessionTrace.spans.has(span.context.parentId)) {
        gaps.push({
          expectedParentId: span.context.parentId,
          missingSpanId: span.context.spanId,
          detectedAt: new Date().toISOString(),
          gapType: 'missing_parent'
        });
      }
    }

    // Check for broken chains (parent-child relationships that don't match)
    for (const span of spans) {
      for (const childId of span.children) {
        const child = sessionTrace.spans.get(childId);
        if (!child || child.context.parentId !== span.context.spanId) {
          gaps.push({
            expectedParentId: span.context.spanId,
            missingSpanId: childId,
            detectedAt: new Date().toISOString(),
            gapType: 'broken_chain'
          });
        }
      }
    }

    sessionTrace.gaps = gaps;
    return { isValid: gaps.length === 0, gaps };
  }

  /**
   * Applies recovery logic for detected span gaps
   */
  public applySpanRecovery(sessionId: string, gap: SpanGap): TelemetrySpan | null {
    const sessionTrace = this.activeSessions.get(sessionId);
    if (!sessionTrace) {
      return null;
    }

    switch (gap.gapType) {
      case 'missing_parent':
        return this.createRecoverySpan(sessionTrace, gap);
      case 'broken_chain':
        return this.repairBrokenChain(sessionTrace, gap);
      case 'orphaned_span':
        return this.adoptOrphanedSpan(sessionTrace, gap);
      default:
        return null;
    }
  }

  /**
   * Logs trust score attribution to a span
   */
  public attributeTrustScore(
    spanId: string,
    beforeScore: number,
    afterScore: number,
    reason: string
  ): void {
    const span = this.spanRegistry.get(spanId);
    if (!span) {
      return;
    }

    const attribution: TrustScoreAttribution = {
      stepId: span.context.step,
      beforeScore,
      afterScore,
      delta: afterScore - beforeScore,
      reason,
      timestamp: new Date().toISOString()
    };

    span.trustScoreAttribution = attribution;

    this.eventBus.emit('trustscore:attributed', {
      spanId,
      attribution,
      traceId: span.context.traceId
    });
  }

  /**
   * Completes a span
   */
  public completeSpan(spanId: string): void {
    const span = this.spanRegistry.get(spanId);
    if (!span) {
      return;
    }

    span.status = 'completed';
    span.endTime = new Date().toISOString();

    this.eventBus.emit('span:completed', { span });
  }

  /**
   * Marks a span as failed
   */
  public failSpan(spanId: string, error: string): void {
    const span = this.spanRegistry.get(spanId);
    if (!span) {
      return;
    }

    span.status = 'failed';
    span.endTime = new Date().toISOString();
    span.logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error
    });

    this.eventBus.emit('span:failed', { span, error });
  }

  /**
   * Gets the complete trace for a session
   */
  public getSessionTrace(sessionId: string): SessionTrace | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Replays a trace from span logs
   */
  public replayTrace(traceId: string): TelemetrySpan[] {
    const spans: TelemetrySpan[] = [];
    
    for (const span of this.spanRegistry.values()) {
      if (span.context.traceId === traceId) {
        spans.push(span);
      }
    }

    // Sort by start time for chronological replay
    return spans.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  /**
   * Injects a partial span (for testing gap detection)
   */
  public injectPartialSpan(
    traceId: string,
    operation: string,
    missingParentId: string
  ): TelemetrySpan {
    const spanId = uuidv4();
    const timestamp = new Date().toISOString();

    const context: SpanContext = {
      traceId,
      spanId,
      parentId: missingParentId, // This parent doesn't exist
      step: 'injected',
      timestamp
    };

    const span: TelemetrySpan = {
      context,
      operation,
      status: 'active',
      startTime: timestamp,
      tags: { injected: true },
      logs: [],
      children: []
    };

    this.spanRegistry.set(spanId, span);
    return span;
  }

  // Private helper methods

  private async handleSpanCreated(event: any): Promise<void> {
    // Handle span creation events
  }

  private async handleSpanCompleted(event: any): Promise<void> {
    // Handle span completion events
  }

  private async handleSpanFailed(event: any): Promise<void> {
    // Handle span failure events
  }

  private async handleTrustScoreUpdate(event: any): Promise<void> {
    // Handle trust score update events
  }

  private findSessionByTraceId(traceId: string): SessionTrace | null {
    for (const session of this.activeSessions.values()) {
      if (session.traceId === traceId) {
        return session;
      }
    }
    return null;
  }

  private createRecoverySpan(sessionTrace: SessionTrace, gap: SpanGap): TelemetrySpan {
    const spanId = uuidv4();
    const timestamp = new Date().toISOString();

    const context: SpanContext = {
      traceId: sessionTrace.traceId,
      spanId,
      parentId: sessionTrace.rootSpanId,
      step: 'recovery',
      timestamp,
      metadata: { recoveredFrom: gap.gapType }
    };

    const span: TelemetrySpan = {
      context,
      operation: 'span-recovery',
      status: 'active',
      startTime: timestamp,
      tags: { recovery: true },
      logs: [{
        timestamp,
        level: 'warn',
        message: `Recovery span created for gap: ${gap.gapType}`
      }],
      children: []
    };

    sessionTrace.spans.set(spanId, span);
    this.spanRegistry.set(spanId, span);

    gap.recoveryAction = `Created recovery span ${spanId}`;

    return span;
  }

  private repairBrokenChain(sessionTrace: SessionTrace, gap: SpanGap): TelemetrySpan | null {
    // Implementation for repairing broken chains
    return null;
  }

  private adoptOrphanedSpan(sessionTrace: SessionTrace, gap: SpanGap): TelemetrySpan | null {
    // Implementation for adopting orphaned spans
    return null;
  }
} 