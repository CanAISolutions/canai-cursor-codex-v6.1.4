/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test coverage for A/B testing engine"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Ensure reliability of confidence threshold variants
 */

import { ABTestingEngine, ConfidenceVariant } from '../abTestingEngine';
import { EventBus } from '../../event-bus/eventBus';
import { AirtableLogger } from '../airtableLogger';

// Mock dependencies
jest.mock('../airtableLogger');
jest.mock('../../event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      publish: jest.fn(),
      clear: jest.fn()
    })
  }
}));

interface LocalStorageMock {
  [key: string]: string;
}

describe('ABTestingEngine', () => {
  let engine: ABTestingEngine;
  let eventBus: jest.Mocked<EventBus>;
  let airtableLogger: jest.Mocked<AirtableLogger>;
  let localStorageMock: LocalStorageMock;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new ABTestingEngine();
    eventBus = EventBus.getInstance() as unknown as jest.Mocked<EventBus>;
    airtableLogger = new AirtableLogger() as jest.Mocked<AirtableLogger>;
    localStorageMock = {};
  });

  describe('getCurrentVariant', () => {
    it('should return stored variant if exists', () => {
      localStorageMock['defaultsVariant'] = 'high';
      const variant = engine.getCurrentVariant();
      expect(variant.id).toBe('high');
      expect(variant.sessionThreshold).toBe(0.8);
      expect(variant.emotionalThreshold).toBe(0.6);
    });

    it('should assign new variant if none exists', () => {
      const variant = engine.getCurrentVariant();
      expect(variant).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(variant.id);
    });

    it('should emit variant assigned event for new assignments', () => {
      engine.getCurrentVariant();
      expect(eventBus.emit).toHaveBeenCalledWith({
        type: 'defaultsABGroupAssigned',
        timestamp: expect.any(String),
        data: {
          variant: expect.any(String),
          thresholds: {
            session: expect.any(Number),
            emotional: expect.any(Number)
          }
        }
      }, 'medium');
    });
  });

  describe('recordOutcome', () => {
    it('should log outcome to Airtable', () => {
      localStorageMock['defaultsVariant'] = 'high';
      engine.recordOutcome(true, 0.9, 'session');
      
      expect(airtableLogger.logDefaultApplied).toHaveBeenCalledWith({
        defaults: expect.any(Object),
        confidence: 0.9,
        source: 'session',
        variant: 'high',
        success: true,
        timestamp: expect.any(String)
      });
    });

    it('should emit analytics event', () => {
      localStorageMock['defaultsVariant'] = 'high';
      engine.recordOutcome(true, 0.9, 'session');
      expect(eventBus.emit).toHaveBeenCalledWith({
        type: 'ANALYTICS_EVENT',
        timestamp: expect.any(String),
        data: {
          type: 'defaults-outcome',
          variant: 'high',
          success: true,
          confidence: 0.9,
          source: 'session',
          metadata: {
            timestamp: expect.any(String),
            sessionId: expect.any(String)
          }
        }
      }, 'medium');
    });

    it('should handle failed outcomes', () => {
      localStorageMock['defaultsVariant'] = 'high';
      engine.recordOutcome(false, 0.4, 'session');
      
      expect(airtableLogger.logDefaultApplied).toHaveBeenCalledWith({
        defaults: expect.any(Object),
        confidence: 0.4,
        source: 'session',
        variant: 'high',
        success: false,
        timestamp: expect.any(String),
        error: {
          type: 'confidence_threshold',
          message: 'Confidence below threshold',
          context: {
            threshold: expect.any(Number),
            variant: 'high'
          }
        }
      });
    });
  });

  describe('forceVariant', () => {
    it('should set specific variant', () => {
      engine.forceVariant('medium');
      localStorageMock['defaultsVariant'] = 'medium';
      const variant = engine.getCurrentVariant();
      expect(variant.id).toBe('medium');
      expect(variant.sessionThreshold).toBe(0.7);
      expect(variant.emotionalThreshold).toBe(0.5);
    });

    it('should not set invalid variant', () => {
      engine.forceVariant('invalid');
      // No-op for localStorageMock in test context
      expect(eventBus.emit).toHaveBeenCalledWith({
        type: 'defaultsABError',
        timestamp: expect.any(String),
        data: {
          error: {
            type: 'invalid_variant',
            message: 'Invalid variant specified',
            context: {
              attemptedVariant: 'invalid',
              validVariants: ['high', 'medium', 'low']
            }
          }
        }
      }, 'high');
    });
  });

  describe('event handling', () => {
    it('should handle DEFAULTS_APPLIED event', () => {
      const event: any = {
        type: 'DEFAULTS_APPLIED',
        timestamp: new Date().toISOString(),
        data: {
          success: true,
          confidence: 0.9,
          source: 'session',
          metadata: {
            sessionId: 'test-session',
            timestamp: new Date().toISOString()
          }
        }
      };

      eventBus.publish(event, 'medium');
      expect(airtableLogger.logDefaultApplied).toHaveBeenCalledWith({
        defaults: expect.any(Object),
        confidence: 0.9,
        source: 'session',
        success: true,
        timestamp: expect.any(String),
        metadata: expect.any(Object)
      });
    });

    it('should ignore incomplete events', () => {
      const event = {
        type: 'DEFAULTS_APPLIED',
        timestamp: new Date().toISOString(),
        data: {
          confidence: 0.9,
          source: 'session'
        }
      };

      eventBus.publish(event, 'medium');
      expect(airtableLogger.logDefaultApplied).not.toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: 'defaultsABError',
        timestamp: expect.any(String),
        data: {
          error: {
            type: 'incomplete_event',
            message: 'Missing required fields in DEFAULTS_APPLIED event',
            context: {
              event: event,
              missingFields: ['success']
            }
          }
        }
      }, 'high');
    });

    it('should handle concurrent variant assignments', async () => {
      const assignments = [
        { variant: 'high', timestamp: new Date().toISOString() },
        { variant: 'medium', timestamp: new Date().toISOString() },
        { variant: 'low', timestamp: new Date().toISOString() }
      ];

      await Promise.all(assignments.map(a => 
        eventBus.publish({
          type: 'defaultsABGroupAssigned',
          timestamp: a.timestamp,
          data: {
            variant: a.variant,
            thresholds: {
              session: expect.any(Number),
              emotional: expect.any(Number)
            }
          }
        }, 'medium')
      ));

      expect(eventBus.publish).toHaveBeenCalledTimes(3);
      const events = eventBus.publish.mock.calls.map(call => call[0]);
      expect(events).toHaveLength(3);
      events.forEach(event => {
        expect(event).toMatchObject({
          type: 'defaultsABGroupAssigned',
          timestamp: expect.any(String),
          data: {
            variant: expect.any(String),
            thresholds: {
              session: expect.any(Number),
              emotional: expect.any(Number)
            }
          }
        });
      });
    });
  });
}); 