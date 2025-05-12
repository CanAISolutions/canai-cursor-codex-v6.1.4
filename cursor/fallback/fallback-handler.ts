/**
 * Fallback Handler
 * 
 * Handles interpretation of complex inputs when rules and TinyLLM fail.
 * Uses larger models (gpt-3.5 or Claude Haiku) for maximum accuracy.
 */

import { EmotionalValidator } from '../validators/emotional-validator';
import { EventBus } from '../event-bus/eventBus';

interface FallbackResult {
  businessType: string;
  primaryGoal: string;
  tone: string;
  challenges: string[];
  motivator: string;
  confidence: number;
}

interface FallbackConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export class FallbackHandler {
  private config: FallbackConfig;
  private emotionalValidator: EmotionalValidator;
  private eventBus: EventBus;

  constructor(model: string) {
    this.config = {
      model,
      maxTokens: 250,
      temperature: 0.2,
      topP: 0.95
    };
    this.emotionalValidator = new EmotionalValidator();
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Interpret input using fallback model
   * Returns structured result with confidence score
   */
  async interpret(input: string): Promise<FallbackResult> {
    try {
      // Prepare prompt for intent extraction
      const prompt = this.buildPrompt(input);
      
      // Call fallback model API
      const response = await this.callFallbackModel(prompt);
      
      // Parse and validate response
      const result = this.parseResponse(response);
      
      // Calculate confidence
      const confidence = await this.calculateConfidence(result);
      
      // Log interpretation
      await this.logInterpretation(input, result, confidence);
      
      return {
        ...result,
        confidence
      };
    } catch (error: unknown) {
      // Log error and return low confidence result
      await this.logError(error instanceof Error ? error : new Error(String(error)));
      return this.getFallbackResult();
    }
  }

  /**
   * Build prompt for intent extraction
   */
  private buildPrompt(input: string): string {
    return `
      Extract the following information from this business plan input:
      - Business type (saas, ecommerce, healthcare, fintech)
      - Primary goal (launch, scale, optimize, pivot)
      - Tone (professional, casual, enthusiastic, strategic)
      - Key challenges (list)
      - Main motivator (why they're doing this)

      Input: "${input}"

      Format the response as JSON with these fields:
      {
        "businessType": string,
        "primaryGoal": string,
        "tone": string,
        "challenges": string[],
        "motivator": string
      }

      Note: Be conservative in your interpretation. If uncertain, use "unknown".
    `;
  }

  /**
   * Call fallback model API
   */
  private async callFallbackModel(prompt: string): Promise<string> {
    // TODO: Implement actual fallback model API call
    // For now, return mock response
    return JSON.stringify({
      businessType: 'saas',
      primaryGoal: 'launch',
      tone: 'professional',
      challenges: ['market validation', 'user acquisition'],
      motivator: 'solve inefficiency in current market'
    });
  }

  /**
   * Parse and validate fallback model response
   */
  private parseResponse(response: string): Omit<FallbackResult, 'confidence'> {
    try {
      const parsed = JSON.parse(response);
      
      // Validate required fields
      if (!this.validateFields(parsed)) {
        throw new Error('Invalid response format');
      }
      
      return {
        businessType: parsed.businessType,
        primaryGoal: parsed.primaryGoal,
        tone: parsed.tone,
        challenges: parsed.challenges,
        motivator: parsed.motivator
      };
    } catch (error: unknown) {
      throw new Error(`Failed to parse fallback model response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate required fields in parsed response
   */
  private validateFields(parsed: any): boolean {
    return (
      typeof parsed.businessType === 'string' &&
      typeof parsed.primaryGoal === 'string' &&
      typeof parsed.tone === 'string' &&
      Array.isArray(parsed.challenges) &&
      typeof parsed.motivator === 'string'
    );
  }

  /**
   * Calculate confidence score based on multiple factors
   */
  private async calculateConfidence(
    result: Omit<FallbackResult, 'confidence'>
  ): Promise<number> {
    // Validate tone alignment
    const toneScore = await this.emotionalValidator.validateEmotionalTone(result.tone);
    
    // Calculate field completeness
    const completenessScore = this.calculateCompleteness(result);
    
    // Calculate semantic coherence
    const coherenceScore = this.calculateCoherence(result);
    
    // Weight and combine scores
    return (
      toneScore * 0.4 +
      completenessScore * 0.3 +
      coherenceScore * 0.3
    );
  }

  /**
   * Calculate completeness score
   */
  private calculateCompleteness(result: Omit<FallbackResult, 'confidence'>): number {
    let score = 0;
    let total = 0;

    // Business type
    if (result.businessType !== 'unknown') {
      score += 1;
    }
    total += 1;

    // Primary goal
    if (result.primaryGoal !== 'unknown') {
      score += 1;
    }
    total += 1;

    // Tone
    if (result.tone !== 'professional') {
      score += 1;
    }
    total += 1;

    // Challenges
    if (result.challenges.length > 0) {
      score += Math.min(result.challenges.length / 2, 1);
    }
    total += 1;

    // Motivator
    if (result.motivator !== 'unknown') {
      score += 1;
    }
    total += 1;

    return score / total;
  }

  /**
   * Calculate semantic coherence score
   */
  private calculateCoherence(result: Omit<FallbackResult, 'confidence'>): number {
    // TODO: Implement semantic coherence check
    // For now, return default score
    return 0.8;
  }

  /**
   * Log interpretation results
   */
  private async logInterpretation(
    input: string,
    result: Omit<FallbackResult, 'confidence'>,
    confidence: number
  ): Promise<void> {
    await this.eventBus.emit('fallback-interpretation', {
      input,
      result,
      confidence,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log error
   */
  private async logError(error: Error): Promise<void> {
    await this.eventBus.emit('fallback-error', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get fallback result for error cases
   */
  private getFallbackResult(): FallbackResult {
    return {
      businessType: 'unknown',
      primaryGoal: 'unknown',
      tone: 'professional',
      challenges: [],
      motivator: 'unknown',
      confidence: 0.3
    };
  }
} 