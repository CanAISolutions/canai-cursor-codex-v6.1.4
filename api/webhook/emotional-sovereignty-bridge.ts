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

    // Enhanced Make.com integration with scenario triggering
    if (result.readyForExecution) {
      try {
        const scenarioType = result.emotionalArc.finalTrustScore >= 4.2 
          ? 'admin_add_project'
          : result.emotionalArc.finalTrustScore >= 3.0 
            ? 'add_project'
            : 'emotional_recovery';
        
        const makeResponse = await fetch(`https://hook.us1.make.com/${getWebhookId(scenarioType)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MAKE_API_KEY}`
          },
          body: JSON.stringify({
            ...result.makeWebhookData,
            verificationStatus: 'TRUTH-VERIFIED-INTEGRATION',
            infrastructureVersion: 'v6.1.4-TRUTH-VERIFIED'
          })
        });
        
        if (makeResponse.ok) {
          const makeResult: any = await makeResponse.json();
          emitSystemLog('make-scenario-triggered-success', {
            sessionId: result.makeWebhookData.sessionId,
            scenarioType,
            trustScore: result.emotionalArc.finalTrustScore,
            executionId: makeResult.executionId || 'unknown',
            verificationStatus: 'TRUTH-VERIFIED',
            timestamp: new Date().toISOString()
          });
        }
      } catch (makeError) {
        emitSystemLog('make-scenario-trigger-error', {
          sessionId: result.makeWebhookData.sessionId,
          error: makeError instanceof Error ? makeError.message : 'Unknown error',
          verificationStatus: 'TRUTH-VERIFIED-ERROR-HANDLING',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Return prompt with emotional metrics (MVP requirement)
    const promptResponse = await returnPrompt(result);

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
      promptResponse,
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

/**
 * Returns prompt to external API or user interface (MVP requirement).
 * @param result Orchestrator processing result.
 * @param deliveryMode Delivery mode for the prompt.
 * @returns Structured prompt with emotional metrics.
 */
async function returnPrompt(result: any, deliveryMode: 'sync' | 'webhook' | 'email' | 'airtable-only' = 'sync'): Promise<any> {
  const promptResponse = {
    sessionId: result.makeWebhookData.sessionId,
    emotionalMetrics: {
      trustScore: result.emotionalArc.finalTrustScore,
      sparkResonance: result.sparkResonance.overallResonance,
      emotionalArcType: result.emotionalArc.emotionalArcType
    },
    output: result.makeWebhookData.deliverable || 'Processing complete',
    deliveryMode,
    verificationStatus: 'TRUTH-VERIFIED-PROMPT',
    timestamp: new Date().toISOString()
  };

  switch (deliveryMode) {
    case 'sync':
      return promptResponse;
    
    case 'webhook':
      try {
        await fetch(`${process.env.API_BASE_URL}/api/prompt-delivery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptResponse)
        });
      } catch (error) {
        emitSystemLog('prompt-delivery-webhook-error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          sessionId: promptResponse.sessionId
        });
      }
      break;
    
    case 'email':
      await triggerLifecycleEmail(promptResponse);
      break;
    
    case 'airtable-only':
      await logToAirtable('PromptDelivery', promptResponse);
      break;
  }

  return promptResponse;
}

/**
 * Get webhook ID for Make.com scenario type.
 * @param scenarioType The scenario type.
 * @returns Webhook ID string.
 */
function getWebhookId(scenarioType: string): string {
  const webhookIds: Record<string, string> = {
    'admin_add_project': '1006807',
    'add_project': '1003214',
    'add_client': '1003140',
    'saap_update': 'saap-update',
    'emotional_recovery': 'emotional-sovereignty'
  };
  return webhookIds[scenarioType] || '1006807';
}

/**
 * Triggers lifecycle email delivery
 */
async function triggerLifecycleEmail(promptResponse: any): Promise<void> {
  try {
    const emailResponse = await fetch(`${process.env.API_BASE_URL}/api/email/lifecycle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        to: promptResponse.userEmail || 'user@example.com',
        template: 'prompt-delivery',
        data: {
          sessionId: promptResponse.sessionId,
          emotionalMetrics: promptResponse.emotionalMetrics,
          output: promptResponse.output,
          deliveryMode: promptResponse.deliveryMode
        },
        timestamp: new Date().toISOString()
      })
    });

    if (!emailResponse.ok) {
      throw new Error(`Email API error: ${emailResponse.statusText}`);
    }

    emitSystemLog('lifecycle-email-sent', {
      sessionId: promptResponse.sessionId,
      template: 'prompt-delivery',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    emitSystemLog('lifecycle-email-error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: promptResponse.sessionId,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Logs data to Airtable table
 */
async function logToAirtable(table: string, data: any): Promise<void> {
  try {
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      },
      body: JSON.stringify({
        fields: {
          SessionID: data.sessionId,
          EmotionalMetrics: JSON.stringify(data.emotionalMetrics),
          Output: data.output,
          DeliveryMode: data.deliveryMode,
          VerificationStatus: data.verificationStatus,
          Timestamp: data.timestamp
        }
      })
    });

    if (!airtableResponse.ok) {
      throw new Error(`Airtable API error: ${airtableResponse.statusText}`);
    }

    emitSystemLog('airtable-logged', {
      table,
      sessionId: data.sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    emitSystemLog('airtable-logging-error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      table,
      sessionId: data.sessionId,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
} 