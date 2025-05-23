/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "API bridge for emotional sovereignty system"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Connects frontend and Make.com to emotional sovereignty orchestrator
 */

import { Request, Response } from 'express';
import { EmotionalSovereigntyOrchestrator, EmotionalSovereigntyRequest } from '../orchestration/emotional-sovereignty-orchestrator';
import { emitSystemLog } from '../../cursor/utils/audit-utils';

const orchestrator = new EmotionalSovereigntyOrchestrator();

/**
 * Main webhook endpoint for emotional sovereignty processing
 */
export async function handleEmotionalSovereigntyWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Validate request body
    if (!req.body) {
      res.status(400).json({
        error: 'Missing request body',
        fallback: true
      });
      return;
    }

    // Extract and validate required fields
    const {
      userInput,
      sessionId,
      userId,
      productType,
      context
    } = req.body;

    if (!sessionId || !productType) {
      res.status(400).json({
        error: 'Missing required fields: sessionId, productType',
        fallback: true
      });
      return;
    }

    // Create orchestrator request
    const orchestratorRequest: EmotionalSovereigntyRequest = {
      userInput: userInput || {},
      sessionId,
      userId,
      productType,
      context
    };

    emitSystemLog('emotional-sovereignty-webhook-received', {
      sessionId,
      productType,
      hasUserInput: !!userInput,
      timestamp: new Date().toISOString()
    });

    // Process through emotional sovereignty orchestrator
    const result = await orchestrator.processEmotionalSovereignty(orchestratorRequest);

    // Return successful response
    res.status(200).json({
      success: true,
      sessionId: result.makeWebhookData.sessionId,
      structuredIntent: result.structuredIntent,
      emotionalContext: result.emotionalContext,
      sparkResonance: result.sparkResonance,
      confirmationMeta: result.confirmationMeta,
      emotionalArc: result.emotionalArc,
      readyForExecution: result.readyForExecution,
      makeWebhookData: result.makeWebhookData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    emitSystemLog('emotional-sovereignty-webhook-error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.body?.sessionId,
      timestamp: new Date().toISOString()
    });

    // Return graceful fallback response
    res.status(200).json({
      success: false,
      fallback: true,
      sessionId: req.body?.sessionId || 'unknown',
      structuredIntent: createFallbackStructuredIntent(),
      emotionalContext: { hasHistory: false, baseTrustScore: 3.0 },
      sparkResonance: { overallResonance: 0.5, selectedSpark: { personalizedName: 'Your Project' } },
      confirmationMeta: { emotionalTrustScore: 3.0 },
      emotionalArc: { arcType: 'Needs Recovery', finalTrustScore: 3.0, emotionalDelta: 0 },
      readyForExecution: true,
      makeWebhookData: {
        sessionId: req.body?.sessionId || 'unknown',
        productType: req.body?.productType || 'unknown',
        fallback: true,
        timestamp: new Date().toISOString()
      },
      error: error instanceof Error ? error.message : 'Processing error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Health check endpoint for emotional sovereignty system
 */
export async function handleEmotionalSovereigntyHealth(req: Request, res: Response): Promise<void> {
  try {
    // Test orchestrator initialization
    const testRequest: EmotionalSovereigntyRequest = {
      userInput: { test: true },
      sessionId: 'health-check',
      productType: 'health-check'
    };

    const result = await orchestrator.processEmotionalSovereignty(testRequest);

    res.status(200).json({
      status: 'healthy',
      emotionalSovereignty: {
        orchestrator: 'operational',
        emotionalTrustScore: result.emotionalArc.finalTrustScore,
        sparkResonance: result.sparkResonance.overallResonance,
        readyForExecution: result.readyForExecution
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Create fallback structured intent for error cases
 */
function createFallbackStructuredIntent() {
  return {
    business_type: { value: 'business', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
    primary_goal: { value: 'growth', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
    tone: { value: 'professional', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
    motivator: { value: 'success', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
    challenges: { value: [], confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
    _meta: {
      allFields: ['business_type', 'primary_goal', 'tone', 'motivator', 'challenges'],
      injectedFields: [],
      validationPassed: true,
      errors: [],
      usedSparkSignal: false,
      usedVisionCatcher: false,
      intentConfidence: 0.5,
      emotionalAnchorPresent: false,
      conflictDetected: false,
      hasMotivationHook: false
    }
  };
} 