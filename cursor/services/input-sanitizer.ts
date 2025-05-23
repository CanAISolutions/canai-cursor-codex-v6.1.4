/**
 * @file cursor/services/input-sanitizer.ts
 * @description Input sanitization service with emotional trust preservation
 * @version 6.1.4
 * 
 * Purpose: Protects against prompt injection, toxicity, and malicious inputs
 * while maintaining warm, trust-preserving recovery UX per Ideal CX Thread.
 */

import { EventBus } from '../event-bus/eventBus';
import { TrustScoreManager } from './trust-score-manager';
import { FallbackManager } from './fallback-manager';
import { EmotionalUXRenderer } from './emotional-ux-renderer';

export interface SanitizationResult {
  sanitized: string;
  wasModified: boolean;
  sanitizationLevel: 'none' | 'light' | 'moderate' | 'heavy';
  toxicityScore: number;
  wasInjected: boolean;
  recoveryMessage?: string;
  trustScoreImpact: number;
  isReplay: boolean;
  originalSanitizationContext?: {
    wasInjected: boolean;
    toxicityScore: number;
    sanitizationLevel: string;
    originalRecoveryMessage: string;
  };
  metadata: {
    originalLength: number;
    sanitizedLength: number;
    removedTokens: string[];
    correctionType: string[];
    timestamp: string;
  };
}

export interface SchemaValidationResult {
  isValid: boolean;
  unknownFields: string[];
  potentialVectors: string[];
  fallbackApplied: boolean;
  validationWarnings: string[];
}

export interface InputSanitizationCorrection {
  type: 'inputSanitizationCorrection';
  originalInput: string;
  sanitizedInput: string;
  sanitizationLevel: string;
  toxicityScore: number;
  wasInjected: boolean;
  correctionReason: string;
  trustScoreImpact: number;
  timestamp: string;
  traceId: string;
  schemaValidation?: SchemaValidationResult;
}

export class InputSanitizer {
  private eventBus: EventBus;
  private trustScoreManager: TrustScoreManager;
  private fallbackManager: FallbackManager;
  private emotionalUXRenderer: EmotionalUXRenderer;

  // Known safe schema fields (whitelist approach)
  private readonly SAFE_SCHEMA_FIELDS = [
    'content', 'message', 'text', 'input', 'prompt', 'query',
    'title', 'description', 'name', 'email', 'subject',
    'businessType', 'industry', 'targetAudience', 'goals',
    'tone', 'style', 'language', 'locale', 'urgency',
    'metadata', 'timestamp', 'userId', 'sessionId', 'traceId'
  ];

  // Injection patterns to detect
  private readonly INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?previous\s+instructions?/i,
    /forget\s+(all\s+)?previous\s+instructions?/i,
    /reset\s+(all\s+)?instructions?/i,
    /system\s*:\s*you\s+are\s+now/i,
    /\[SYSTEM\]/i,
    /\[ADMIN\]/i,
    /\[ROOT\]/i,
    /<script[^>]*>/i,
    /<iframe[^>]*>/i,
    /javascript:/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /document\.write/i,
    /window\.location/i,
    /prompt\s*\(/i,
    /alert\s*\(/i,
  ];

  // Toxic language patterns
  private readonly TOXIC_PATTERNS = [
    /\b(hate|kill|die|murder|suicide)\b/i,
    /\b(stupid|idiot|moron|dumb)\b/i,
    /\b(f[u*]ck|sh[i*]t|damn)\b/i,
    // Add more patterns as needed
  ];

  // Dangerous tokens to remove
  private readonly DANGEROUS_TOKENS = [
    '<script>',
    '</script>',
    '<iframe>',
    '</iframe>',
    'javascript:',
    'data:text/html',
    'eval(',
    'document.write',
    'window.location',
    'prompt(',
    'alert(',
    'confirm(',
    '${',
    '#{',
    '{{',
    '}}',
    '--',
    ';',
    '|',
    '&&',
    '||',
    '`',
    '$(',
  ];

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.trustScoreManager = new TrustScoreManager(this.eventBus);
    this.fallbackManager = FallbackManager.getInstance();
    this.emotionalUXRenderer = EmotionalUXRenderer.getInstance();
  }

  /**
   * Sanitizes structured input with schema validation for regression safety
   */
  public async sanitizeStructuredInput(
    input: any,
    traceId: string = `trace-${Date.now()}`,
    originalContext?: { wasInjected: boolean; toxicityScore: number; sanitizationLevel: string; originalRecoveryMessage: string }
  ): Promise<SanitizationResult & { schemaValidation: SchemaValidationResult }> {
    // Validate input schema first
    const schemaValidation = this.validateInputSchema(input);
    
    // If schema validation fails, apply fallback sanitization
    let sanitizedInput = input;
    if (!schemaValidation.isValid) {
      schemaValidation.fallbackApplied = true;
      sanitizedInput = this.sanitizeUnknownFields(input, schemaValidation);
    }

    // Convert to string for standard sanitization
    const inputString = typeof sanitizedInput === 'string' ? sanitizedInput : JSON.stringify(sanitizedInput);
    
    // Apply standard sanitization
    const result = await this.sanitizeInput(inputString, traceId, originalContext);
    
    // Return enhanced result with schema validation
    return {
      ...result,
      schemaValidation
    };
  }

  /**
   * Sanitizes input while preserving emotional trust
   */
  public async sanitizeInput(
    input: string,
    traceId: string = `trace-${Date.now()}`,
    originalContext?: { wasInjected: boolean; toxicityScore: number; sanitizationLevel: string; originalRecoveryMessage: string }
  ): Promise<SanitizationResult> {
    const originalLength = input.length;
    let sanitized = input;
    let wasModified = false;
    let wasInjected = false;
    let toxicityScore = 0;
    let sanitizationLevel: 'none' | 'light' | 'moderate' | 'heavy' = 'none';
    const removedTokens: string[] = [];
    const correctionType: string[] = [];

    // Detect if this is a replay scenario
    const isReplay = originalContext !== undefined;

    // Check for injection attempts
    const injectionDetected = this.detectInjection(input);
    if (injectionDetected) {
      wasInjected = true;
      sanitized = this.removeInjectionPatterns(sanitized, removedTokens, correctionType);
      wasModified = true;
      sanitizationLevel = 'heavy';
    }

    // Check for toxic content
    const toxicity = this.calculateToxicity(sanitized);
    toxicityScore = toxicity.score;
    if (toxicity.score > 0.3) {
      sanitized = this.sanitizeToxicContent(sanitized, removedTokens, correctionType);
      wasModified = true;
      if (sanitizationLevel === 'none') sanitizationLevel = 'moderate';
    }

    // Remove dangerous tokens
    const dangerousTokensFound = this.removeDangerousTokens(sanitized, removedTokens, correctionType);
    if (dangerousTokensFound.modified) {
      sanitized = dangerousTokensFound.sanitized;
      wasModified = true;
      if (sanitizationLevel === 'none') sanitizationLevel = 'light';
    }

    // Normalize unicode and clean up
    const normalized = this.normalizeUnicode(sanitized);
    if (normalized !== sanitized) {
      sanitized = normalized;
      wasModified = true;
      correctionType.push('unicode-normalization');
      if (sanitizationLevel === 'none') sanitizationLevel = 'light';
    }

    // Calculate trust score impact
    const trustScoreImpact = this.calculateTrustScoreImpact(
      wasInjected,
      toxicityScore,
      sanitizationLevel
    );

    // Generate recovery message with replay continuity
    let recoveryMessage: string | undefined;
    if (isReplay && originalContext) {
      // REPLAY SCENARIO: Preserve emotional continuity
      if (!wasModified) {
        // No new sanitization needed, but preserve emotional context
        recoveryMessage = await this.generateReplayRecoveryMessage(originalContext);
      } else {
        // Additional sanitization needed during replay
        recoveryMessage = await this.generateRecoveryMessage(wasInjected, toxicityScore, sanitizationLevel);
      }
    } else if (wasModified) {
      // INITIAL SANITIZATION: Generate new recovery message
      recoveryMessage = await this.generateRecoveryMessage(wasInjected, toxicityScore, sanitizationLevel);
    }

    const result: SanitizationResult = {
      sanitized,
      wasModified,
      sanitizationLevel,
      toxicityScore,
      wasInjected,
      recoveryMessage,
      trustScoreImpact,
      isReplay,
      originalSanitizationContext: originalContext,
      metadata: {
        originalLength,
        sanitizedLength: sanitized.length,
        removedTokens,
        correctionType,
        timestamp: new Date().toISOString(),
      },
    };

    // Log sanitization correction if modified
    if (wasModified) {
      await this.logSanitizationCorrection(input, result, traceId);
    }

    // Update trust score
    if (trustScoreImpact !== 0) {
      this.trustScoreManager.updateTrustScore(
        `session-${Date.now()}`, // sessionId
        this.trustScoreManager.getTrustScore(`session-${Date.now()}`) + trustScoreImpact,
        `input-sanitization-${sanitizationLevel}`,
        'normal',
        traceId
      );
    }

    return result;
  }

  /**
   * Detects injection attempts in input
   */
  private detectInjection(input: string): boolean {
    return this.INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Removes injection patterns from input
   */
  private removeInjectionPatterns(
    input: string,
    removedTokens: string[],
    correctionType: string[]
  ): string {
    let sanitized = input;
    
    this.INJECTION_PATTERNS.forEach(pattern => {
      const matches = sanitized.match(pattern);
      if (matches) {
        matches.forEach(match => removedTokens.push(match));
        sanitized = sanitized.replace(pattern, '');
        correctionType.push('injection-removal');
      }
    });

    return sanitized.trim();
  }

  /**
   * Calculates toxicity score for input
   */
  private calculateToxicity(input: string): { score: number; patterns: string[] } {
    const foundPatterns: string[] = [];
    let score = 0;

    this.TOXIC_PATTERNS.forEach(pattern => {
      const matches = input.match(pattern);
      if (matches) {
        matches.forEach(match => {
          foundPatterns.push(match);
          score += 0.2; // Each toxic pattern adds to score
        });
      }
    });

    return { score: Math.min(1, score), patterns: foundPatterns };
  }

  /**
   * Sanitizes toxic content
   */
  private sanitizeToxicContent(
    input: string,
    removedTokens: string[],
    correctionType: string[]
  ): string {
    let sanitized = input;

    this.TOXIC_PATTERNS.forEach(pattern => {
      const matches = sanitized.match(pattern);
      if (matches) {
        matches.forEach(match => removedTokens.push(match));
        sanitized = sanitized.replace(pattern, '[content adjusted]');
        correctionType.push('toxicity-sanitization');
      }
    });

    return sanitized;
  }

  /**
   * Removes dangerous tokens
   */
  private removeDangerousTokens(
    input: string,
    removedTokens: string[],
    correctionType: string[]
  ): { sanitized: string; modified: boolean } {
    let sanitized = input;
    let modified = false;

    this.DANGEROUS_TOKENS.forEach(token => {
      if (sanitized.includes(token)) {
        removedTokens.push(token);
        sanitized = sanitized.replace(new RegExp(this.escapeRegex(token), 'gi'), '');
        modified = true;
        correctionType.push('dangerous-token-removal');
      }
    });

    return { sanitized: sanitized.trim(), modified };
  }

  /**
   * Normalizes unicode characters
   */
  private normalizeUnicode(input: string): string {
    // Normalize unicode and remove zero-width characters
    return input
      .normalize('NFKC')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
      .trim();
  }

  /**
   * Calculates trust score impact based on sanitization
   */
  private calculateTrustScoreImpact(
    wasInjected: boolean,
    toxicityScore: number,
    sanitizationLevel: string
  ): number {
    if (wasInjected) return 0.1; // Slight positive for protecting user
    if (toxicityScore > 0.7) return 0.05; // Small positive for cleanup
    if (sanitizationLevel === 'heavy') return 0.0; // Neutral for heavy sanitization
    if (sanitizationLevel === 'moderate') return 0.02; // Small positive
    if (sanitizationLevel === 'light') return 0.05; // Positive for light cleanup
    return 0; // No impact for no sanitization
  }

  /**
   * Generates emotionally fluent recovery message
   */
  private async generateRecoveryMessage(
    wasInjected: boolean,
    toxicityScore: number,
    sanitizationLevel: string
  ): Promise<string> {
    if (wasInjected) {
      return "We noticed something unusual in your message and made some gentle adjustments to keep everything secure and steady. Your intent is preserved and we're here to help.";
    }

    if (toxicityScore > 0.7) {
      return "We've softly adjusted your message to keep things comfortable and supportive. Let's focus on moving forward together.";
    }

    if (sanitizationLevel === 'moderate') {
      return "We made a few small adjustments to your message to ensure everything flows smoothly. Your core message is intact.";
    }

    if (sanitizationLevel === 'light') {
      return "We've cleaned up your message slightly to keep everything clear and safe.";
    }

    return "Your message has been processed and is ready to go.";
  }

  /**
   * Generates emotionally fluent recovery message for replay scenarios
   * Preserves emotional continuity while acknowledging the replay context
   */
  private async generateReplayRecoveryMessage(
    originalContext: { wasInjected: boolean; toxicityScore: number; sanitizationLevel: string; originalRecoveryMessage: string }
  ): Promise<string> {
    // For replay scenarios, we want to maintain emotional continuity
    // while subtly acknowledging this is a replay
    
    if (originalContext.wasInjected) {
      return "Your message remains secure and ready. We've kept the same gentle adjustments to ensure everything stays steady and safe.";
    }

    if (originalContext.toxicityScore > 0.7) {
      return "Your message continues to be supportive and comfortable. We're maintaining the same caring adjustments as before.";
    }

    if (originalContext.sanitizationLevel === 'moderate') {
      return "Your message flows smoothly as before. The same thoughtful adjustments remain in place to keep everything clear.";
    }

    if (originalContext.sanitizationLevel === 'light') {
      return "Your message remains clean and safe, just as we prepared it before.";
    }

    return "Your message is ready to go, maintaining the same care and attention as before.";
  }

  /**
   * Logs sanitization correction to event bus
   */
  private async logSanitizationCorrection(
    originalInput: string,
    result: SanitizationResult,
    traceId: string
  ): Promise<void> {
    const correction: InputSanitizationCorrection = {
      type: 'inputSanitizationCorrection',
      originalInput: originalInput.substring(0, 100) + (originalInput.length > 100 ? '...' : ''),
      sanitizedInput: result.sanitized.substring(0, 100) + (result.sanitized.length > 100 ? '...' : ''),
      sanitizationLevel: result.sanitizationLevel,
      toxicityScore: result.toxicityScore,
      wasInjected: result.wasInjected,
      correctionReason: result.metadata.correctionType.join(', '),
      trustScoreImpact: result.trustScoreImpact,
      timestamp: result.metadata.timestamp,
      traceId,
    };

    await this.eventBus.emit('inputSanitizationCorrection', correction, 'InputSanitizer');
  }

  /**
   * Escapes regex special characters
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Validates that sanitized input can be safely replayed with emotional continuity
   */
  public async validateReplaySafety(
    sanitizedInput: string, 
    originalResult?: SanitizationResult
  ): Promise<boolean> {
    // Create replay context if original result is provided
    const replayContext = originalResult ? {
      wasInjected: originalResult.wasInjected,
      toxicityScore: originalResult.toxicityScore,
      sanitizationLevel: originalResult.sanitizationLevel,
      originalRecoveryMessage: originalResult.recoveryMessage || ''
    } : undefined;

    // Re-run sanitization with replay context to ensure idempotency and emotional continuity
    const replayResult = await this.sanitizeInput(sanitizedInput, `replay-${Date.now()}`, replayContext);
    
    // Validate technical safety (no additional modification needed)
    const isTechnicallySafe = !replayResult.wasModified;
    
    // Validate emotional continuity (recovery message should be present for replay)
    const hasEmotionalContinuity = replayContext ? (replayResult.recoveryMessage !== undefined) : true;
    
    return isTechnicallySafe && hasEmotionalContinuity;
  }

  /**
   * Validates input schema for unknown fields and potential injection vectors
   * Provides regression safety against new attack vectors
   */
  private validateInputSchema(input: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      unknownFields: [],
      potentialVectors: [],
      fallbackApplied: false,
      validationWarnings: []
    };

    // If input is a string, no schema validation needed
    if (typeof input === 'string') {
      return result;
    }

    // If input is an object, validate its structure
    if (typeof input === 'object' && input !== null) {
      const inputKeys = Object.keys(input);
      
      // Check for unknown fields
      for (const key of inputKeys) {
        if (!this.SAFE_SCHEMA_FIELDS.includes(key)) {
          result.unknownFields.push(key);
          result.isValid = false;
          
          // Check if unknown field contains potential injection vectors
          const fieldValue = input[key];
          if (typeof fieldValue === 'string') {
            const hasInjection = this.detectInjection(fieldValue);
            const hasDangerousTokens = this.DANGEROUS_TOKENS.some(token => 
              fieldValue.includes(token)
            );
            
            if (hasInjection || hasDangerousTokens) {
              result.potentialVectors.push(`${key}: ${fieldValue.substring(0, 50)}...`);
            }
          }
        }
      }

      // Generate validation warnings
      if (result.unknownFields.length > 0) {
        result.validationWarnings.push(
          `Unknown schema fields detected: ${result.unknownFields.join(', ')}. ` +
          `These fields will be sanitized with default safety rules.`
        );
      }

      if (result.potentialVectors.length > 0) {
        result.validationWarnings.push(
          `Potential injection vectors found in unknown fields. ` +
          `Enhanced sanitization will be applied.`
        );
      }
    }

    return result;
  }

  /**
   * Sanitizes unknown schema fields with default safety rules
   */
  private sanitizeUnknownFields(input: any, schemaValidation: SchemaValidationResult): any {
    if (typeof input !== 'object' || input === null) {
      return input;
    }

    const sanitized = { ...input };
    
    for (const unknownField of schemaValidation.unknownFields) {
      if (sanitized[unknownField] && typeof sanitized[unknownField] === 'string') {
        // Apply aggressive sanitization to unknown fields
        let fieldValue = sanitized[unknownField];
        
        // Remove all dangerous tokens
        this.DANGEROUS_TOKENS.forEach(token => {
          fieldValue = fieldValue.replace(new RegExp(this.escapeRegex(token), 'gi'), '');
        });
        
        // Remove injection patterns
        this.INJECTION_PATTERNS.forEach(pattern => {
          fieldValue = fieldValue.replace(pattern, '');
        });
        
        // Normalize unicode
        fieldValue = this.normalizeUnicode(fieldValue);
        
        sanitized[unknownField] = fieldValue.trim();
      }
    }

    return sanitized;
  }
} 