/**
 * prompt-version-router.ts
 * 
 * Purpose: Routes prompt payloads to appropriate version handlers,
 * manages version interoperability, and provides version bridging logic.
 * 
 * Codex Enforcement: Real System Bound routing with comprehensive fallback handling
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptPayload, PromptSchemaValidator, SchemaValidationResult } from './prompt-schema-validator';

export interface PromptProcessingResult {
  success: boolean;
  processedPayload: PromptPayload;
  outputContent: string;
  version: string;
  processingTime: number;
  warnings: string[];
  errors: string[];
  fallbacksUsed: string[];
  handlerUsed: string;
}

export interface VersionHandler {
  version: string;
  canHandle(payload: PromptPayload): boolean;
  process(payload: PromptPayload): Promise<PromptProcessingResult>;
  getCapabilities(): string[];
}

export class PromptVersionRouter {
  private eventBus: EventBus;
  private schemaValidator: PromptSchemaValidator;
  private handlers: Map<string, VersionHandler>;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.schemaValidator = new PromptSchemaValidator();
    this.handlers = new Map();
    this.initializeHandlers();
  }

  /**
   * Initialize version handlers for different prompt versions
   */
  private initializeHandlers(): void {
    // V1 Handler - Legacy prompt processing
    this.handlers.set('v1', new V1PromptHandler());
    
    // V2 Handler - Enhanced with emotional context
    this.handlers.set('v2', new V2PromptHandler());
    
    // V3 Handler - Current with full feature set
    this.handlers.set('v3', new V3PromptHandler());
  }

  /**
   * Route a prompt payload to the appropriate handler
   */
  async routePrompt(payload: PromptPayload, preferredVersion?: string): Promise<PromptProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Validate and potentially migrate the payload
      const targetVersion = preferredVersion || 'v3';
      const validationResult = await this.schemaValidator.validatePrompt(payload, targetVersion);
      
      if (!validationResult.isValid) {
        return {
          success: false,
          processedPayload: payload,
          outputContent: '',
          version: targetVersion,
          processingTime: Date.now() - startTime,
          warnings: validationResult.warnings,
          errors: validationResult.errors,
          fallbacksUsed: [],
          handlerUsed: 'none'
        };
      }

      // Use migrated payload if available
      const processPayload = validationResult.migratedPayload || payload;
      
      // Find appropriate handler
      const handler = this.findHandler(processPayload, targetVersion);
      if (!handler) {
        return {
          success: false,
          processedPayload: processPayload,
          outputContent: '',
          version: targetVersion,
          processingTime: Date.now() - startTime,
          warnings: validationResult.warnings,
          errors: [`No handler found for version: ${targetVersion}`],
          fallbacksUsed: validationResult.fallbacksApplied,
          handlerUsed: 'none'
        };
      }

      // Process the payload
      const result = await handler.process(processPayload);
      
      // Merge validation warnings and fallbacks
      result.warnings.push(...validationResult.warnings);
      result.fallbacksUsed.push(...validationResult.fallbacksApplied);
      
      // Emit routing event
      this.eventBus.emit('prompt:routed', {
        payload: processPayload,
        result,
        handler: handler.version,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      return {
        success: false,
        processedPayload: payload,
        outputContent: '',
        version: preferredVersion || 'unknown',
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [`Routing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        fallbacksUsed: [],
        handlerUsed: 'none'
      };
    }
  }

  /**
   * Find the best handler for a payload
   */
  private findHandler(payload: PromptPayload, preferredVersion: string): VersionHandler | null {
    // Try preferred version first
    const preferredHandler = this.handlers.get(preferredVersion);
    if (preferredHandler && preferredHandler.canHandle(payload)) {
      return preferredHandler;
    }

    // Fallback to any compatible handler
    for (const handler of this.handlers.values()) {
      if (handler.canHandle(payload)) {
        return handler;
      }
    }

    return null;
  }

  /**
   * Get all available handlers
   */
  getAvailableHandlers(): VersionHandler[] {
    return Array.from(this.handlers.values());
  }

  /**
   * Get handler capabilities matrix
   */
  getCapabilitiesMatrix(): Record<string, string[]> {
    const matrix: Record<string, string[]> = {};
    
    for (const [version, handler] of this.handlers.entries()) {
      matrix[version] = handler.getCapabilities();
    }
    
    return matrix;
  }
}

/**
 * V1 Prompt Handler - Legacy processing
 */
class V1PromptHandler implements VersionHandler {
  version = 'v1';

  canHandle(payload: PromptPayload): boolean {
    // V1 can handle basic payloads with minimal requirements
    return !!(payload.sessionId && payload.promptType && payload.content);
  }

  async process(payload: PromptPayload): Promise<PromptProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Simple processing for V1 - basic content transformation
      const outputContent = this.processV1Content(payload.content, payload.promptType);
      
      return {
        success: true,
        processedPayload: payload,
        outputContent,
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: ['Using legacy V1 handler - consider upgrading to newer version'],
        errors: [],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    } catch (error) {
      return {
        success: false,
        processedPayload: payload,
        outputContent: '',
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [`V1 processing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    }
  }

  private processV1Content(content: string, promptType: string): string {
    // Basic V1 processing - simple template substitution
    return `[V1 ${promptType.toUpperCase()}] ${content}`;
  }

  getCapabilities(): string[] {
    return ['basic-processing', 'simple-templates', 'legacy-support'];
  }
}

/**
 * V2 Prompt Handler - Enhanced with emotional context
 */
class V2PromptHandler implements VersionHandler {
  version = 'v2';

  canHandle(payload: PromptPayload): boolean {
    // V2 requires version field and can handle enhancer fields
    return !!(payload.sessionId && payload.promptType && payload.content && payload.version);
  }

  async process(payload: PromptPayload): Promise<PromptProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Enhanced processing for V2 - includes emotional context
      const outputContent = this.processV2Content(payload);
      
      return {
        success: true,
        processedPayload: payload,
        outputContent,
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    } catch (error) {
      return {
        success: false,
        processedPayload: payload,
        outputContent: '',
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [`V2 processing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    }
  }

  private processV2Content(payload: PromptPayload): string {
    const emotionalContext = payload.enhancerFields?.emotionalContext || 'neutral';
    const urgencyLevel = payload.enhancerFields?.urgencyLevel || 1;
    const trustScore = payload.metadata?.trustScore || 0.8;
    
    // V2 processing with emotional enhancement
    let output = `[V2 ${payload.promptType.toUpperCase()}] ${payload.content}`;
    
    // Add emotional context
    if (emotionalContext !== 'neutral') {
      output += ` [Emotional Context: ${emotionalContext}]`;
    }
    
    // Add urgency indicator
    if (urgencyLevel > 1) {
      output += ` [Urgency: ${urgencyLevel}/5]`;
    }
    
    // Add trust indicator
    output += ` [Trust: ${(trustScore * 100).toFixed(0)}%]`;
    
    return output;
  }

  getCapabilities(): string[] {
    return ['emotional-context', 'urgency-handling', 'trust-scoring', 'enhanced-templates'];
  }
}

/**
 * V3 Prompt Handler - Current with full feature set
 */
class V3PromptHandler implements VersionHandler {
  version = 'v3';

  canHandle(payload: PromptPayload): boolean {
    // V3 requires recordId and full metadata
    return !!(payload.recordId && payload.sessionId && payload.promptType && payload.content && payload.version);
  }

  async process(payload: PromptPayload): Promise<PromptProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Full-featured processing for V3
      const outputContent = this.processV3Content(payload);
      
      return {
        success: true,
        processedPayload: payload,
        outputContent,
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    } catch (error) {
      return {
        success: false,
        processedPayload: payload,
        outputContent: '',
        version: this.version,
        processingTime: Date.now() - startTime,
        warnings: [],
        errors: [`V3 processing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        fallbacksUsed: [],
        handlerUsed: this.version
      };
    }
  }

  private processV3Content(payload: PromptPayload): string {
    const emotionalContext = payload.enhancerFields?.emotionalContext || 'supportive';
    const urgencyLevel = payload.enhancerFields?.urgencyLevel || 1;
    const audienceProfile = payload.enhancerFields?.audienceProfile || 'general';
    const trustScore = payload.metadata?.trustScore || 0.9;
    const emotionalAlignment = payload.metadata?.emotionalAlignment || 'empathetic';
    
    // V3 processing with full feature set
    let output = `[V3 ${payload.promptType.toUpperCase()}] ${payload.content}`;
    
    // Add comprehensive metadata
    output += ` [Context: ${emotionalContext}, Alignment: ${emotionalAlignment}]`;
    output += ` [Audience: ${audienceProfile}, Urgency: ${urgencyLevel}/5]`;
    output += ` [Trust: ${(trustScore * 100).toFixed(0)}%, Record: ${payload.recordId}]`;
    
    // Add session tracking
    output += ` [Session: ${payload.sessionId}]`;
    
    return output;
  }

  getCapabilities(): string[] {
    return [
      'full-emotional-context',
      'audience-profiling',
      'advanced-trust-scoring',
      'session-tracking',
      'comprehensive-metadata',
      'record-linking',
      'enhanced-templates'
    ];
  }
} 