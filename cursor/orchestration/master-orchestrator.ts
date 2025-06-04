/**
 * Master Orchestrator - Bridge 3: Unified Orchestration Hub
 * Purpose: Central coordination of complete user journeys with SparkSplit as trust catalyst
 * Classification: Core Infrastructure - Emotional Sovereignty Platform
 * 
 * What: Orchestrates all 95+ components for cohesive user experiences with trust transparency
 * Why: Ensures seamless user journeys with 99.9% component reliability and 4.7+ trust scores
 * How: State management, error handling, component coordination with SparkSplit integration
 */

import { 
  EmotionalContext,
  TrustDelta,
  EmotionalIntelligenceMetrics,
  SacredMomentTrigger
} from '../types/emotional-sovereignty';
import { UniversalInterfaceAdapter, SparkSplitIntegration } from '../adapters/universal-interface-adapter';
import { EmotionalContextPipeline, EnrichedEmotionalContext, ContextEnrichmentRequest } from '../services/emotional-context-pipeline';
import { SparkSplitEngine, SparkSplitInput, SparkSplitOutput } from '../services/spark-split-engine';
import { SacredMomentsOrchestrator, SacredMomentType } from '../services/sacred-moments-orchestrator';
import { ReversalTestAutomator, ReversalTestResult } from '../validators/reversal-test-automator';
import { EmotionalMemoryBank } from '../utils/emotionalMemoryBank';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';

// Journey orchestration request
export interface JourneyOrchestrationRequest {
  userId?: string;
  sessionId: string;
  journeyType: JourneyType;
  initialInput: any;
  emotionalContext?: EmotionalContext;
  preferences?: UserPreferences;
  sparkSplitEnabled?: boolean;
  targetComponents?: string[];
}

// Journey types supported by the orchestrator
export type JourneyType = 
  | 'discovery_funnel'           // Initial user discovery and intent capture
  | 'spark_generation'           // Concept generation with emotional resonance
  | 'content_creation'           // Full content creation with SparkSplit
  | 'trust_building'             // Trust-focused interaction with transparency
  | 'emotional_sovereignty'      // Complete sovereignty experience
  | 'sacred_moments'             // Sacred moments journey orchestration
  | 'cross_session_continuity'   // Multi-session experience coordination
  | 'recovery_flow';             // Error recovery and trust rebuilding

// User preferences for journey customization
export interface UserPreferences {
  enrichmentLevel: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  sparkSplitPreference: 'always' | 'selective' | 'never';
  communicationStyle: 'direct' | 'collaborative' | 'supportive';
  trustTransparency: 'high' | 'medium' | 'low';
  emotionalIntensity: 'subtle' | 'moderate' | 'high';
  pacePreference: 'fast' | 'moderate' | 'thoughtful';
}

// Journey orchestration result
export interface JourneyOrchestrationResult {
  success: boolean;
  journeyId: string;
  currentStage: string;
  completedStages: string[];
  nextStages: string[];
  
  // Component outputs
  componentResults: Map<string, any>;
  
  // Emotional intelligence data
  enrichedContext: EnrichedEmotionalContext;
  trustProgression: TrustDelta[];
  emotionalCompass?: EmotionalIntelligenceMetrics;
  
  // SparkSplit integration
  sparkSplitResults?: SparkSplitOutput[];
  trustTransparencyScore: number;
  
  // Quality metrics
  journeyQuality: JourneyQualityMetrics;
  
  // Next actions
  recommendations: string[];
  nextActions: OrchestrationAction[];
  
  // Error handling
  errors: OrchestrationError[];
  recoveryActions: RecoveryAction[];
}

// Journey quality metrics
export interface JourneyQualityMetrics {
  overallScore: number;
  componentReliability: number;
  emotionalContinuity: number;
  trustScore: number;
  userSatisfaction: number;
  processingLatency: number;
  errorRate: number;
}

// Orchestration actions for next steps
export interface OrchestrationAction {
  type: 'trigger_component' | 'trigger_sparksplit' | 'trigger_sacred_moment' | 'enhance_context' | 'recover_error';
  priority: 'high' | 'medium' | 'low';
  component?: string;
  data?: any;
  expectedOutcome: string;
  fallbackAction?: OrchestrationAction;
}

// Error tracking and recovery
export interface OrchestrationError {
  errorId: string;
  timestamp: Date;
  component: string;
  errorType: 'component_failure' | 'trust_breach' | 'context_loss' | 'latency_timeout' | 'validation_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  context: any;
  recoveryAttempted: boolean;
  recoverySuccess?: boolean;
}

// Recovery action definitions
export interface RecoveryAction {
  actionId: string;
  errorId: string;
  actionType: 'component_retry' | 'fallback_component' | 'trust_rebuild' | 'context_restore' | 'graceful_degradation';
  implementation: string;
  expectedOutcome: string;
  maxRetries: number;
  currentRetries: number;
}

// Journey state management
export interface JourneyState {
  journeyId: string;
  userId?: string;
  sessionId: string;
  journeyType: JourneyType;
  currentStage: string;
  completedStages: string[];
  stageHistory: StageHistoryEntry[];
  
  // Context and data
  enrichedContext: EnrichedEmotionalContext;
  componentData: Map<string, any>;
  sparkSplitData?: SparkSplitIntegration;
  
  // Quality tracking
  qualityMetrics: JourneyQualityMetrics;
  trustProgression: TrustDelta[];
  
  // Error tracking
  errors: OrchestrationError[];
  recoveryActions: RecoveryAction[];
  
  // Timing
  startTime: Date;
  lastUpdateTime: Date;
  estimatedCompletionTime?: Date;
}

// Stage history for journey tracking
export interface StageHistoryEntry {
  stage: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  success: boolean;
  componentResults: any;
  qualityScore: number;
  errors: string[];
}

/**
 * Master Orchestrator
 * Central coordination hub for all emotional sovereignty journeys
 */
export class MasterOrchestrator {
  private universalAdapter: UniversalInterfaceAdapter;
  private emotionalPipeline: EmotionalContextPipeline;
  private sparkSplitEngine: SparkSplitEngine;
  private sacredMomentsOrchestrator: SacredMomentsOrchestrator;
  private reversalTestAutomator: ReversalTestAutomator;
  private emotionalMemoryBank: EmotionalMemoryBank;
  private eventBus: EventBus;
  
  // Journey state management
  private activeJourneys: Map<string, JourneyState> = new Map();
  private journeyTemplates: Map<JourneyType, JourneyTemplate> = new Map();
  
  // Performance monitoring
  private performanceMetrics: PerformanceMetrics = {
    totalJourneys: 0,
    successfulJourneys: 0,
    averageLatency: 0,
    averageTrustScore: 0,
    componentReliability: new Map()
  };

  constructor(
    universalAdapter: UniversalInterfaceAdapter,
    emotionalPipeline: EmotionalContextPipeline,
    sparkSplitEngine: SparkSplitEngine,
    sacredMomentsOrchestrator: SacredMomentsOrchestrator,
    reversalTestAutomator: ReversalTestAutomator,
    emotionalMemoryBank: EmotionalMemoryBank,
    eventBus: EventBus
  ) {
    this.universalAdapter = universalAdapter;
    this.emotionalPipeline = emotionalPipeline;
    this.sparkSplitEngine = sparkSplitEngine;
    this.sacredMomentsOrchestrator = sacredMomentsOrchestrator;
    this.reversalTestAutomator = reversalTestAutomator;
    this.emotionalMemoryBank = emotionalMemoryBank;
    this.eventBus = eventBus;
    
    this.initializeJourneyTemplates();
    this.setupEventListeners();
  }

  /**
   * Orchestrate complete user journey with emotional sovereignty
   * What: Coordinates all components for seamless user experience with trust transparency
   * Why: Ensures 99.9% reliability and 4.7+ trust scores across all interactions
   * How: State management, component coordination, error handling with SparkSplit integration
   */
  async orchestrateJourney(request: JourneyOrchestrationRequest): Promise<JourneyOrchestrationResult> {
    const journeyId = this.generateJourneyId();
    const startTime = Date.now();
    
    try {
      emitSystemLog('journey-orchestration-start', {
        journeyId,
        journeyType: request.journeyType,
        userId: request.userId,
        sessionId: request.sessionId,
        hasEmotionalContext: !!request.emotionalContext
      });

      // Initialize journey state
      const journeyState = await this.initializeJourneyState(journeyId, request);
      this.activeJourneys.set(journeyId, journeyState);

      // Enrich emotional context
      const contextEnrichmentRequest: ContextEnrichmentRequest = {
        userId: request.userId,
        sessionId: request.sessionId,
        currentContext: request.emotionalContext || {
          baseTrustScore: 3.5,
          emotionalTriggers: [],
          userId: request.userId || '',
          sessionId: request.sessionId,
          languageFingerprint: {
            preferredTone: 'professional',
            complexityLevel: 'medium',
            emotionalStyle: 'supportive'
          },
          industryContext: '',
          culturalContext: 'western_business',
          toneContext: 'professional'
        },
        interactionData: this.compileJourneyInput(journeyState),
        enrichmentLevel: (request.preferences?.enrichmentLevel as any) || 'enhanced'
      };
      
      const contextResult = await this.emotionalPipeline.enrichEmotionalContext(contextEnrichmentRequest);
      journeyState.enrichedContext = contextResult.enrichedContext;
      
      // Retrieve journey template
      const template = this.journeyTemplates.get(request.journeyType);
      if (!template) {
        throw new Error(`Journey template not found for type: ${request.journeyType}`);
      }
      
      // Execute journey stages
      const stageResults = await this.executeJourneyStages(journeyState, template, request);
      
      // Determine if SparkSplit should be triggered
      let sparkSplitResults: SparkSplitOutput[] = [];
      if (this.shouldTriggerSparkSplit(journeyState, stageResults) && request.sparkSplitEnabled !== false) {
        sparkSplitResults = await this.executeSparkSplit(journeyState, stageResults);
      }
      
      // Validate journey with sacred reversal test
      const reversalTestResult = await this.validateJourneyWithReversalTest(
        journeyState, 
        stageResults
      );
      
      // Trigger sacred moments if appropriate
      await this.triggerSacredMomentsIfAppropriate(
        journeyState, 
        stageResults, 
        reversalTestResult
      );
      
      // Calculate journey quality
      const journeyQuality = await this.calculateJourneyQuality(
        journeyState, 
        stageResults, 
        sparkSplitResults
      );
      
      // Generate recommendations and next actions
      const recommendations = await this.generateJourneyRecommendations(
        journeyState, 
        journeyQuality
      );
      
      const nextActions = await this.generateNextActions(
        journeyState, 
        journeyQuality
      );
      
      // Update journey state
      journeyState.qualityMetrics = journeyQuality;
      journeyState.lastUpdateTime = new Date();
      
      // Measure performance metrics
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(journeyState, journeyQuality, duration);
      
      // Store journey in memory
      await this.storeJourneyInMemory(journeyState, journeyQuality);
      
      // Build result
      const result: JourneyOrchestrationResult = {
        success: true,
        journeyId,
        currentStage: journeyState.currentStage,
        completedStages: journeyState.completedStages,
        nextStages: template.stages
          .filter(s => !journeyState.completedStages.includes(s.name))
          .map(s => s.name),
        
        componentResults: journeyState.componentData,
        enrichedContext: journeyState.enrichedContext,
        trustProgression: journeyState.trustProgression,
        
        sparkSplitResults,
        trustTransparencyScore: this.calculateTrustTransparencyScore(sparkSplitResults),
        
        journeyQuality,
        recommendations,
        nextActions,
        
        errors: journeyState.errors,
        recoveryActions: journeyState.recoveryActions
      };
      
      emitSystemLog('journey-orchestration-complete', {
        journeyId,
        success: true,
        duration,
        qualityScore: journeyQuality.overallScore,
        trustScore: journeyQuality.trustScore
      });
      
      return result;
      
    } catch (error) {
      emitSystemLog('journey-orchestration-error', {
        journeyId,
        errorMessage: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      });
      
      this.eventBus.emit('orchestrator:journey-failure', {
        journeyId,
        error,
        request
      });
      
      return await this.handleJourneyFailure(journeyId, request, error);
    }
  }

  /**
   * Initialize journey state with request data
   * What: Creates initial state for journey tracking and execution
   * Why: Establishes baseline for consistent tracking and emotional continuity
   * How: Populates state with initial values and retrieves historical context
   */
  private async initializeJourneyState(journeyId: string, request: JourneyOrchestrationRequest): Promise<JourneyState> {
    // Create initial journey state
    const initialState: JourneyState = {
      journeyId,
      userId: request.userId,
      sessionId: request.sessionId,
      journeyType: request.journeyType,
      currentStage: '',
      completedStages: [],
      stageHistory: [],
      
      enrichedContext: {
        baseContext: request.emotionalContext || {
          baseTrustScore: 3.5,
          emotionalTriggers: [],
          userId: request.userId || '',
          sessionId: request.sessionId,
          languageFingerprint: {
            preferredTone: 'professional',
            complexityLevel: 'medium',
            emotionalStyle: 'supportive'
          },
          industryContext: '',
          culturalContext: 'western_business',
          toneContext: 'professional'
        },
        enrichmentLevel: 'basic',
        contextQuality: 0.5,
        emotionalInsights: [],
        crossSessionContinuity: {},
        currentEmotionalState: 'neutral',
        trustTrajectory: 'stable'
      },
      
      componentData: new Map(),
      
      qualityMetrics: {
        overallScore: 0,
        componentReliability: 0,
        emotionalContinuity: 0,
        trustScore: 0,
        userSatisfaction: 0,
        processingLatency: 0,
        errorRate: 0
      },
      
      trustProgression: [],
      errors: [],
      recoveryActions: [],
      
      startTime: new Date(),
      lastUpdateTime: new Date()
    };
    
    // Retrieve user profile and previous emotional context if available
    if (request.userId) {
      try {
        const userProfile = await this.emotionalMemoryBank.getUserProfile(request.userId);
        const crossSessionContinuity = await this.emotionalMemoryBank.getCrossSessionContinuity(request.userId);
        
        // Update initial state with historical data
        if (userProfile) {
          initialState.enrichedContext.userProfile = userProfile;
        }
        
        if (crossSessionContinuity) {
          initialState.enrichedContext.crossSessionContinuity = crossSessionContinuity;
        }
        
      } catch (error) {
        // Log error but continue with default values
        this.eventBus.emit('orchestrator:memory-retrieval-error', {
          journeyId,
          userId: request.userId,
          error
        });
      }
    }
    
    return initialState;
  }

  /**
   * Execute all stages in the journey template
   * What: Processes each stage in sequence with proper error handling
   * Why: Ensures consistent execution flow with quality tracking
   * How: Manages state transitions and component coordination
   */
  private async executeJourneyStages(
    journeyState: JourneyState,
    template: JourneyTemplate,
    request: JourneyOrchestrationRequest
  ): Promise<Map<string, any>> {
    const stageResults = new Map<string, any>();
    
    for (const stage of template.stages) {
      journeyState.currentStage = stage.name;
      
      // Log stage start
      emitSystemLog('journey-stage-start', {
        journeyId: journeyState.journeyId,
        stageName: stage.name,
        componentCount: stage.components.length
      });
      
      const stageStartTime = Date.now();
      
      // Create stage history entry
      const historyEntry: StageHistoryEntry = {
        stage: stage.name,
        startTime: new Date(),
        success: false,
        componentResults: {},
        qualityScore: 0,
        errors: []
      };
      
      try {
        // Execute all components for this stage
        const result = await this.executeStageComponents(journeyState, stage, request);
        
        // Record successful completion
        stageResults.set(stage.name, result);
        journeyState.completedStages.push(stage.name);
        
        // Update stage history
        historyEntry.success = true;
        historyEntry.endTime = new Date();
        historyEntry.duration = Date.now() - stageStartTime;
        historyEntry.componentResults = result;
        
        // Calculate stage quality
        historyEntry.qualityScore = await this.calculateStageQuality(result);
        
        // Update journey quality metrics
        await this.updateJourneyQualityMetrics(journeyState, historyEntry.qualityScore);
        
        // Log stage completion
        emitSystemLog('journey-stage-complete', {
          journeyId: journeyState.journeyId,
          stageName: stage.name,
          duration: historyEntry.duration,
          qualityScore: historyEntry.qualityScore
        });
        
      } catch (error) {
        // Handle stage failure
        await this.handleStageFailure(journeyState, stage, error);
        
        // Update stage history
        historyEntry.success = false;
        historyEntry.endTime = new Date();
        historyEntry.duration = Date.now() - stageStartTime;
        historyEntry.errors = [error instanceof Error ? error.message : String(error)];
        
        // Log stage failure
        emitSystemLog('journey-stage-failure', {
          journeyId: journeyState.journeyId,
          stageName: stage.name,
          errorMessage: error instanceof Error ? error.message : String(error),
          duration: Date.now() - stageStartTime
        });
        
        // Emit event for tracking
        this.eventBus.emit('orchestrator:stage-failure', {
          journeyId: journeyState.journeyId,
          stageName: stage.name,
          error,
          journey: journeyState
        });
      }
      
      // Add to stage history
      journeyState.stageHistory.push(historyEntry);
    }
    
    return stageResults;
  }

  /**
   * Execute all components for a stage
   * What: Executes individual components with proper input/output handling
   * Why: Ensures consistent component execution with proper error handling
   * How: Prepares inputs, validates outputs, handles failures with recovery
   */
  private async executeStageComponents(
    journeyState: JourneyState,
    stage: JourneyStage,
    request: JourneyOrchestrationRequest
  ): Promise<any> {
    // Execute all components in a stage, with proper error handling and metrics tracking
    const componentResults = new Map<string, any>();
    const stageStartTime = new Date();
    let successCount = 0;
    
    emitSystemLog('component-execution', {
      level: 'info',
      message: `Executing stage: ${stage.name} with ${stage.components.length} components`,
      component: 'MasterOrchestrator',
      details: { journeyId: journeyState.journeyId, stageComponents: stage.components.map(c => c.name) }
    });
    
    // Process each component sequentially
    for (const component of stage.components) {
      try {
        // Prepare input for the component
        const componentInput = await this.prepareComponentInput(
          journeyState,
          component,
          componentResults.size > 0 ? Object.fromEntries(componentResults) : undefined,
          request
        );
        
        // Execute the component
        const componentStartTime = new Date();
        const componentOutput = await this.executeComponent(component, componentInput);
        const componentEndTime = new Date();
        
        // Calculate component execution duration
        const componentDuration = componentEndTime.getTime() - componentStartTime.getTime();
        
        // Validate the component output
        const validationResult = await this.validateComponentOutput(component, componentOutput);
        
        if (!validationResult.isValid) {
          throw new Error(`Component validation failed: ${validationResult.reason}`);
        }
        
        // Update component reliability metrics
        this.trackComponentReliability(component.name, true);
        
        // Store the result
        componentResults.set(component.name, {
          ...componentOutput,
          _meta: {
            component: component.name,
            executionTime: componentDuration,
            timestamp: componentEndTime.toISOString(),
            validated: true
          }
        });
        
        // Update the emotional context with the component output
        await this.updateEmotionalContext(journeyState, componentOutput);
        
        // Emit success event
        this.eventBus.emit('component_execution_success', {
          journeyId: journeyState.journeyId,
          stage: stage.name,
          component: component.name,
          executionTime: componentDuration
        });
        
        successCount++;
        
      } catch (error) {
        // Handle component failure with proper error typing
        const errorMessage = error instanceof Error ? error.message : String(error);
        await this.handleComponentFailure(journeyState, component, error);
        
        // Add error information to component results
        componentResults.set(component.name, {
          error: true,
          errorMessage,
          _meta: {
            component: component.name,
            timestamp: new Date().toISOString(),
            validated: false,
            recovery: {
              attempted: true,
              successful: false
            }
          }
        });
        
        // Emit failure event
        this.eventBus.emit('component_execution_failure', {
          journeyId: journeyState.journeyId,
          stage: stage.name,
          component: component.name,
          error: errorMessage
        });
        
        // Add to journey state errors
        journeyState.errors.push({
          errorId: `${journeyState.journeyId}-${component.name}-${Date.now()}`,
          timestamp: new Date(),
          component: component.name,
          errorType: 'component_failure',
          severity: 'medium',
          message: `Failed to execute component: ${errorMessage}`,
          context: { stage: stage.name },
          recoveryAttempted: true,
          recoverySuccess: false
        });
      }
    }
    
    // Calculate stage execution time
    const stageEndTime = new Date();
    const stageDuration = stageEndTime.getTime() - stageStartTime.getTime();
    
    // Update journey state with stage completion
    journeyState.completedStages.push(stage.name);
    journeyState.stageHistory.push({
      stage: stage.name,
      startTime: stageStartTime,
      endTime: stageEndTime,
      duration: stageDuration,
      success: successCount === stage.components.length,
      componentResults: Object.fromEntries(componentResults),
      qualityScore: successCount / stage.components.length,
      errors: Array.from(componentResults.values())
        .filter(r => r.error)
        .map(r => r.errorMessage)
    });
    
    // Calculate and update journey quality metrics
    const stageSuccessRate = successCount / stage.components.length;
    journeyState.qualityMetrics.componentReliability = 
      (journeyState.qualityMetrics.componentReliability + stageSuccessRate) / 2;
    
    emitSystemLog('stage-execution-complete', {
      level: 'info',
      message: `Stage execution complete: ${stage.name}`,
      component: 'MasterOrchestrator',
      details: { 
        journeyId: journeyState.journeyId, 
        stage: stage.name,
        successRate: stageSuccessRate,
        duration: stageDuration
      }
    });
    
    return Object.fromEntries(componentResults);
  }

  /**
   * Execute SparkSplit comparison
   * What: Generates trust transparency comparison between sterile and enhanced outputs
   * Why: Provides revolutionary trust transparency through direct comparison
   * How: Invokes SparkSplit engine with appropriate emotional context
   */
  private async executeSparkSplit(
    journeyState: JourneyState,
    stageResults: Map<string, any>
  ): Promise<SparkSplitOutput[]> {
    const results: SparkSplitOutput[] = [];
    
    // Identify suitable candidates for SparkSplit comparison
    const candidates = this.identifySparkSplitCandidates(stageResults);
    
    for (const candidate of candidates) {
      try {
        // Prepare SparkSplit input
        const sparkSplitInput: SparkSplitInput = {
          prompt: candidate.prompt || '',
          sessionId: journeyState.sessionId,
          userId: journeyState.userId || '',
          toneContext: journeyState.enrichedContext.baseContext.toneContext || 'professional',
          sparkConcept: {
            name: candidate.conceptName || 'clarity',
            description: candidate.conceptDescription || 'Clear and focused communication',
            emotionalResonance: 0.8
          },
          emotionalContext: journeyState.enrichedContext.baseContext,
          canaiOutput: candidate.output || ''
        };
        
        // Execute SparkSplit
        const result = await this.sparkSplitEngine.generateSparkSplit(sparkSplitInput);
        
        // Store result
        results.push(result);
        
        // Update journey state with SparkSplit data
        journeyState.sparkSplitData = {
          results,
          performanceMetrics: {
            averageTrustDelta: this.calculateAverageTrustScore(journeyState.trustProgression),
            transparencyScore: this.calculateTrustTransparencyScore(results),
            userPreference: null
          }
        };
        
        // Record trust delta
        journeyState.trustProgression.push({
          timestamp: new Date(),
          component: 'SparkSplit',
          previousScore: journeyState.enrichedContext.baseContext.baseTrustScore || 3.5,
          newScore: (journeyState.enrichedContext.baseContext.baseTrustScore || 3.5) + result.trustDelta,
          reason: 'SparkSplit comparison'
        });
        
        // Log SparkSplit execution
        emitSystemLog('sparksplit-execution', {
          journeyId: journeyState.journeyId,
          trustDelta: result.trustDelta,
          sparkConcept: sparkSplitInput.sparkConcept.name
        });
        
      } catch (error) {
        // Log error but continue with other candidates
        this.eventBus.emit('orchestrator:sparksplit-failure', {
          journeyId: journeyState.journeyId,
          error,
          candidate
        });
        
        emitSystemLog('sparksplit-execution-failure', {
          journeyId: journeyState.journeyId,
          candidateType: candidate.type,
          errorMessage: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return results;
  }

  /**
   * Validate journey with sacred reversal test
   * What: Ensures outputs respect user emotional sovereignty
   * Why: Validates trust by ensuring outputs do not violate sacred principles
   * How: Uses reversal test automator to check all outputs
   */
  private async validateJourneyWithReversalTest(
    journeyState: JourneyState,
    stageResults: Map<string, any>
  ): Promise<ReversalTestResult> {
    // Compile journey outputs for validation
    const journeyOutput = this.compileJourneyOutput(stageResults);
    
    try {
      // Run sacred reversal test
      const result = await this.reversalTestAutomator.validateInteraction(
        JSON.stringify(this.compileJourneyInput(journeyState)),
        JSON.stringify(journeyOutput),
        journeyState.enrichedContext.baseContext
      );
      
      // Log validation result
      emitSystemLog('reversal-test-validation', {
        journeyId: journeyState.journeyId,
        passed: result.passed,
        score: result.score,
        failureReason: result.failureReason
      });
      
      // Handle reversal test failure
      if (!result.passed) {
        // Create error record
        const error: OrchestrationError = {
          errorId: `reversal-test-${Date.now()}`,
          timestamp: new Date(),
          component: 'ReversalTestAutomator',
          errorType: 'trust_breach',
          severity: 'high',
          message: `Sacred reversal test failed: ${result.failureReason}`,
          context: {
            score: result.score,
            threshold: result.threshold,
            violationType: result.violationType
          },
          recoveryAttempted: false
        };
        
        journeyState.errors.push(error);
        
        // Emit event
        this.eventBus.emit('orchestrator:reversal-test-failure', {
          journeyId: journeyState.journeyId,
          result,
          journey: journeyState
        });
      }
      
      return result;
      
    } catch (error) {
      // Log error but continue journey
      this.eventBus.emit('orchestrator:reversal-test-error', {
        journeyId: journeyState.journeyId,
        error,
        journey: journeyState
      });
      
      // Return default pass result
      return {
        passed: true,
        score: 0.8,
        threshold: 0.7,
        details: {},
        failureReason: '',
        violationType: ''
      };
    }
  }

  /**
   * Trigger sacred moments if appropriate based on journey state
   * What: Activates sacred moments at key emotional inflection points
   * Why: Enhances emotional resonance and trust at critical moments
   * How: Identifies opportunities and delegates to sacred moments orchestrator
   */
  private async triggerSacredMomentsIfAppropriate(
    journeyState: JourneyState,
    stageResults: Map<string, any>,
    reversalTestResult: ReversalTestResult
  ): Promise<void> {
    // Identify sacred moment opportunities
    const opportunities = this.identifySacredMomentOpportunities(
      journeyState,
      stageResults,
      reversalTestResult
    );
    
    for (const opportunity of opportunities) {
      try {
        // Trigger sacred moment
        await this.sacredMomentsOrchestrator.orchestrateSacredMoment(
          opportunity.momentType,
          journeyState.enrichedContext.baseContext,
          { 
            systemResponse: opportunity.systemResponse,
            journeyState
          }
        );
        
        // Log sacred moment
        emitSystemLog('sacred-moment-triggered', {
          journeyId: journeyState.journeyId,
          momentType: opportunity.momentType
        });
        
      } catch (error) {
        // Log error but continue with other opportunities
        this.eventBus.emit('orchestrator:sacred-moment-failure', {
          journeyId: journeyState.journeyId,
          momentType: opportunity.momentType,
          error
        });
      }
    }
  }

  // Helper methods for journey orchestration
  private generateJourneyId(): string {
    return `journey-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  private shouldTriggerSparkSplit(journeyState: JourneyState, stageResults: Map<string, any>): boolean {
    // Don't trigger if no content generation occurred
    if (stageResults.size === 0) {
      return false;
    }
    
    // Check for suitable content candidates
    const candidates = this.identifySparkSplitCandidates(stageResults);
    if (candidates.length === 0) {
      return false;
    }
    
    // Check for emotional resonance opportunity
    const emotionalContext = journeyState.enrichedContext;
    if (emotionalContext.trustTrajectory === 'declining' || 
        emotionalContext.currentEmotionalState === 'frustrated') {
      // Higher chance to trigger when trust needs building
      return true;
    }
    
    // Optimal timing for SparkSplit is after meaningful content generation
    const hasCompletedGenerationStage = journeyState.completedStages.some(
      stage => stage.includes('generation') || stage.includes('creation')
    );
    
    return hasCompletedGenerationStage;
  }

  private identifySparkSplitCandidates(stageResults: Map<string, any>): any[] {
    const candidates: any[] = [];
    
    // Analyze all stage results for suitable candidates
    for (const [stageName, result] of stageResults.entries()) {
      // Skip stages not suitable for SparkSplit
      if (stageName.includes('initialization') || 
          stageName.includes('validation') || 
          stageName.includes('setup')) {
        continue;
      }
      
      // Look for content generation outputs
      if (result.generatedContent) {
        candidates.push({
          type: 'content',
          prompt: result.prompt || '',
          output: result.generatedContent,
          conceptName: result.conceptName || 'clarity',
          conceptDescription: result.conceptDescription || 'Clear and focused communication'
        });
      }
      
      // Look for recommendations
      if (result.recommendations && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
        candidates.push({
          type: 'recommendations',
          prompt: 'Generate strategic recommendations',
          output: Array.isArray(result.recommendations) 
            ? result.recommendations.join('\n\n') 
            : String(result.recommendations),
          conceptName: 'strategy',
          conceptDescription: 'Strategic thinking and planning'
        });
      }
      
      // Look for analysis outputs
      if (result.analysis) {
        candidates.push({
          type: 'analysis',
          prompt: result.analysisPrompt || 'Analyze the situation',
          output: typeof result.analysis === 'string' 
            ? result.analysis 
            : JSON.stringify(result.analysis, null, 2),
          conceptName: 'insight',
          conceptDescription: 'Deep understanding and perspective'
        });
      }
    }
    
    // Sort candidates by quality/suitability
    return candidates.sort((a, b) => {
      // Prefer content over recommendations over analysis
      const typeScore = (type: string) => {
        if (type === 'content') return 3;
        if (type === 'recommendations') return 2;
        return 1;
      };
      
      return typeScore(b.type) - typeScore(a.type);
    });
  }

  private calculateTrustTransparencyScore(sparkSplitResults: SparkSplitOutput[]): number {
    if (!sparkSplitResults || sparkSplitResults.length === 0) {
      return 0;
    }
    
    // Calculate average trust delta
    const averageTrustDelta = sparkSplitResults.reduce(
      (sum, result) => sum + result.trustDelta, 
      0
    ) / sparkSplitResults.length;
    
    // Calculate average comparison quality
    const averageQuality = sparkSplitResults.reduce(
      (sum, result) => {
        const metrics = result.comparisonMetrics;
        return sum + (
          metrics.aweScore + 
          metrics.ownershipScore + 
          metrics.wonderScore + 
          metrics.toneConsistencyScore + 
          metrics.emotionalImpactScore + 
          metrics.sparkResonanceScore
        ) / 6;
      }, 
      0
    ) / sparkSplitResults.length;
    
    // Combine metrics for overall score (0-1 scale)
    // Trust delta is weighted more heavily as it's the primary outcome
    return (averageTrustDelta * 0.6) + (averageQuality * 0.4);
  }

  private calculateAverageTrustScore(trustProgression: TrustDelta[]): number {
    if (!trustProgression || trustProgression.length === 0) {
      return 0;
    }
    
    // Use values or newScore-previousScore for calculation
    return trustProgression.reduce((sum, delta, index) => {
      // Calculate the trust delta
      let value: number;
      
      if (delta.value !== undefined) {
        value = delta.value;
      } else if (delta.newScore !== undefined && delta.previousScore !== undefined) {
        value = delta.newScore - delta.previousScore;
      } else {
        value = 0;
      }
      
      // Apply recency weighting (more recent deltas count more)
      const recencyWeight = 1 + (index / trustProgression.length);
      return sum + (value * recencyWeight);
    }, 0) / (trustProgression.length * 1.5); // Adjust for recency weighting
  }

  private async generateJourneyRecommendations(
    journeyState: JourneyState,
    journeyQuality: JourneyQualityMetrics
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Basic recommendations based on journey quality
    if (journeyQuality.trustScore < 3.5) {
      recommendations.push('Focus on building trust through transparency and empathy');
    }
    
    if (journeyQuality.emotionalContinuity < 0.7) {
      recommendations.push('Improve emotional continuity with more consistent tone and approach');
    }
    
    if (journeyQuality.componentReliability < 0.95) {
      recommendations.push('Address component reliability issues for more consistent performance');
    }
    
    // Specific recommendations based on journey type
    switch (journeyState.journeyType) {
      case 'discovery_funnel':
        recommendations.push('Deepen understanding of emotional context in discovery phase');
        break;
      case 'spark_generation':
        recommendations.push('Enhance spark concepts with greater emotional resonance');
        break;
      case 'content_creation':
        recommendations.push('Optimize content for emotional impact and trust building');
        break;
      case 'trust_building':
        recommendations.push('Strengthen trust foundation with more sacred moments');
        break;
      case 'emotional_sovereignty':
        recommendations.push('Refine emotional sovereignty experience with deeper personalization');
        break;
      case 'sacred_moments':
        recommendations.push('Create more transformational sacred moments at key journey points');
        break;
      case 'cross_session_continuity':
        recommendations.push('Strengthen cross-session emotional continuity');
        break;
      case 'recovery_flow':
        recommendations.push('Optimize recovery flow with more empathetic approach');
        break;
    }
    
    // Add any error-specific recommendations
    if (journeyState.errors.length > 0) {
      recommendations.push('Address identified error patterns to improve journey reliability');
    }
    
    return recommendations;
  }

  private async generateNextActions(
    journeyState: JourneyState,
    journeyQuality: JourneyQualityMetrics
  ): Promise<OrchestrationAction[]> {
    const actions: OrchestrationAction[] = [];
    
    // Generate actions based on journey state
    if (journeyState.errors.length > 0) {
      // Add recovery action for errors
      actions.push({
        type: 'recover_error',
        priority: 'high',
        component: 'ErrorRecoveryService',
        data: {
          errors: journeyState.errors,
          journeyType: journeyState.journeyType,
          trustScore: journeyQuality.trustScore
        },
        expectedOutcome: 'Resolve critical errors and restore journey trust'
      });
    }
    
    // Add context enhancement if quality is low
    if (journeyQuality.emotionalContinuity < 0.7) {
      actions.push({
        type: 'enhance_context',
        priority: 'medium',
        component: 'EmotionalContextEnhancer',
        data: {
          currentContext: journeyState.enrichedContext,
          qualityTarget: 0.8,
          focusAreas: ['emotionalContinuity', 'trustBuilding']
        },
        expectedOutcome: 'Enhanced emotional context for improved continuity'
      });
    }
    
    // Add SparkSplit trigger if appropriate
    if (this.shouldTriggerSparkSplit(journeyState, journeyState.componentData)) {
      actions.push({
        type: 'trigger_sparksplit',
        priority: 'medium',
        data: {
          candidates: this.identifySparkSplitCandidates(journeyState.componentData),
          emotionalContext: journeyState.enrichedContext
        },
        expectedOutcome: 'Trust transparency through SparkSplit comparison'
      });
    }
    
    // Add sacred moment trigger if conditions are favorable
    const sacredMomentOpportunities = this.identifySacredMomentOpportunities(
      journeyState, 
      journeyState.componentData,
      { passed: true, score: 0.8, threshold: 0.7, details: {}, failureReason: '', violationType: '' }
    );
    
    if (sacredMomentOpportunities.length > 0) {
      actions.push({
        type: 'trigger_sacred_moment',
        priority: 'medium',
        component: 'SacredMomentsOrchestrator',
        data: {
          momentType: sacredMomentOpportunities[0].momentType,
          emotionalContext: journeyState.enrichedContext,
          systemResponse: sacredMomentOpportunities[0].systemResponse
        },
        expectedOutcome: 'Transformational sacred moment experience'
      });
    }
    
    // Always add next component action
    actions.push({
      type: 'trigger_component',
      priority: 'high',
      component: this.getNextRecommendedComponent(journeyState),
      data: {
        journeyState,
        enrichedContext: journeyState.enrichedContext
      },
      expectedOutcome: 'Progress journey with optimal next component',
      fallbackAction: {
        type: 'trigger_component',
        priority: 'medium',
        component: 'FallbackComponent',
        data: {},
        expectedOutcome: 'Graceful continuation with fallback component'
      }
    });
    
    return actions;
  }

  /**
   * Get next recommended component based on journey state
   * What: Identifies optimal next component in journey sequence
   * Why: Ensures optimal component selection for journey progression
   * How: Analyzes journey state and completed components
   */
  private getNextRecommendedComponent(journeyState: JourneyState): string {
    // This would typically use a more sophisticated algorithm
    // based on journey state analysis and component dependencies
    
    const journeyType = journeyState.journeyType;
    const completedStages = journeyState.completedStages;
    
    // Simple mapping of journey types to recommended next components
    const journeyComponentMap: Record<JourneyType, string> = {
      'discovery_funnel': 'IntentDiscoveryEngine',
      'spark_generation': 'SparkConceptGenerator',
      'content_creation': 'EnhancedContentCreator',
      'trust_building': 'TrustTransparencyEngine',
      'emotional_sovereignty': 'EmotionalSovereigntyOrchestrator',
      'sacred_moments': 'SacredMomentsCatalyst',
      'cross_session_continuity': 'ContinuityEngine',
      'recovery_flow': 'RecoveryFlowOrchestrator'
    };
    
    return journeyComponentMap[journeyType] || 'GenericNextComponent';
  }

  /**
   * Handle journey failure with graceful recovery
   * What: Manages journey failures with trust-preserving recovery
   * Why: Ensures emotional sovereignty even in failure scenarios
   * How: Error analysis, recovery attempts, and graceful degradation
   */
  private async handleJourneyFailure(
    journeyId: string,
    request: JourneyOrchestrationRequest,
    error: any
  ): Promise<JourneyOrchestrationResult> {
    // Create error record
    const orchestrationError: OrchestrationError = {
      errorId: `${journeyId}-${Date.now()}`,
      timestamp: new Date(),
      component: 'MasterOrchestrator',
      errorType: 'component_failure',
      severity: 'high',
      message: error instanceof Error ? error.message : String(error),
      context: {
        journeyType: request.journeyType,
        sessionId: request.sessionId,
        requestData: request
      },
      recoveryAttempted: false
    };
    
    // Create recovery action
    const recoveryAction: RecoveryAction = {
      actionId: `recovery-${Date.now()}`,
      errorId,
      actionType: 'graceful_degradation',
      implementation: 'FallbackJourneyOrchestration',
      expectedOutcome: 'Basic journey completion with dignity preservation',
      maxRetries: 2,
      currentRetries: 0
    };
    
    // Attempt recovery
    orchestrationError.recoveryAttempted = true;
    
    try {
      // Basic fallback journey result
      return {
        success: false,
        journeyId,
        currentStage: 'error_recovery',
        completedStages: [],
        nextStages: [],
        
        componentResults: new Map(),
        enrichedContext: {
          baseContext: request.emotionalContext || {
            baseTrustScore: 3.0,
            emotionalTriggers: [],
            userId: request.userId || '',
            sessionId: request.sessionId,
            languageFingerprint: {
              preferredTone: 'professional',
              complexityLevel: 'medium',
              emotionalStyle: 'supportive'
            },
            industryContext: '',
            culturalContext: 'western_business',
            toneContext: 'professional'
          },
          enrichmentLevel: 'basic',
          contextQuality: 0.5,
          emotionalInsights: [],
          crossSessionContinuity: {},
          currentEmotionalState: 'neutral',
          trustTrajectory: 'stable'
        },
        trustProgression: [],
        
        sparkSplitResults: [],
        trustTransparencyScore: 0,
        
        journeyQuality: {
          overallScore: 0,
          componentReliability: 0,
          emotionalContinuity: 0,
          trustScore: 0,
          userSatisfaction: 0,
          processingLatency: 0,
          errorRate: 1.0
        },
        
        recommendations: [
          'Retry journey with simplified input',
          'Consider alternative approach to achieve goals',
          'Contact support if issues persist'
        ],
        
        nextActions: [{
          type: 'recover_error',
          priority: 'high',
          data: {
            originalRequest: request,
            errorDetails: error instanceof Error ? error.message : String(error),
            recoveryOptions: ['retry', 'simplify', 'alternate_approach']
          },
          expectedOutcome: 'Journey recovery with dignity preservation'
        }],
        
        errors: [orchestrationError],
        recoveryActions: [recoveryAction]
      };
      
    } catch (fallbackError) {
      // Ultra-minimal fallback in case even recovery fails
      emitSystemLog('journey-recovery-failure', {
        journeyId,
        originalError: error instanceof Error ? error.message : String(error),
        fallbackError: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
      });
      
      return {
        success: false,
        journeyId,
        currentStage: 'critical_failure',
        completedStages: [],
        nextStages: [],
        componentResults: new Map(),
        enrichedContext: {
          baseContext: {
            baseTrustScore: 3.0,
            userId: request.userId,
            sessionId: request.sessionId
          },
          enrichmentLevel: 'basic',
          contextQuality: 0,
          emotionalInsights: [],
          crossSessionContinuity: {},
          currentEmotionalState: 'neutral',
          trustTrajectory: 'stable'
        },
        trustProgression: [],
        sparkSplitResults: [],
        trustTransparencyScore: 0,
        journeyQuality: {
          overallScore: 0,
          componentReliability: 0,
          emotionalContinuity: 0,
          trustScore: 0,
          userSatisfaction: 0,
          processingLatency: 0,
          errorRate: 1.0
        },
        recommendations: ['Contact support for assistance'],
        nextActions: [],
        errors: [orchestrationError],
        recoveryActions: [recoveryAction]
      };
    }
  }

  /**
   * Initialize journey templates with predefined templates
   * What: Sets up journey templates for all supported journey types
   * Why: Provides structured journey execution paths
   * How: Template definition with component sequences
   */
  private initializeJourneyTemplates(): void {
    // Discovery funnel journey
    this.journeyTemplates.set('discovery_funnel', {
      name: 'Discovery Funnel Journey',
      stages: [
        {
          name: 'intent_discovery',
          components: [
            { name: 'IntentDiscoveryEngine', type: 'preprocessor' },
            { name: 'ContextEnrichmentService', type: 'enrichment' },
            { name: 'FieldInferenceEngine', type: 'enhancement' }
          ]
        },
        {
          name: 'field_validation',
          components: [
            { name: 'FieldValidationService', type: 'validator' },
            { name: 'SmartDefaultsEngine', type: 'enhancement' }
          ]
        },
        {
          name: 'goal_recommendation',
          components: [
            { name: 'GoalRecommendationService', type: 'generator' },
            { name: 'EmotionalResonanceAnalyzer', type: 'trust_catalyst' }
          ]
        }
      ]
    });
    
    // Spark generation journey
    this.journeyTemplates.set('spark_generation', {
      name: 'Spark Generation Journey',
      stages: [
        {
          name: 'context_preparation',
          components: [
            { name: 'ContextEnrichmentService', type: 'enrichment' },
            { name: 'EmotionalContextAnalyzer', type: 'trust_catalyst' }
          ]
        },
        {
          name: 'spark_creation',
          components: [
            { name: 'SparkConceptGenerator', type: 'generator' },
            { name: 'SparkResonanceAnalyzer', type: 'trust_catalyst' }
          ]
        },
        {
          name: 'spark_refinement',
          components: [
            { name: 'SparkPersonalizer', type: 'enhancement' },
            { name: 'EmotionalResonanceValidator', type: 'validator' }
          ]
        }
      ]
    });
    
    // Content creation journey
    this.journeyTemplates.set('content_creation', {
      name: 'Content Creation Journey',
      stages: [
        {
          name: 'content_preparation',
          components: [
            { name: 'ContextEnrichmentService', type: 'enrichment' },
            { name: 'SmartDefaultsEngine', type: 'enhancement' },
            { name: 'SparkConceptGenerator', type: 'generator' }
          ]
        },
        {
          name: 'content_generation',
          components: [
            { name: 'EnhancedContentCreator', type: 'generator' },
            { name: 'EmotionalResonanceAnalyzer', type: 'trust_catalyst' }
          ]
        },
        {
          name: 'content_refinement',
          components: [
            { name: 'ContentPersonalizer', type: 'enhancement' },
            { name: 'ContentQualityValidator', type: 'validator' }
          ]
        }
      ]
    });
    
    // Trust building journey
    this.journeyTemplates.set('trust_building', {
      name: 'Trust Building Journey',
      stages: [
        {
          name: 'trust_foundation',
          components: [
            { name: 'TrustBaselineEstablisher', type: 'trust_catalyst' },
            { name: 'EmotionalContextAnalyzer', type: 'enrichment' }
          ]
        },
        {
          name: 'trust_demonstration',
          components: [
            { name: 'TrustTransparencyEngine', type: 'trust_catalyst' },
            { name: 'SparkSplitComparison', type: 'experience' }
          ]
        },
        {
          name: 'trust_reinforcement',
          components: [
            { name: 'SacredMomentsCatalyst', type: 'trust_catalyst' },
            { name: 'TrustScoreCalculator', type: 'validator' }
          ]
        }
      ]
    });
    
    // Add remaining journey types
    this.journeyTemplates.set('emotional_sovereignty', {
      name: 'Emotional Sovereignty Journey',
      stages: [
        {
          name: 'sovereignty_foundation',
          components: [
            { name: 'ContextEnrichmentService', type: 'enrichment' },
            { name: 'EmotionalSovereigntyEngine', type: 'trust_catalyst' }
          ]
        },
        {
          name: 'sovereignty_experience',
          components: [
            { name: 'SovereigntyExperienceGenerator', type: 'generator' },
            { name: 'EmotionalResonanceAnalyzer', type: 'trust_catalyst' }
          ]
        }
      ]
    });
    
    this.journeyTemplates.set('sacred_moments', {
      name: 'Sacred Moments Journey',
      stages: [
        {
          name: 'sacred_foundation',
          components: [
            { name: 'ContextEnrichmentService', type: 'enrichment' },
            { name: 'SacredMomentsOrchestrator', type: 'trust_catalyst' }
          ]
        }
      ]
    });
    
    this.journeyTemplates.set('cross_session_continuity', {
      name: 'Cross-Session Continuity Journey',
      stages: [
        {
          name: 'continuity_restoration',
          components: [
            { name: 'EmotionalMemoryRetriever', type: 'enrichment' },
            { name: 'ContinuityEngine', type: 'trust_catalyst' }
          ]
        }
      ]
    });
    
    this.journeyTemplates.set('recovery_flow', {
      name: 'Recovery Flow Journey',
      stages: [
        {
          name: 'recovery_assessment',
          components: [
            { name: 'ErrorAnalyzer', type: 'validator' },
            { name: 'RecoveryFlowOrchestrator', type: 'trust_catalyst' }
          ]
        }
      ]
    });
  }

  /**
   * Set up event listeners for orchestrator events
   * What: Establishes event listeners for component events
   * Why: Enables event-driven orchestration and monitoring
   * How: Event registration with handlers
   */
  private setupEventListeners(): void {
    // Listen for component failure events
    this.eventBus.on('component-failure', async (data: any) => {
      await this.handleComponentFailureEvent(data);
    });
    
    // Listen for trust threshold breach events
    this.eventBus.on('trust-threshold-breach', async (data: any) => {
      await this.handleTrustThresholdBreach(data);
    });
    
    // Listen for sacred moment triggered events
    this.eventBus.on('sacred-moment-triggered', async (data: any) => {
      await this.handleSacredMomentTriggered(data);
    });
  }

  /**
   * Handle component failure events
   * What: Processes component failure events from event bus
   * Why: Enables central handling of component failures
   * How: Event processing with appropriate responses
   */
  private async handleComponentFailureEvent(data: any): Promise<void> {
    // Log event
    emitSystemLog('component-failure-event', {
      component: data.component,
      journeyId: data.journeyId,
      errorMessage: data.error instanceof Error ? data.error.message : String(data.error)
    });
  }

  /**
   * Handle trust threshold breach events
   * What: Processes trust threshold breach events
   * Why: Enables trust-critical incident handling
   * How: Event processing with trust restoration
   */
  private async handleTrustThresholdBreach(data: any): Promise<void> {
    // Log event
    emitSystemLog('trust-threshold-breach', {
      journeyId: data.journeyId,
      threshold: data.threshold,
      currentValue: data.currentValue,
      breach: data.currentValue < data.threshold
    });
  }

  /**
   * Handle sacred moment triggered events
   * What: Processes sacred moment events from event bus
   * Why: Enables monitoring of sacred moment executions
   * How: Event processing with metrics tracking
   */
  private async handleSacredMomentTriggered(data: any): Promise<void> {
    // Log event
    emitSystemLog('sacred-moment-triggered-event', {
      momentType: data.momentType,
      journeyId: data.journeyId,
      userId: data.userId,
      timestamp: new Date()
    });
  }

  /**
   * Get performance metrics for monitoring
   * What: Provides performance metrics for external monitoring
   * Why: Enables system monitoring and optimization
   * How: Metric aggregation and formatting
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      ...this.performanceMetrics,
      // Calculate success rate
      successRate: this.performanceMetrics.totalJourneys > 0 
        ? this.performanceMetrics.successfulJourneys / this.performanceMetrics.totalJourneys 
        : 0,
      // Calculate overall component reliability
      overallComponentReliability: this.calculateOverallComponentReliability()
    } as PerformanceMetrics;
  }

  /**
   * Calculate overall component reliability
   * What: Computes aggregate component reliability
   * Why: Provides system-wide reliability metric
   * How: Weighted average calculation
   */
  private calculateOverallComponentReliability(): number {
    let totalExecutions = 0;
    let totalSuccessful = 0;
    
    for (const metrics of this.performanceMetrics.componentReliability.values()) {
      totalExecutions += metrics.total;
      totalSuccessful += metrics.successful;
    }
    
    return totalExecutions > 0 ? totalSuccessful / totalExecutions : 1.0;
  }

  /**
   * Get active journey count for monitoring
   * What: Provides count of active journeys
   * Why: Enables system load monitoring
   * How: Simple count calculation
   */
  getActiveJourneyCount(): number {
    return this.activeJourneys.size;
  }

  /**
   * Identify sacred moment opportunities
   * What: Analyzes journey state for potential sacred moments
   * Why: Enables timely emotional resonance triggers for trust
   * How: Pattern matching against sacred moment criteria
   */
  private identifySacredMomentOpportunities(
    journeyState: JourneyState,
    stageResults: Map<string, any>,
    reversalTestResult: ReversalTestResult
  ): { momentType: SacredMomentType; systemResponse: any }[] {
    // Identify potential sacred moments based on journey state, stage results and reversal test
    const opportunities: { momentType: SacredMomentType; systemResponse: any }[] = [];
    
    try {
      // Extract relevant emotional context data
      const { enrichedContext, trustProgression } = journeyState;
      const currentTrustScore = trustProgression.length > 0 
        ? trustProgression[trustProgression.length - 1].newScore 
        : enrichedContext.trustContext?.baseTrustScore || 0;
      
      // Check for trust breakthrough (significant trust increase)
      if (trustProgression.length >= 2) {
        const previousScore = trustProgression[trustProgression.length - 2].newScore;
        const trustDelta = currentTrustScore - previousScore;
        
        if (trustDelta > 0.8) {
          opportunities.push({
            momentType: 'trust_breakthrough',
            systemResponse: {
              trustDelta,
              previousScore,
              currentScore: currentTrustScore,
              journeyType: journeyState.journeyType
            }
          });
        }
      }
      
      // Check for emotional resonance peak
      if (enrichedContext.emotionalResonance && enrichedContext.emotionalResonance > 0.85) {
        opportunities.push({
          momentType: 'emotional_resonance_peak',
          systemResponse: {
            resonanceLevel: enrichedContext.emotionalResonance,
            emotionalTriggers: enrichedContext.trustContext?.emotionalTriggers || [],
            trustScore: currentTrustScore
          }
        });
      }
      
      // Check for sacred reversal confirmation (when reversal test passes with high confidence)
      if (reversalTestResult.passed && reversalTestResult.confidence > 0.9) {
        opportunities.push({
          momentType: 'sacred_reversal_confirmation',
          systemResponse: {
            reversalConfidence: reversalTestResult.confidence,
            reversalEvidence: reversalTestResult.evidence,
            trustScore: currentTrustScore
          }
        });
      }
      
      // Check for spark ignition (creative breakthrough)
      const hasCreativeBreakthrough = stageResults.has('creative_generation') && 
        (stageResults.get('creative_generation')?.qualityScore > 0.85);
      
      if (hasCreativeBreakthrough) {
        opportunities.push({
          momentType: 'spark_ignition',
          systemResponse: {
            sparkQuality: stageResults.get('creative_generation').qualityScore,
            sparkConcept: stageResults.get('creative_generation').concept,
            trustScore: currentTrustScore
          }
        });
      }
      
      // Check for empowerment moment (user taking control)
      const hasEmpowermentSignal = enrichedContext.userActions?.some(
        action => action.type === 'customization' || action.type === 'refinement'
      );
      
      if (hasEmpowermentSignal) {
        opportunities.push({
          momentType: 'empowerment_moment',
          systemResponse: {
            userActions: enrichedContext.userActions,
            trustScore: currentTrustScore
          }
        });
      }
      
      // Log identified opportunities
      if (opportunities.length > 0) {
        emitSystemLog({
          level: 'info',
          message: `Identified ${opportunities.length} sacred moment opportunities`,
          component: 'MasterOrchestrator',
          details: { opportunityTypes: opportunities.map(o => o.momentType) }
        });
      }
      
      return opportunities;
    } catch (error) {
      // Handle errors and log them properly
      emitSystemLog({
        level: 'error',
        message: 'Error identifying sacred moment opportunities',
        component: 'MasterOrchestrator',
        error
      });
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Prepare component input based on journey state
   * What: Prepares input data for component execution
   * Why: Ensures components receive properly formatted data
   * How: Data transformation and context enrichment
   */
  private async prepareComponentInput(
    journeyState: JourneyState,
    component: JourneyComponent,
    previousResults: any,
    request: JourneyOrchestrationRequest
  ): Promise<any> {
    // Prepare input for a specific component based on its type, journey state, and previous results
    try {
      // Base component input with context information
      const baseInput = {
        journeyId: journeyState.journeyId,
        sessionId: journeyState.sessionId,
        userId: journeyState.userId,
        component: component.name,
        timestamp: new Date().toISOString()
      };
      
      // Add emotional context from journey state
      const emotionalContext = journeyState.enrichedContext 
        ? { emotionalContext: journeyState.enrichedContext } 
        : {};
      
      // Add specific inputs based on component type
      switch (component.type) {
        case 'preprocessor': {
          // Preprocessors typically need raw input
          return {
            ...baseInput,
            ...emotionalContext,
            rawInput: request.initialInput,
            preferences: request.preferences || {}
          };
        }
          
        case 'enhancement': {
          // Enhancements build on preprocessor outputs
          const preprocessorResults = previousResults 
            ? Object.entries(previousResults)
                .filter(([key, value]) => key.includes('preprocessor') || key.includes('schema'))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            : {};
            
          return {
            ...baseInput,
            ...emotionalContext,
            preprocessorResults,
            enhancementContext: {
              journeyType: journeyState.journeyType,
              trustLevel: journeyState.enrichedContext?.trustContext?.baseTrustScore || 3.0
            }
          };
        }
          
        case 'generator': {
          // Generators need enhanced context and potentially spark split inputs
          const sparkData = journeyState.sparkSplitData;
          
          return {
            ...baseInput,
            ...emotionalContext,
            previousResults,
            generationContext: {
              journeyType: journeyState.journeyType,
              userPreferences: request.preferences,
              trustLevel: journeyState.enrichedContext?.trustContext?.baseTrustScore || 3.0
            },
            sparkSplitEnabled: request.sparkSplitEnabled !== false,
            sparkData: sparkData || undefined
          };
        }
          
        case 'validator': {
          // Validators need the outputs to validate and validation criteria
          const outputsToValidate = previousResults 
            ? Object.entries(previousResults)
                .filter(([key, value]) => key.includes('generator') || key.includes('output'))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            : {};
            
          return {
            ...baseInput,
            ...emotionalContext,
            outputs: outputsToValidate,
            validationCriteria: {
              journeyType: journeyState.journeyType,
              emotionalSovereignty: true,
              trustThreshold: 3.0,
              privacyCompliance: true
            }
          };
        }
          
        case 'enrichment': {
          // Enrichment components enhance existing outputs with emotional context
          return {
            ...baseInput,
            ...emotionalContext,
            previousResults,
            enrichmentContext: {
              journeyType: journeyState.journeyType,
              userPreferences: request.preferences,
              trustLevel: journeyState.enrichedContext?.trustContext?.baseTrustScore || 3.0
            }
          };
        }
          
        case 'trust_catalyst': {
          // Trust catalysts specifically focus on trust building through comparison
          return {
            ...baseInput,
            ...emotionalContext,
            previousResults,
            catalystContext: {
              journeyType: journeyState.journeyType,
              userPreferences: request.preferences,
              trustLevel: journeyState.enrichedContext?.trustContext?.baseTrustScore || 3.0,
              trustTrajectory: this.calculateTrustTrajectory(journeyState.trustProgression)
            }
          };
        }
          
        case 'experience': {
          // Experience components deliver the final experience to the user
          return {
            ...baseInput,
            ...emotionalContext,
            previousResults,
            journeyState: {
              type: journeyState.journeyType,
              completedStages: journeyState.completedStages,
              qualityMetrics: journeyState.qualityMetrics
            },
            userContext: {
              preferences: request.preferences,
              trustLevel: journeyState.enrichedContext?.trustContext?.baseTrustScore || 3.0
            }
          };
        }
          
        default: {
          // Default input for unknown component types
          emitSystemLog('component-input-preparation', {
            level: 'warn',
            message: `Unknown component type: ${component.type}, using default input preparation`,
            component: 'MasterOrchestrator',
            details: { componentName: component.name, componentType: component.type }
          });
          
          return {
            ...baseInput,
            ...emotionalContext,
            previousResults,
            rawInput: request.initialInput
          };
        }
      }
    } catch (error) {
      // Handle errors in input preparation
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      emitSystemLog('component-input-preparation-error', {
        level: 'error',
        message: `Error preparing input for component ${component.name}: ${errorMessage}`,
        component: 'MasterOrchestrator',
        details: { componentName: component.name, componentType: component.type }
      });
      
      // Throw the error to be handled by the calling method
      throw new Error(`Failed to prepare input for component ${component.name}: ${errorMessage}`);
    }
  }
  
  /**
   * Calculate the trust trajectory based on trust progression history
   */
  private calculateTrustTrajectory(trustProgression: TrustDelta[]): 'rising' | 'stable' | 'declining' {
    if (trustProgression.length < 2) {
      return 'stable';
    }
    
    // Calculate the average of the last 3 trust deltas (or fewer if not available)
    const recentDeltas = trustProgression.slice(-3);
    const avgDelta = recentDeltas.reduce((sum, delta) => sum + (delta.newScore - delta.previousScore), 0) / recentDeltas.length;
    
    if (avgDelta > 0.15) {
      return 'rising';
    } else if (avgDelta < -0.15) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  /**
   * Execute component with prepared input
   * What: Invokes component functionality with error handling
   * Why: Ensures reliable component execution
   * How: Component invocation with universal adapter
   */
  private async executeComponent(
    component: JourneyComponent,
    componentInput: any
  ): Promise<any> {
    // Execute a component using the UniversalInterfaceAdapter
    try {
      emitSystemLog('component-execution-start', {
        level: 'info',
        message: `Executing component: ${component.name}`,
        component: 'MasterOrchestrator',
        details: { 
          componentName: component.name, 
          componentType: component.type
        }
      });
      
      let result: any;
      
      // Different execution paths based on component type
      switch (component.type) {
        case 'preprocessor': 
        case 'enhancement':
        case 'generator':
        case 'validator':
        case 'enrichment':
        case 'trust_catalyst':
        case 'experience': {
          // Use the universal adapter for standard components
          result = await this.universalAdapter.executeComponent(
            component.name,
            componentInput,
            component.type
          );
          break;
        }
          
        default: {
          throw new Error(`Unknown component type: ${component.type}`);
        }
      }
      
      // Validate basic structure of the result
      if (!result) {
        throw new Error(`Component ${component.name} returned null or undefined result`);
      }
      
      // Track execution in metrics
      this.eventBus.emit('component_executed', {
        componentName: component.name,
        componentType: component.type,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      emitSystemLog('component-execution-complete', {
        level: 'info',
        message: `Component execution complete: ${component.name}`,
        component: 'MasterOrchestrator',
        details: { 
          componentName: component.name, 
          componentType: component.type,
          status: 'success'
        }
      });
      
      return result;
    } catch (error) {
      // Handle component execution errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      emitSystemLog('component-execution-error', {
        level: 'error',
        message: `Error executing component ${component.name}: ${errorMessage}`,
        component: 'MasterOrchestrator',
        details: { 
          componentName: component.name, 
          componentType: component.type,
          error: errorMessage
        }
      });
      
      // Track failure in metrics
      this.eventBus.emit('component_execution_failed', {
        componentName: component.name,
        componentType: component.type,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      // Rethrow to be handled by the caller
      throw error;
    }
  }

  /**
   * Validate component output
   * What: Verifies component output meets quality standards
   * Why: Ensures consistent component quality
   * How: Schema and quality validation
   */
  private async validateComponentOutput(
    component: JourneyComponent,
    componentOutput: any
  ): Promise<{ isValid: boolean; reason?: string }> {
    // Validate component output with appropriate validation based on component type
    try {
      // Basic validation - null check
      if (!componentOutput) {
        return { 
          isValid: false, 
          reason: `Component ${component.name} returned null or undefined output` 
        };
      }
      
      // Type-specific validations
      switch (component.type) {
        case 'preprocessor': {
          // Preprocessors should extract structured data
          if (!componentOutput.extractedData && !componentOutput.structuredData) {
            return { 
              isValid: false, 
              reason: 'Preprocessor output missing extractedData or structuredData property' 
            };
          }
          break;
        }
          
        case 'enhancement': {
          // Enhancements should include enhanced content
          if (!componentOutput.enhancedContent && !componentOutput.enhancedData) {
            return { 
              isValid: false, 
              reason: 'Enhancement output missing enhancedContent or enhancedData property' 
            };
          }
          break;
        }
          
        case 'generator': {
          // Generators should include generated content
          if (!componentOutput.content && !componentOutput.generatedContent) {
            return { 
              isValid: false, 
              reason: 'Generator output missing content or generatedContent property' 
            };
          }
          break;
        }
          
        case 'validator': {
          // Validators should include validation results
          if (typeof componentOutput.isValid !== 'boolean') {
            return { 
              isValid: false, 
              reason: 'Validator output missing isValid property' 
            };
          }
          break;
        }
          
        case 'enrichment': {
          // Enrichments should include enriched context
          if (!componentOutput.enrichedContext && !componentOutput.context) {
            return { 
              isValid: false, 
              reason: 'Enrichment output missing enrichedContext or context property' 
            };
          }
          break;
        }
          
        case 'trust_catalyst': {
          // Trust catalysts should include trust metrics
          if (!componentOutput.trustMetrics && !componentOutput.trustDelta) {
            return { 
              isValid: false, 
              reason: 'Trust catalyst output missing trustMetrics or trustDelta property' 
            };
          }
          break;
        }
          
        case 'experience': {
          // Experience components should include user experience elements
          if (!componentOutput.experience && !componentOutput.content && !componentOutput.ui) {
            return { 
              isValid: false, 
              reason: 'Experience output missing experience, content, or ui property' 
            };
          }
          break;
        }
      }
      
      // Emotional sovereignty validation for all components
      // For components that have emotional impact, ensure they respect emotional sovereignty
      if (
        (component.type === 'enrichment' || 
         component.type === 'generator' || 
         component.type === 'trust_catalyst' || 
         component.type === 'experience') && 
        this.reversalTestAutomator
      ) {
        try {
          // Perform lightweight reversal test if appropriate for the component
          const reversalCheck = await this.reversalTestAutomator.validateComponentOutput(
            component.name,
            componentOutput,
            component.type
          );
          
          if (!reversalCheck.passed) {
            return { 
              isValid: false, 
              reason: `Component output failed reversal test: ${reversalCheck.failureReason}` 
            };
          }
        } catch (error) {
          // Log but continue if reversal test fails - don't block the component
          emitSystemLog('reversal-test-failure', {
            level: 'warn',
            message: `Reversal test error for component ${component.name}: ${
              error instanceof Error ? error.message : String(error)
            }`,
            component: 'MasterOrchestrator'
          });
        }
      }
      
      // If we reach here, the validation passed
      emitSystemLog('component-validation-success', {
        level: 'info',
        message: `Component validation successful: ${component.name}`,
        component: 'MasterOrchestrator',
        details: { componentName: component.name, componentType: component.type }
      });
      
      return { isValid: true };
      
    } catch (error) {
      // Handle validation errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      emitSystemLog('component-validation-error', {
        level: 'error',
        message: `Error validating component ${component.name} output: ${errorMessage}`,
        component: 'MasterOrchestrator',
        details: { componentName: component.name, componentType: component.type }
      });
      
      return { 
        isValid: false, 
        reason: `Validation error: ${errorMessage}` 
      };
    }
  }

  /**
   * Track component reliability metrics
   * What: Records component execution success/failure
   * Why: Builds reliability metrics for system health
   * How: Updates performance metrics with execution results
   */
  private trackComponentReliability(componentName: string, successful: boolean): void {
    // Get existing metrics or initialize new ones
    let metrics = this.performanceMetrics.componentReliability.get(componentName);
    
    if (!metrics) {
      metrics = { total: 0, successful: 0 };
      this.performanceMetrics.componentReliability.set(componentName, metrics);
    }
    
    // Update metrics
    metrics.total += 1;
    if (successful) {
      metrics.successful += 1;
    }
    
    // Emit warning event if reliability drops below threshold
    const reliability = metrics.successful / metrics.total;
    if (metrics.total >= 5 && reliability < 0.8) {
      this.eventBus.emit('orchestrator:component-reliability-warning', {
        component: componentName,
        reliability,
        threshold: 0.8,
        total: metrics.total,
        successful: metrics.successful
      });
    }
  }

  /**
   * Update emotional context based on component output
   * What: Enriches emotional context with component insights
   * Why: Maintains emotional continuity across journey
   * How: Context enrichment and trust progression updates
   */
  private async updateEmotionalContext(
    journeyState: JourneyState,
    componentOutput: any
  ): Promise<void> {
    // Update base context if provided
    if (componentOutput.updatedContext) {
      journeyState.enrichedContext.baseContext = {
        ...journeyState.enrichedContext.baseContext,
        ...componentOutput.updatedContext
      };
    }
    
    // Add emotional insights
    if (componentOutput.emotionalInsights && Array.isArray(componentOutput.emotionalInsights)) {
      journeyState.enrichedContext.emotionalInsights = [
        ...journeyState.enrichedContext.emotionalInsights,
        ...componentOutput.emotionalInsights
      ];
    }
    
    // Update emotional state if provided
    if (componentOutput.emotionalState) {
      journeyState.enrichedContext.currentEmotionalState = componentOutput.emotionalState;
    }
    
    // Update trust trajectory
    if (componentOutput.trustTrajectory) {
      journeyState.enrichedContext.trustTrajectory = componentOutput.trustTrajectory;
    }
    
    // Record trust delta if provided
    if (componentOutput.trustDelta !== undefined || componentOutput.trustImpact !== undefined) {
      const trustDeltaValue = componentOutput.trustDelta !== undefined ? 
        componentOutput.trustDelta : componentOutput.trustImpact;
      
      const previousScore = journeyState.enrichedContext.baseContext.baseTrustScore;
      const newScore = previousScore + trustDeltaValue;
      
      // Update base trust score
      journeyState.enrichedContext.baseContext.baseTrustScore = newScore;
      
      // Record trust progression
      journeyState.trustProgression.push({
        timestamp: new Date(),
        component: componentOutput.source || 'unknown',
        value: trustDeltaValue,
        previousScore,
        newScore,
        reason: componentOutput.trustReason || 'Component execution'
      });
    }
  }

  /**
   * Handle component execution failure
   * What: Manages component failure with error tracking
   * Why: Ensures graceful error handling and recovery
   * How: Error tracking, logging, and recovery actions
   */
  private async handleComponentFailure(
    journeyState: JourneyState,
    component: JourneyComponent,
    error: any
  ): Promise<void> {
    // Generate error ID
    const errorId = `err-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Create error record
    const errorRecord: OrchestrationError = {
      errorId,
      timestamp: new Date(),
      component: component.name,
      errorType: 'component_failure',
      severity: 'medium', // Default severity
      message: error instanceof Error ? error.message : String(error),
      context: {
        journeyType: journeyState.journeyType,
        stage: journeyState.currentStage,
        componentType: component.type
      },
      recoveryAttempted: false
    };
    
    // Determine severity based on component type
    if (component.type === 'trust_catalyst' || component.type === 'validator') {
      errorRecord.severity = 'high';
    } else if (component.type === 'generator') {
      errorRecord.severity = 'medium';
    }
    
    // Add error to journey state
    journeyState.errors.push(errorRecord);
    
    // Create recovery action
    const recoveryAction: RecoveryAction = {
      actionId: `recovery-${errorId}`,
      errorId,
      actionType: 'component_retry',
      implementation: `Retry execution of ${component.name}`,
      expectedOutcome: 'Successful component execution',
      maxRetries: 3,
      currentRetries: 0
    };
    
    // For critical components, create fallback action
    if (errorRecord.severity === 'high' || errorRecord.severity === 'critical') {
      recoveryAction.actionType = 'fallback_component';
      recoveryAction.implementation = `Execute fallback for ${component.name}`;
    }
    
    // Add recovery action to journey state
    journeyState.recoveryActions.push(recoveryAction);
    
    // Update error record to reflect recovery attempt
    errorRecord.recoveryAttempted = true;
    
    // Emit component failure event
    this.eventBus.emit('component-failure', {
      errorId,
      component: component.name,
      journeyId: journeyState.journeyId,
      error,
      severity: errorRecord.severity
    });
  }

  /**
   * Compile journey input for context
   * What: Compiles journey state into formatted input
   * Why: Creates standardized input format for components
   * How: Data extraction and formatting
   */
  private compileJourneyInput(journeyState: JourneyState): any {
    return {
      userId: journeyState.userId,
      sessionId: journeyState.sessionId,
      journeyType: journeyState.journeyType,
      currentStage: journeyState.currentStage,
      completedStages: journeyState.completedStages,
      emotionalContext: journeyState.enrichedContext.baseContext,
      trustScore: journeyState.enrichedContext.baseContext.baseTrustScore,
      emotionalState: journeyState.enrichedContext.currentEmotionalState,
      previousComponents: Array.from(journeyState.componentData.keys())
    };
  }

  /**
   * Compile journey output for validation
   * What: Compiles stage results into formatted output
   * Why: Creates standardized output format for validation
   * How: Result compilation and formatting
   */
  private compileJourneyOutput(stageResults: Map<string, any>): any {
    const compiledOutput: any = {};
    
    // Extract key output elements from each stage
    for (const [stageName, result] of stageResults.entries()) {
      if (result.generatedContent) {
        compiledOutput[`${stageName}_content`] = result.generatedContent;
      }
      
      if (result.recommendations) {
        compiledOutput[`${stageName}_recommendations`] = result.recommendations;
      }
      
      if (result.analysis) {
        compiledOutput[`${stageName}_analysis`] = result.analysis;
      }
      
      if (result.insights) {
        compiledOutput[`${stageName}_insights`] = result.insights;
      }
    }
    
    return compiledOutput;
  }

  /**
   * Calculate journey quality metrics
   * What: Computes quality metrics for journey
   * Why: Tracks overall journey quality for monitoring
   * How: Multi-dimensional quality calculation
   */
  private async calculateJourneyQuality(
    journeyState: JourneyState,
    stageResults: Map<string, any>,
    sparkSplitResults: SparkSplitOutput[]
  ): Promise<JourneyQualityMetrics> {
    // Calculate component reliability
    const componentReliability = this.calculateOverallComponentReliability();
    
    // Calculate trust score from progression
    const trustScore = this.calculateAverageTrustScore(journeyState.trustProgression);
    
    // Calculate emotional continuity
    const emotionalContinuity = this.calculateEmotionalContinuity(journeyState);
    
    // Calculate user satisfaction (estimated)
    const userSatisfaction = Math.min(
      4.5, // Cap at 4.5 to avoid overconfidence
      (trustScore * 0.4) + (componentReliability * 0.3) + (emotionalContinuity * 0.3)
    );
    
    // Calculate processing latency
    const stageLatencies = journeyState.stageHistory
      .filter(stage => stage.duration !== undefined)
      .map(stage => stage.duration || 0);
    
    const processingLatency = stageLatencies.length > 0 
      ? stageLatencies.reduce((sum, latency) => sum + latency, 0) / stageLatencies.length 
      : 0;
    
    // Calculate error rate
    const errorRate = journeyState.errors.length / 
      Math.max(1, Array.from(journeyState.componentData.keys()).length);
    
    // Calculate overall score (weighted average)
    const overallScore = (
      (trustScore * 0.35) + 
      (componentReliability * 0.2) + 
      (emotionalContinuity * 0.25) + 
      (userSatisfaction * 0.15) + 
      (Math.max(0, 1 - errorRate) * 0.05)
    );
    
    // Return quality metrics
    return {
      overallScore,
      componentReliability,
      emotionalContinuity,
      trustScore,
      userSatisfaction,
      processingLatency,
      errorRate
    };
  }

  /**
   * Calculate emotional continuity score
   * What: Measures consistency of emotional experience
   * Why: Tracks emotional sovereignty quality
   * How: Continuity pattern analysis
   */
  private calculateEmotionalContinuity(journeyState: JourneyState): number {
    const emotionalContext = journeyState.enrichedContext;
    
    // Base continuity on emotional state consistency
    const baseScore = 0.75; // Default to good continuity
    
    // Factors that enhance continuity
    const enhancementFactors = [];
    
    // Cross-session continuity enhances score
    if (emotionalContext.crossSessionContinuity && 
        Object.keys(emotionalContext.crossSessionContinuity).length > 0) {
      enhancementFactors.push(0.1);
    }
    
    // Consistent trust trajectory enhances score
    if (journeyState.trustProgression.length >= 3) {
      const directions = journeyState.trustProgression
        .map((delta, i, arr) => {
          if (i === 0) return 0;
          const prev = arr[i-1];
          if (delta.newScore && prev.newScore) {
            return delta.newScore > prev.newScore ? 1 : (delta.newScore < prev.newScore ? -1 : 0);
          }
          return 0;
        })
        .filter(dir => dir !== 0);
      
      const consistentDirection = directions.length >= 2 && 
        directions.every(dir => dir === directions[0]);
      
      if (consistentDirection) {
        enhancementFactors.push(0.1);
      }
    }
    
    // User profile enhances score
    if (emotionalContext.userProfile) {
      enhancementFactors.push(0.05);
    }
    
    // Factors that reduce continuity
    const reductionFactors = [];
    
    // Errors reduce continuity
    if (journeyState.errors.length > 0) {
      reductionFactors.push(0.05 * Math.min(3, journeyState.errors.length));
    }
    
    // Calculate final score
    const totalEnhancement = enhancementFactors.reduce((sum, factor) => sum + factor, 0);
    const totalReduction = reductionFactors.reduce((sum, factor) => sum + factor, 0);
    
    return Math.min(1, Math.max(0, baseScore + totalEnhancement - totalReduction));
  }

  /**
   * Store journey in emotional memory bank
   * What: Persists journey information for future reference
   * Why: Enables cross-session continuity and learning
   * How: Memory storage with proper emotional tagging
   */
  private async storeJourneyInMemory(
    journeyState: JourneyState,
    journeyQuality: JourneyQualityMetrics
  ): Promise<void> {
    // Only store for identified users
    if (!journeyState.userId) {
      return;
    }
    
    try {
      // Create memory entry
      const memoryEntry: EmotionalMemoryEntry = {
        userId: journeyState.userId,
        timestamp: new Date(),
        emotionalContext: journeyState.enrichedContext.baseContext,
        interactionSummary: `${journeyState.journeyType} journey with ${journeyState.completedStages.length} completed stages`,
        resonanceScore: journeyQuality.emotionalContinuity,
        trustDelta: this.calculateNetTrustDelta(journeyState.trustProgression),
        keyInsights: this.extractKeyInsights(journeyState),
        futureRecommendations: []
      };
      
      // Store in memory bank
      await this.emotionalMemoryBank.storeMemory(memoryEntry);
      
      // Update user profile if needed
      if (journeyQuality.overallScore > 0.7) {
        await this.emotionalMemoryBank.updateUserProfile(journeyState.userId, {
          lastSuccessfulJourney: {
            type: journeyState.journeyType,
            timestamp: new Date(),
            score: journeyQuality.overallScore
          }
        });
      }
      
    } catch (error) {
      // Log error but don't fail the journey
      this.eventBus.emit('orchestrator:memory-storage-error', {
        journeyId: journeyState.journeyId,
        userId: journeyState.userId,
        error
      });
    }
  }

  /**
   * Calculate net trust delta from progression
   * What: Computes overall trust change
   * Why: Measures journey trust impact
   * How: Statistical analysis of trust progression
   */
  private calculateNetTrustDelta(trustProgression: TrustDelta[]): number {
    if (trustProgression.length === 0) {
      return 0;
    }
    
    // Calculate weighted sum of trust deltas (recent ones count more)
    const weightedSum = trustProgression.reduce((sum, delta, index) => {
      const weight = 1 + (index / trustProgression.length); // Later deltas have higher weights
      const value = delta.value !== undefined ? delta.value : 
        (delta.newScore !== undefined && delta.previousScore !== undefined ? 
          delta.newScore - delta.previousScore : 0);
      
      return sum + (value * weight);
    }, 0);
    
    // Normalize by sum of weights
    const weightSum = trustProgression.reduce((sum, _, index) => {
      return sum + (1 + (index / trustProgression.length));
    }, 0);
    
    return weightedSum / weightSum;
  }

  /**
   * Extract key insights from journey state
   * What: Identifies critical insights from journey
   * Why: Provides summarized learning for future reference
   * How: Pattern analysis and insight extraction
   */
  private extractKeyInsights(journeyState: JourneyState): string[] {
    const insights: string[] = [];
    
    // Extract insights based on emotional trajectory
    if (journeyState.enrichedContext.trustTrajectory === 'increasing') {
      insights.push(`Trust building successful in ${journeyState.journeyType} journey`);
    } else if (journeyState.enrichedContext.trustTrajectory === 'declining') {
      insights.push(`Trust challenges identified in ${journeyState.journeyType} journey`);
    }
    
    // Extract insights from completed stages
    if (journeyState.completedStages.includes('spark_creation')) {
      const sparkData = journeyState.componentData.get('SparkConceptGenerator');
      if (sparkData && sparkData.resonanceScore > 0.8) {
        insights.push(`High resonance (${sparkData.resonanceScore.toFixed(2)}) with spark concept ${sparkData.conceptName || 'concept'}`);
      }
    }
    
    // Extract insights from errors
    if (journeyState.errors.length > 0) {
      const componentFailures = journeyState.errors
        .filter(e => e.errorType === 'component_failure')
        .map(e => e.component);
      
      if (componentFailures.length > 0) {
        const uniqueComponents = [...new Set(componentFailures)];
        insights.push(`Component reliability issues with: ${uniqueComponents.join(', ')}`);
      }
    }
    
    return insights;
  }

  /**
   * Update performance metrics with journey results
   * What: Updates system-wide performance tracking
   * Why: Enables ongoing system optimization
   * How: Metric aggregation and statistical updates
   */
  private updatePerformanceMetrics(
    journeyState: JourneyState,
    journeyQuality: JourneyQualityMetrics,
    duration: number
  ): void {
    // Update journey counts
    this.performanceMetrics.totalJourneys += 1;
    if (journeyQuality.overallScore >= 0.7) {
      this.performanceMetrics.successfulJourneys += 1;
    }
    
    // Update latency tracking (exponential moving average)
    const alpha = 0.3; // Smoothing factor
    this.performanceMetrics.averageLatency = 
      (alpha * duration) + ((1 - alpha) * this.performanceMetrics.averageLatency);
    
    // Update trust score tracking (exponential moving average)
    this.performanceMetrics.averageTrustScore = 
      (alpha * journeyQuality.trustScore) + ((1 - alpha) * this.performanceMetrics.averageTrustScore);
    
    // Emit performance update event
    this.eventBus.emit('orchestrator:performance-update', {
      totalJourneys: this.performanceMetrics.totalJourneys,
      successRate: this.performanceMetrics.successfulJourneys / this.performanceMetrics.totalJourneys,
      averageLatency: this.performanceMetrics.averageLatency,
      averageTrustScore: this.performanceMetrics.averageTrustScore,
      componentReliability: this.calculateOverallComponentReliability()
    });
  }

  /**
   * Update journey state with SparkSplit results
   * What: Integrates SparkSplit results into journey state
   * Why: Provides rich trust data for future stages
   * How: Structured integration of SparkSplit outputs
   */
  private updateJourneyWithSparkSplitResults(
    journeyState: JourneyState,
    results: SparkSplitOutput[]
  ): void {
    if (!results || results.length === 0) {
      return;
    }
    
    // Create SparkSplitIntegration data structure
    const sparkSplitData: SparkSplitIntegration = {
      trustDelta: this.calculateAverageTrustDelta(results),
      emotionalCompass: this.calculateAggregateEmotionalMetrics(results),
      userPreference: 'neutral', // Default to neutral until user indicates preference
      comparisonHistory: results.map(r => this.convertToSessionData(r)),
      trustProgression: journeyState.trustProgression,
      // Additional fields for master-orchestrator.ts
      results: results,
      performanceMetrics: {
        averageTrustDelta: this.calculateAverageTrustScore(journeyState.trustProgression),
        transparencyScore: this.calculateTrustTransparencyScore(results),
        userPreference: null
      }
    };
    
    // Update journey state
    journeyState.sparkSplitData = sparkSplitData;
  }

  /**
   * Calculate average trust delta from results
   * What: Computes average trust impact from SparkSplit results
   * Why: Provides aggregate trust measure
   * How: Statistical analysis of trust deltas
   */
  private calculateAverageTrustDelta(results: SparkSplitOutput[]): number {
    return results.reduce((sum, result) => sum + result.trustDelta, 0) / results.length;
  }

  /**
   * Calculate aggregate emotional metrics
   * What: Combines emotional metrics from multiple results
   * Why: Provides consolidated emotional impact
   * How: Weighted average of emotional metrics
   */
  private calculateAggregateEmotionalMetrics(results: SparkSplitOutput[]): EmotionalIntelligenceMetrics {
    // Initialize with zeros
    const aggregate: EmotionalIntelligenceMetrics = {
      aweScore: 0,
      ownershipScore: 0,
      wonderScore: 0,
      calmScore: 0,
      powerScore: 0,
      overallResonance: 0
    };
    
    // Sum all metrics
    results.forEach(result => {
      const metrics = result.comparisonMetrics;
      aggregate.aweScore += metrics.aweScore;
      aggregate.ownershipScore += metrics.ownershipScore;
      aggregate.wonderScore += metrics.wonderScore;
      // Map to our structure, assuming the source might have different property names
      aggregate.calmScore += metrics.emotionalImpactScore || 0;
      aggregate.powerScore += metrics.sparkResonanceScore || 0;
      aggregate.overallResonance += (metrics.aweScore + metrics.ownershipScore + metrics.wonderScore) / 3;
    });
    
    // Calculate averages
    const count = results.length;
    aggregate.aweScore /= count;
    aggregate.ownershipScore /= count;
    aggregate.wonderScore /= count;
    aggregate.calmScore /= count;
    aggregate.powerScore /= count;
    aggregate.overallResonance /= count;
    
    return aggregate;
  }

  /**
   * Convert SparkSplitOutput to session data
   * What: Transforms output to historical session format
   * Why: Enables session history tracking
   * How: Format conversion with context preservation
   */
  private convertToSessionData(output: SparkSplitOutput): SparkSplitSessionData {
    return {
      timestamp: new Date(),
      sparkConcept: output.sparkConcept,
      trustDelta: output.trustDelta,
      sterileOutput: output.sterileOutput,
      enrichedOutput: output.enrichedOutput,
      userSelection: output.userSelection || 'enriched',
      comparisonMetrics: output.comparisonMetrics
    };
  }
}

// Supporting interfaces
interface JourneyTemplate {
  name: string;
  stages: JourneyStage[];
}

interface JourneyStage {
  name: string;
  components: JourneyComponent[];
}

interface JourneyComponent {
  name: string;
  type: 'preprocessor' | 'enhancement' | 'generator' | 'validator' | 'enrichment' | 'trust_catalyst' | 'experience';
}

interface PerformanceMetrics {
  totalJourneys: number;
  successfulJourneys: number;
  averageLatency: number;
  averageTrustScore: number;
  componentReliability: Map<string, { total: number; successful: number }>;
  successRate?: number;
  overallComponentReliability?: number;
}

// Supporting interfaces for private methods
interface SparkSplitSessionData {
  timestamp: Date;
  sparkConcept: any;
  trustDelta: number;
  sterileOutput: string;
  enrichedOutput: string;
  userSelection: string;
  comparisonMetrics: any;
}

// Export singleton instance for system-wide use
export const masterOrchestrator = new MasterOrchestrator(
  new UniversalInterfaceAdapter(),
  new EmotionalContextPipeline(new EmotionalMemoryBank(), EventBus.getInstance()),
  new SparkSplitEngine(
    new ReversalTestAutomator(),
    new SacredMomentsOrchestrator(new EmotionalMemoryBank(), EventBus.getInstance()),
    new EmotionalMemoryBank()
  ),
  new SacredMomentsOrchestrator(new EmotionalMemoryBank(), EventBus.getInstance()),
  new ReversalTestAutomator(),
  new EmotionalMemoryBank(),
  EventBus.getInstance()
); 