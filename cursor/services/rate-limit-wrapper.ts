import { EventBus } from '../event-bus/eventBus';
import { EmotionalPayload } from '../utils/emotion-payload-builder';
import { TelemetrySpanManager } from './telemetry-span-manager';

export interface RateLimitIncident {
  incidentId: string;
  timestamp: number;
  severityLevel: 'low' | 'medium' | 'high';
  estimatedRecoveryMs: number;
  spanId?: string;
  traceId: string;
}

export interface RateLimitWrapperState {
  isActive: boolean;
  currentIncident?: RateLimitIncident;
  renderCount: number;
  lastClearTimestamp?: number;
}

export class RateLimitWrapper {
  private eventBus: EventBus;
  private telemetryManager: TelemetrySpanManager;
  private state: RateLimitWrapperState;

  constructor(eventBus: EventBus, telemetryManager: TelemetrySpanManager) {
    this.eventBus = eventBus;
    this.telemetryManager = telemetryManager;
    this.state = {
      isActive: false,
      renderCount: 0
    };
  }

  /**
   * Triggers a rate limit incident with emotional coherence
   * What: Creates a rate limit incident with proper UX wrapper
   * Why: Ensures clear, non-duplicated messaging during system stress
   * How: Logs incident, creates span, and maintains emotional tone
   */
  triggerRateLimit(incident: RateLimitIncident): RateLimitWrapperState {
    // Prevent duplicate incidents
    if (this.state.isActive && this.state.currentIncident?.incidentId === incident.incidentId) {
      return this.state;
    }

    // Create telemetry span for incident tracking
    const span = this.telemetryManager.createRootSpan(
      `rate-limit-${incident.incidentId}`,
      'rate-limit-incident',
      {
        rateLimitIncidentId: incident.incidentId,
        severityLevel: incident.severityLevel,
        estimatedRecoveryMs: incident.estimatedRecoveryMs,
        traceId: incident.traceId
      }
    );

    // Update state
    this.state = {
      isActive: true,
      currentIncident: { ...incident, spanId: span.context.spanId },
      renderCount: this.state.renderCount + 1,
      lastClearTimestamp: undefined
    };

    // Emit event for UX rendering
    this.eventBus.emit('rate-limit-triggered', {
      incident: this.state.currentIncident,
      renderCount: this.state.renderCount
    });

    return this.state;
  }

  /**
   * Clears the rate limit incident and resets UX
   * What: Cleans up rate limit state and UI
   * Why: Ensures old wrapper is removed when limit clears
   * How: Resets state and emits clear event
   */
  clearRateLimit(): RateLimitWrapperState {
    if (!this.state.isActive) {
      return this.state;
    }

    const previousIncident = this.state.currentIncident;

    // Complete the telemetry span
    if (previousIncident?.spanId) {
      this.telemetryManager.completeSpan(previousIncident.spanId);
    }

    // Update state
    this.state = {
      isActive: false,
      currentIncident: undefined,
      renderCount: this.state.renderCount,
      lastClearTimestamp: Date.now()
    };

    // Emit clear event
    this.eventBus.emit('rate-limit-cleared', {
      previousIncident,
      clearTimestamp: this.state.lastClearTimestamp
    });

    return this.state;
  }

  /**
   * Gets the current wrapper state
   */
  getState(): RateLimitWrapperState {
    return { ...this.state };
  }

  /**
   * Validates that no duplicate wrappers are active
   * What: Ensures only one rate limit message is rendered
   * Why: Prevents UX noise and emotional confusion
   * How: Checks state and render count
   */
  validateSingleWrapper(): boolean {
    return this.state.renderCount <= 1 || !this.state.isActive;
  }

  /**
   * Creates an emotional payload for rate limit messaging
   * What: Generates emotionally coherent rate limit message
   * Why: Maintains trust and empathy during system stress
   * How: Creates payload with reassuring tone and clear messaging
   */
  createRateLimitPayload(incident: RateLimitIncident): EmotionalPayload {
    const estimatedMinutes = Math.ceil(incident.estimatedRecoveryMs / 60000);
    
    return {
      traceId: incident.traceId,
      sessionId: `rate-limit-${incident.incidentId}`,
      emotionIntentHash: 'rate-limit-empathy',
      tone: 'reassuring',
      trustScore: 0.85, // Slightly reduced but not eroded
      payload: this.generateRateLimitMessage(incident.severityLevel, estimatedMinutes),
      timestamp: new Date(incident.timestamp).toISOString(),
      locale: 'en-US'
    };
  }

  private generateRateLimitMessage(severity: string, estimatedMinutes: number): string {
    switch (severity) {
      case 'low':
        return `We're experiencing high demand right now. Your request will be processed in about ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''}. Thank you for your patience.`;
      case 'medium':
        return `Our systems are working hard to serve everyone. Please wait ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} before trying again. We appreciate your understanding.`;
      case 'high':
        return `We're temporarily managing high traffic to ensure the best experience for everyone. Please try again in ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''}. We're here when you're ready.`;
      default:
        return `Please wait a moment before trying again. We're working to process your request as quickly as possible.`;
    }
  }
} 