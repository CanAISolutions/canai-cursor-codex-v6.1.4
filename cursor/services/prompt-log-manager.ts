/**
 * prompt-log-manager.ts
 * 
 * Purpose: Manages historical prompt logs, provides replay functionality,
 * and supplies test fixtures for forward compatibility validation.
 * 
 * Codex Enforcement: Real System Bound log management with comprehensive replay
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptPayload } from './prompt-schema-validator';

export interface HistoricalPromptLog {
  recordId: string;
  createdAt: number;
  sessionId: string;
  promptType: string;
  version: string;
  originalPayload: PromptPayload;
  processedOutput?: string;
  metadata: {
    trustScore: number;
    emotionalAlignment: string;
    processingTime: number;
    fallbacksUsed: string[];
    handlerUsed: string;
  };
}

export interface ReplayResult {
  success: boolean;
  originalLog: HistoricalPromptLog;
  replayPayload: PromptPayload;
  replayOutput: string;
  compatibilityStatus: 'compatible' | 'migrated' | 'failed';
  migrationsApplied: string[];
  warnings: string[];
  errors: string[];
  performanceComparison: {
    originalTime: number;
    replayTime: number;
    deltaMs: number;
    deltaPercent: number;
  };
}

export class PromptLogManager {
  private eventBus: EventBus;
  private historicalLogs: Map<string, HistoricalPromptLog>;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.historicalLogs = new Map();
    this.initializeTestFixtures();
  }

  /**
   * Initialize test fixtures with historical prompt logs
   */
  private initializeTestFixtures(): void {
    // V1 Historical Logs
    this.historicalLogs.set('v1_business_plan_001', {
      recordId: 'v1_business_plan_001',
      createdAt: Date.now() - (365 * 24 * 60 * 60 * 1000), // 1 year ago
      sessionId: 'session_v1_001',
      promptType: 'business_plan',
      version: 'v1',
      originalPayload: {
        sessionId: 'session_v1_001',
        promptType: 'business_plan',
        version: 'v1',
        content: 'Create a business plan for a tech startup focused on AI solutions',
        metadata: {
          trustScore: 0.8,
          emotionalAlignment: 'neutral'
        },
        legacyField: 'legacy_business_context'
      },
      processedOutput: '[V1 BUSINESS_PLAN] Create a business plan for a tech startup focused on AI solutions',
      metadata: {
        trustScore: 0.8,
        emotionalAlignment: 'neutral',
        processingTime: 150,
        fallbacksUsed: [],
        handlerUsed: 'v1'
      }
    });

    this.historicalLogs.set('v1_email_campaign_001', {
      recordId: 'v1_email_campaign_001',
      createdAt: Date.now() - (300 * 24 * 60 * 60 * 1000), // 10 months ago
      sessionId: 'session_v1_002',
      promptType: 'email_campaign',
      version: 'v1',
      originalPayload: {
        sessionId: 'session_v1_002',
        promptType: 'email_campaign',
        version: 'v1',
        content: 'Design an email campaign for product launch',
        metadata: {
          trustScore: 0.75,
          emotionalAlignment: 'neutral'
        },
        deprecatedTone: 'marketing_focused'
      },
      processedOutput: '[V1 EMAIL_CAMPAIGN] Design an email campaign for product launch',
      metadata: {
        trustScore: 0.75,
        emotionalAlignment: 'neutral',
        processingTime: 120,
        fallbacksUsed: [],
        handlerUsed: 'v1'
      }
    });

    // V2 Historical Logs
    this.historicalLogs.set('v2_social_content_001', {
      recordId: 'v2_social_content_001',
      createdAt: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
      sessionId: 'session_v2_001',
      promptType: 'social_content',
      version: 'v2',
      originalPayload: {
        sessionId: 'session_v2_001',
        promptType: 'social_content',
        version: 'v2',
        content: 'Create engaging social media posts for our new product',
        metadata: {
          trustScore: 0.85,
          emotionalAlignment: 'supportive'
        },
        enhancerFields: {
          emotionalContext: 'enthusiastic',
          urgencyLevel: 2
        }
      },
      processedOutput: '[V2 SOCIAL_CONTENT] Create engaging social media posts for our new product [Emotional Context: enthusiastic] [Urgency: 2/5] [Trust: 85%]',
      metadata: {
        trustScore: 0.85,
        emotionalAlignment: 'supportive',
        processingTime: 95,
        fallbacksUsed: [],
        handlerUsed: 'v2'
      }
    });

    this.historicalLogs.set('v2_business_plan_002', {
      recordId: 'v2_business_plan_002',
      createdAt: Date.now() - (120 * 24 * 60 * 60 * 1000), // 4 months ago
      sessionId: 'session_v2_002',
      promptType: 'business_plan',
      version: 'v2',
      originalPayload: {
        sessionId: 'session_v2_002',
        promptType: 'business_plan',
        version: 'v2',
        content: 'Develop a comprehensive business plan for a SaaS platform',
        metadata: {
          trustScore: 0.9,
          emotionalAlignment: 'supportive'
        },
        enhancerFields: {
          emotionalContext: 'professional',
          urgencyLevel: 3
        }
      },
      processedOutput: '[V2 BUSINESS_PLAN] Develop a comprehensive business plan for a SaaS platform [Emotional Context: professional] [Urgency: 3/5] [Trust: 90%]',
      metadata: {
        trustScore: 0.9,
        emotionalAlignment: 'supportive',
        processingTime: 110,
        fallbacksUsed: [],
        handlerUsed: 'v2'
      }
    });

    // V3 Historical Logs (Recent)
    this.historicalLogs.set('v3_email_campaign_002', {
      recordId: 'v3_email_campaign_002',
      createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 1 month ago
      sessionId: 'session_v3_001',
      promptType: 'email_campaign',
      version: 'v3',
      originalPayload: {
        recordId: 'prompt_1234567890_abc123def',
        sessionId: 'session_v3_001',
        promptType: 'email_campaign',
        version: 'v3',
        content: 'Create a personalized email campaign for customer retention',
        metadata: {
          trustScore: 0.95,
          emotionalAlignment: 'empathetic',
          createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - (30 * 24 * 60 * 60 * 1000)
        },
        enhancerFields: {
          emotionalContext: 'engaging',
          urgencyLevel: 2,
          audienceProfile: 'customers'
        }
      },
      processedOutput: '[V3 EMAIL_CAMPAIGN] Create a personalized email campaign for customer retention [Context: engaging, Alignment: empathetic] [Audience: customers, Urgency: 2/5] [Trust: 95%, Record: prompt_1234567890_abc123def] [Session: session_v3_001]',
      metadata: {
        trustScore: 0.95,
        emotionalAlignment: 'empathetic',
        processingTime: 85,
        fallbacksUsed: [],
        handlerUsed: 'v3'
      }
    });

    // Edge case logs for testing
    this.historicalLogs.set('v1_minimal_payload', {
      recordId: 'v1_minimal_payload',
      createdAt: Date.now() - (400 * 24 * 60 * 60 * 1000), // 13 months ago
      sessionId: 'session_minimal',
      promptType: 'social_content',
      version: 'v1',
      originalPayload: {
        sessionId: 'session_minimal',
        promptType: 'social_content',
        version: 'v1',
        content: 'Quick post'
      },
      processedOutput: '[V1 SOCIAL_CONTENT] Quick post',
      metadata: {
        trustScore: 0.7,
        emotionalAlignment: 'neutral',
        processingTime: 50,
        fallbacksUsed: ['Applied default metadata'],
        handlerUsed: 'v1'
      }
    });

    this.historicalLogs.set('v2_corrupted_enhancers', {
      recordId: 'v2_corrupted_enhancers',
      createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000), // 3 months ago
      sessionId: 'session_corrupted',
      promptType: 'business_plan',
      version: 'v2',
      originalPayload: {
        sessionId: 'session_corrupted',
        promptType: 'business_plan',
        version: 'v2',
        content: 'Create business plan with invalid enhancers',
        metadata: {
          trustScore: 0.8,
          emotionalAlignment: 'supportive'
        },
        enhancerFields: {
          emotionalContext: 'invalid_emotion',
          urgencyLevel: 10 // Invalid: should be 1-5
        }
      },
      processedOutput: '[V2 BUSINESS_PLAN] Create business plan with invalid enhancers [Trust: 80%]',
      metadata: {
        trustScore: 0.8,
        emotionalAlignment: 'supportive',
        processingTime: 130,
        fallbacksUsed: ['Applied fallback emotionalContext: professional', 'Applied fallback urgencyLevel: 1'],
        handlerUsed: 'v2'
      }
    });
  }

  /**
   * Get all historical logs
   */
  getAllHistoricalLogs(): HistoricalPromptLog[] {
    return Array.from(this.historicalLogs.values());
  }

  /**
   * Get historical logs by version
   */
  getLogsByVersion(version: string): HistoricalPromptLog[] {
    return this.getAllHistoricalLogs().filter(log => log.version === version);
  }

  /**
   * Get historical logs by prompt type
   */
  getLogsByPromptType(promptType: string): HistoricalPromptLog[] {
    return this.getAllHistoricalLogs().filter(log => log.promptType === promptType);
  }

  /**
   * Get a specific historical log
   */
  getHistoricalLog(recordId: string): HistoricalPromptLog | null {
    return this.historicalLogs.get(recordId) || null;
  }

  /**
   * Get logs from a specific time period
   */
  getLogsByDateRange(startDate: number, endDate: number): HistoricalPromptLog[] {
    return this.getAllHistoricalLogs().filter(
      log => log.createdAt >= startDate && log.createdAt <= endDate
    );
  }

  /**
   * Get compatibility matrix for all historical logs
   */
  getCompatibilityMatrix(): Record<string, { total: number; byVersion: Record<string, number> }> {
    const matrix: Record<string, { total: number; byVersion: Record<string, number> }> = {};
    
    for (const log of this.getAllHistoricalLogs()) {
      if (!matrix[log.promptType]) {
        matrix[log.promptType] = { total: 0, byVersion: {} };
      }
      
      matrix[log.promptType].total++;
      
      if (!matrix[log.promptType].byVersion[log.version]) {
        matrix[log.promptType].byVersion[log.version] = 0;
      }
      
      matrix[log.promptType].byVersion[log.version]++;
    }
    
    return matrix;
  }

  /**
   * Create a new historical log entry
   */
  addHistoricalLog(log: HistoricalPromptLog): void {
    this.historicalLogs.set(log.recordId, log);
    
    this.eventBus.emit('prompt:log:added', {
      log,
      timestamp: Date.now()
    });
  }

  /**
   * Get test fixtures for specific scenarios
   */
  getTestFixtures(): {
    v1Logs: HistoricalPromptLog[];
    v2Logs: HistoricalPromptLog[];
    v3Logs: HistoricalPromptLog[];
    edgeCases: HistoricalPromptLog[];
    allVersions: HistoricalPromptLog[];
  } {
    const allLogs = this.getAllHistoricalLogs();
    
    return {
      v1Logs: allLogs.filter(log => log.version === 'v1'),
      v2Logs: allLogs.filter(log => log.version === 'v2'),
      v3Logs: allLogs.filter(log => log.version === 'v3'),
      edgeCases: allLogs.filter(log => 
        log.recordId.includes('minimal') || 
        log.recordId.includes('corrupted')
      ),
      allVersions: allLogs
    };
  }
} 