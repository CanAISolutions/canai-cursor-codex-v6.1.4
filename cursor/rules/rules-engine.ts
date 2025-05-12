/**
 * Rules Engine
 * 
 * Handles interpretation of simple, structured inputs using rule-based logic.
 * Provides fast, deterministic results for clear-cut cases.
 */

import { EmotionalValidator } from '../validators/emotional-validator';

interface RulesResult {
  businessType: string;
  primaryGoal: string;
  tone: string;
  challenges: string[];
  motivator: string;
  confidence: number;
}

export class RulesEngine {
  private emotionalValidator: EmotionalValidator;
  private businessTypePatterns: Map<string, RegExp> = new Map();
  private goalPatterns: Map<string, RegExp> = new Map();
  private tonePatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.emotionalValidator = new EmotionalValidator();
    this.initializePatterns();
  }

  /**
   * Initialize regex patterns for business types, goals, and tones
   */
  private initializePatterns(): void {
    // Business type patterns
    this.businessTypePatterns = new Map([
      ['saas', /saas|software|subscription|platform/i],
      ['ecommerce', /ecommerce|online store|shopify|retail/i],
      ['healthcare', /healthcare|medical|health|wellness/i],
      ['fintech', /fintech|financial|banking|payments/i]
    ]);

    // Goal patterns
    this.goalPatterns = new Map([
      ['launch', /launch|start|begin|create/i],
      ['scale', /scale|grow|expand|increase/i],
      ['optimize', /optimize|improve|enhance|better/i],
      ['pivot', /pivot|change|shift|transform/i]
    ]);

    // Tone patterns (must match CanAI tone whitelist)
    this.tonePatterns = new Map([
      ['professional', /professional|formal|business/i],
      ['casual', /casual|friendly|relaxed/i],
      ['enthusiastic', /enthusiastic|excited|passionate/i],
      ['strategic', /strategic|analytical|methodical/i]
    ]);
  }

  /**
   * Interpret input using rule-based logic
   * Returns structured result with confidence score
   */
  async interpret(input: string): Promise<RulesResult> {
    const businessType = this.extractBusinessType(input);
    const primaryGoal = this.extractPrimaryGoal(input);
    const tone = this.extractTone(input);
    const challenges = this.extractChallenges(input);
    const motivator = this.extractMotivator(input);

    // Calculate confidence based on pattern matches
    const confidence = this.calculateConfidence({
      businessType,
      primaryGoal,
      tone,
      challenges,
      motivator
    });

    return {
      businessType,
      primaryGoal,
      tone,
      challenges,
      motivator,
      confidence
    };
  }

  /**
   * Extract business type from input
   */
  private extractBusinessType(input: string): string {
    for (const [type, pattern] of this.businessTypePatterns) {
      if (pattern.test(input)) {
        return type;
      }
    }
    return 'unknown';
  }

  /**
   * Extract primary goal from input
   */
  private extractPrimaryGoal(input: string): string {
    for (const [goal, pattern] of this.goalPatterns) {
      if (pattern.test(input)) {
        return goal;
      }
    }
    return 'unknown';
  }

  /**
   * Extract tone from input
   */
  private extractTone(input: string): string {
    for (const [tone, pattern] of this.tonePatterns) {
      if (pattern.test(input)) {
        return tone;
      }
    }
    return 'professional'; // Default to professional tone
  }

  /**
   * Extract challenges from input
   */
  private extractChallenges(input: string): string[] {
    const challengePatterns = [
      /challenge|problem|issue|difficulty|obstacle/i,
      /need|want|looking for|trying to/i,
      /struggle|pain point|frustration/i
    ];

    return challengePatterns
      .map(pattern => {
        const match = input.match(new RegExp(`${pattern.source}.*?(?=\\.|$)`, 'i'));
        return match ? match[0].trim() : null;
      })
      .filter((challenge): challenge is string => challenge !== null);
  }

  /**
   * Extract motivator from input
   */
  private extractMotivator(input: string): string {
    const motivatorPatterns = [
      /because|since|as|due to/i,
      /motivated by|driven by|inspired by/i,
      /goal is|aiming to|trying to/i
    ];

    for (const pattern of motivatorPatterns) {
      const match = input.match(new RegExp(`${pattern.source}.*?(?=\\.|$)`, 'i'));
      if (match) {
        return match[0].trim();
      }
    }

    return 'unknown';
  }

  /**
   * Calculate confidence score based on extracted information
   */
  private calculateConfidence(result: Omit<RulesResult, 'confidence'>): number {
    let score = 0;
    let total = 0;

    // Business type confidence
    if (result.businessType !== 'unknown') {
      score += 1;
    }
    total += 1;

    // Primary goal confidence
    if (result.primaryGoal !== 'unknown') {
      score += 1;
    }
    total += 1;

    // Tone confidence
    if (result.tone !== 'professional') {
      score += 1;
    }
    total += 1;

    // Challenges confidence
    if (result.challenges.length > 0) {
      score += Math.min(result.challenges.length / 2, 1);
    }
    total += 1;

    // Motivator confidence
    if (result.motivator !== 'unknown') {
      score += 1;
    }
    total += 1;

    return score / total;
  }
} 