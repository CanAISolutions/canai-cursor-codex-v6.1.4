/**
 * CanAI JSON Flattening System for Make.com Integration v6.1.4
 * Handles complex nested objects with 3-level nesting support
 * 
 * Framework: Codex v6.1.4 - Emotional Sovereignty Manifesto Aligned
 * Purpose: Flatten complex JSON structures for Make.com webhook compatibility
 * Target: Support 1,000 concurrent webhooks with bottleneck analysis
 */

import { createHash } from 'crypto';

// Interface definitions for complex nested objects
interface BusinessPlanPrompt {
  businessName: string;
  industry: string;
  targetMarket: string;
  businessModel: string;
  uniqueValueProposition: string;
  competitiveAdvantage: string;
  
  // Level 2 nesting: financials object
  financials: {
    startupCosts: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    breakEvenPoint: number;
    fundingNeeded: number;
    
    // Level 3 nesting: emotionalDrivers within financials
    emotionalDrivers: {
      marketNeed: string;
      personalMotivation: string;
      riskTolerance: string;
      successVision: string;
    };
  };
  
  // Level 2 nesting: emotionalContext object
  emotionalContext: {
    entrepreneurialStyle: string;
    communicationPreference: string;
    decisionMakingStyle: string;
    stressManagement: string;
    
    // Level 3 nesting: marketingApproach within emotionalContext
    marketingApproach: {
      brandPersonality: string;
      customerEngagement: string;
      contentStrategy: string;
      socialMediaStyle: string;
    };
  };
  
  // Level 2 nesting: enhancers object
  enhancers: {
    industryInsights: string[];
    competitorAnalysis: string[];
    marketTrends: string[];
    riskMitigation: string[];
  };
}

interface SparkSplitPrompt {
  deliveredProduct: string;
  userSatisfaction: string;
  trustContext: string;
  productType?: string;
  deliveryQuality?: string;
  emotionalResonance?: string;
  
  // Level 2 nesting: trustEvolution object
  trustEvolution: {
    initialTrust: number;
    currentTrust: number;
    trustDelta: number;
    trustFactors: string[];
    
    // Level 3 nesting: trustBreakdown within trustEvolution
    trustBreakdown: {
      competence: number;
      reliability: number;
      transparency: number;
      empathy: number;
    };
  };
  
  // Level 2 nesting: emotionalContext object
  emotionalContext: {
    userMood: string;
    expectationLevel: string;
    previousExperience: string;
    emotionalState: string;
    
    // Level 3 nesting: emotionalCompass within emotionalContext
    emotionalCompass: {
      awe: number;
      ownership: number;
      wonder: number;
      calm: number;
      power: number;
    };
  };
  
  // Level 2 nesting: enhancers object with arrays
  enhancers: {
    qualityIndicators: string[];
    sparkRevelationMoments: string[];
    emotions: string[];
    improvementSuggestions: string[];
  };
}

// Make.com webhook compatibility interfaces
interface MakeComWebhookPayload {
  [key: string]: string | number | boolean | null; // Flat structure only
}

interface WebhookBottleneckAnalysis {
  concurrentWebhooks: number;
  averageProcessingTime: number; // milliseconds
  peakMemoryUsage: number; // MB
  errorRate: number; // 0-1 scale
  bottleneckRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface FlatteningResult {
  flattened: MakeComWebhookPayload;
  originalSize: number; // bytes
  flattenedSize: number; // bytes
  compressionRatio: number; // 0-1 scale
  fieldCount: number;
  nestingLevelsReduced: number;
  processingTime: number; // milliseconds
}

interface FieldLimitValidation {
  totalFields: number;
  makeComLimit: number; // Make.com field limit
  withinLimit: boolean;
  excessFields: number;
  recommendations: string[];
}

export class JsonFlattener {
  private readonly MAKECOM_FIELD_LIMIT = 1000; // Make.com webhook field limit
  private readonly MAX_FIELD_NAME_LENGTH = 100; // Make.com field name limit
  private readonly SEPARATOR = '.'; // Dot notation separator
  private readonly ARRAY_SEPARATOR = '_'; // Array index separator
  
  private performanceMetrics: {
    totalFlattened: number;
    averageProcessingTime: number;
    totalFieldsProcessed: number;
    errorCount: number;
  } = {
    totalFlattened: 0,
    averageProcessingTime: 0,
    totalFieldsProcessed: 0,
    errorCount: 0
  };

  /**
   * Flatten BusinessPlanPrompt with 3-level nesting support
   * What: Converts complex nested BusinessPlanPrompt to flat Make.com compatible structure
   * Why: Make.com requires flat JSON structures for webhook processing
   * How: Recursive flattening with dot notation and array handling
   */
  flattenBusinessPlanPrompt(prompt: BusinessPlanPrompt): FlatteningResult {
    const startTime = Date.now();
    
    try {
      const originalJson = JSON.stringify(prompt);
      const originalSize = Buffer.byteLength(originalJson, 'utf8');
      
      // Flatten the complex structure
      const flattened: MakeComWebhookPayload = {
        // Level 1 fields (direct)
        businessName: prompt.businessName,
        industry: prompt.industry,
        targetMarket: prompt.targetMarket,
        businessModel: prompt.businessModel,
        uniqueValueProposition: prompt.uniqueValueProposition,
        competitiveAdvantage: prompt.competitiveAdvantage,
        
        // Level 2 fields (financials.*)
        'financials.startupCosts': prompt.financials.startupCosts,
        'financials.monthlyRevenue': prompt.financials.monthlyRevenue,
        'financials.monthlyExpenses': prompt.financials.monthlyExpenses,
        'financials.breakEvenPoint': prompt.financials.breakEvenPoint,
        'financials.fundingNeeded': prompt.financials.fundingNeeded,
        
        // Level 3 fields (financials.emotionalDrivers.*)
        'financials.emotionalDrivers.marketNeed': prompt.financials.emotionalDrivers.marketNeed,
        'financials.emotionalDrivers.personalMotivation': prompt.financials.emotionalDrivers.personalMotivation,
        'financials.emotionalDrivers.riskTolerance': prompt.financials.emotionalDrivers.riskTolerance,
        'financials.emotionalDrivers.successVision': prompt.financials.emotionalDrivers.successVision,
        
        // Level 2 fields (emotionalContext.*)
        'emotionalContext.entrepreneurialStyle': prompt.emotionalContext.entrepreneurialStyle,
        'emotionalContext.communicationPreference': prompt.emotionalContext.communicationPreference,
        'emotionalContext.decisionMakingStyle': prompt.emotionalContext.decisionMakingStyle,
        'emotionalContext.stressManagement': prompt.emotionalContext.stressManagement,
        
        // Level 3 fields (emotionalContext.marketingApproach.*)
        'emotionalContext.marketingApproach.brandPersonality': prompt.emotionalContext.marketingApproach.brandPersonality,
        'emotionalContext.marketingApproach.customerEngagement': prompt.emotionalContext.marketingApproach.customerEngagement,
        'emotionalContext.marketingApproach.contentStrategy': prompt.emotionalContext.marketingApproach.contentStrategy,
        'emotionalContext.marketingApproach.socialMediaStyle': prompt.emotionalContext.marketingApproach.socialMediaStyle,
        
        // Level 2 fields (enhancers.* arrays)
        ...this.flattenArrayFields('enhancers.industryInsights', prompt.enhancers.industryInsights),
        ...this.flattenArrayFields('enhancers.competitorAnalysis', prompt.enhancers.competitorAnalysis),
        ...this.flattenArrayFields('enhancers.marketTrends', prompt.enhancers.marketTrends),
        ...this.flattenArrayFields('enhancers.riskMitigation', prompt.enhancers.riskMitigation)
      };
      
      const flattenedJson = JSON.stringify(flattened);
      const flattenedSize = Buffer.byteLength(flattenedJson, 'utf8');
      const processingTime = Date.now() - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(processingTime, Object.keys(flattened).length);
      
      return {
        flattened,
        originalSize,
        flattenedSize,
        compressionRatio: flattenedSize / originalSize,
        fieldCount: Object.keys(flattened).length,
        nestingLevelsReduced: 3, // BusinessPlanPrompt has 3 levels
        processingTime
      };
    } catch (error) {
      this.performanceMetrics.errorCount++;
      throw new Error(`BusinessPlanPrompt flattening failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Flatten SparkSplitPrompt with trust analysis support
   * What: Converts complex nested SparkSplitPrompt to flat Make.com compatible structure
   * Why: SparkSplit requires trust metrics and emotional compass flattening
   * How: Specialized flattening for trust evolution and emotional context
   */
  flattenSparkSplitPrompt(prompt: SparkSplitPrompt): FlatteningResult {
    const startTime = Date.now();
    
    try {
      const originalJson = JSON.stringify(prompt);
      const originalSize = Buffer.byteLength(originalJson, 'utf8');
      
      // Flatten the SparkSplit structure
      const flattened: MakeComWebhookPayload = {
        // Level 1 fields (direct)
        deliveredProduct: prompt.deliveredProduct,
        userSatisfaction: prompt.userSatisfaction,
        trustContext: prompt.trustContext,
        productType: prompt.productType || null,
        deliveryQuality: prompt.deliveryQuality || null,
        emotionalResonance: prompt.emotionalResonance || null,
        
        // Level 2 fields (trustEvolution.*)
        'trustEvolution.initialTrust': prompt.trustEvolution.initialTrust,
        'trustEvolution.currentTrust': prompt.trustEvolution.currentTrust,
        'trustEvolution.trustDelta': prompt.trustEvolution.trustDelta,
        
        // Level 3 fields (trustEvolution.trustBreakdown.*)
        'trustEvolution.trustBreakdown.competence': prompt.trustEvolution.trustBreakdown.competence,
        'trustEvolution.trustBreakdown.reliability': prompt.trustEvolution.trustBreakdown.reliability,
        'trustEvolution.trustBreakdown.transparency': prompt.trustEvolution.trustBreakdown.transparency,
        'trustEvolution.trustBreakdown.empathy': prompt.trustEvolution.trustBreakdown.empathy,
        
        // Level 2 fields (emotionalContext.*)
        'emotionalContext.userMood': prompt.emotionalContext.userMood,
        'emotionalContext.expectationLevel': prompt.emotionalContext.expectationLevel,
        'emotionalContext.previousExperience': prompt.emotionalContext.previousExperience,
        'emotionalContext.emotionalState': prompt.emotionalContext.emotionalState,
        
        // Level 3 fields (emotionalContext.emotionalCompass.*)
        'emotionalContext.emotionalCompass.awe': prompt.emotionalContext.emotionalCompass.awe,
        'emotionalContext.emotionalCompass.ownership': prompt.emotionalContext.emotionalCompass.ownership,
        'emotionalContext.emotionalCompass.wonder': prompt.emotionalContext.emotionalCompass.wonder,
        'emotionalContext.emotionalCompass.calm': prompt.emotionalContext.emotionalCompass.calm,
        'emotionalContext.emotionalCompass.power': prompt.emotionalContext.emotionalCompass.power,
        
        // Level 2 fields (enhancers.* arrays)
        ...this.flattenArrayFields('enhancers.qualityIndicators', prompt.enhancers.qualityIndicators),
        ...this.flattenArrayFields('enhancers.sparkRevelationMoments', prompt.enhancers.sparkRevelationMoments),
        ...this.flattenArrayFields('enhancers.emotions', prompt.enhancers.emotions),
        ...this.flattenArrayFields('enhancers.improvementSuggestions', prompt.enhancers.improvementSuggestions),
        
        // Trust factors array flattening
        ...this.flattenArrayFields('trustEvolution.trustFactors', prompt.trustEvolution.trustFactors)
      };
      
      const flattenedJson = JSON.stringify(flattened);
      const flattenedSize = Buffer.byteLength(flattenedJson, 'utf8');
      const processingTime = Date.now() - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(processingTime, Object.keys(flattened).length);
      
      return {
        flattened,
        originalSize,
        flattenedSize,
        compressionRatio: flattenedSize / originalSize,
        fieldCount: Object.keys(flattened).length,
        nestingLevelsReduced: 3, // SparkSplitPrompt has 3 levels
        processingTime
      };
    } catch (error) {
      this.performanceMetrics.errorCount++;
      throw new Error(`SparkSplitPrompt flattening failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generic object flattening with depth control
   * What: Flattens any nested object structure with configurable depth
   * Why: Provides fallback for unknown object structures
   * How: Recursive traversal with depth limiting and type safety
   */
  flattenGenericObject(obj: any, maxDepth: number = 5): FlatteningResult {
    const startTime = Date.now();
    
    try {
      const originalJson = JSON.stringify(obj);
      const originalSize = Buffer.byteLength(originalJson, 'utf8');
      
      const flattened = this.recursiveFlatten(obj, '', maxDepth);
      
      const flattenedJson = JSON.stringify(flattened);
      const flattenedSize = Buffer.byteLength(flattenedJson, 'utf8');
      const processingTime = Date.now() - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(processingTime, Object.keys(flattened).length);
      
      return {
        flattened,
        originalSize,
        flattenedSize,
        compressionRatio: flattenedSize / originalSize,
        fieldCount: Object.keys(flattened).length,
        nestingLevelsReduced: maxDepth,
        processingTime
      };
    } catch (error) {
      this.performanceMetrics.errorCount++;
      throw new Error(`Generic object flattening failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Flatten array fields with indexed keys
   * What: Converts arrays to indexed flat fields for Make.com compatibility
   * Why: Make.com doesn't handle arrays natively in webhooks
   * How: Creates indexed keys (field_0, field_1, etc.) for array elements
   */
  private flattenArrayFields(prefix: string, array: string[]): MakeComWebhookPayload {
    const result: MakeComWebhookPayload = {};
    
    if (!Array.isArray(array)) {
      return result;
    }
    
    array.forEach((item, index) => {
      const key = `${prefix}${this.ARRAY_SEPARATOR}${index}`;
      if (key.length <= this.MAX_FIELD_NAME_LENGTH) {
        result[key] = item;
      }
    });
    
    // Add array length for reference
    result[`${prefix}${this.ARRAY_SEPARATOR}length`] = array.length;
    
    return result;
  }

  /**
   * Recursive object flattening with depth control
   * What: Recursively flattens nested objects with dot notation
   * Why: Handles arbitrary nesting levels with safety controls
   * How: Depth-first traversal with type checking and field limits
   */
  private recursiveFlatten(obj: any, prefix: string, maxDepth: number): MakeComWebhookPayload {
    const result: MakeComWebhookPayload = {};
    
    if (maxDepth <= 0 || obj === null || obj === undefined) {
      return result;
    }
    
    if (typeof obj !== 'object') {
      if (prefix.length <= this.MAX_FIELD_NAME_LENGTH) {
        result[prefix] = obj;
      }
      return result;
    }
    
    if (Array.isArray(obj)) {
      return this.flattenArrayFields(prefix, obj);
    }
    
    for (const [key, value] of Object.entries(obj)) {
      const newPrefix = prefix ? `${prefix}${this.SEPARATOR}${key}` : key;
      
      if (newPrefix.length > this.MAX_FIELD_NAME_LENGTH) {
        continue; // Skip fields with names too long
      }
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          Object.assign(result, this.flattenArrayFields(newPrefix, value));
        } else {
          Object.assign(result, this.recursiveFlatten(value, newPrefix, maxDepth - 1));
        }
      } else {
        result[newPrefix] = value as string | number | boolean | null;
      }
    }
    
    return result;
  }

  /**
   * Validate Make.com field limits
   * What: Checks if flattened object exceeds Make.com webhook limits
   * Why: Make.com has field count and size limitations
   * How: Counts fields and provides optimization recommendations
   */
  validateFieldLimits(flattened: MakeComWebhookPayload): FieldLimitValidation {
    const totalFields = Object.keys(flattened).length;
    const withinLimit = totalFields <= this.MAKECOM_FIELD_LIMIT;
    const excessFields = Math.max(0, totalFields - this.MAKECOM_FIELD_LIMIT);
    
    const recommendations: string[] = [];
    
    if (!withinLimit) {
      recommendations.push(`Reduce field count by ${excessFields} fields`);
      recommendations.push('Consider grouping related fields');
      recommendations.push('Use array compression for repeated data');
      recommendations.push('Remove optional or computed fields');
    }
    
    if (totalFields > this.MAKECOM_FIELD_LIMIT * 0.8) {
      recommendations.push('Approaching field limit - consider optimization');
    }
    
    return {
      totalFields,
      makeComLimit: this.MAKECOM_FIELD_LIMIT,
      withinLimit,
      excessFields,
      recommendations
    };
  }

  /**
   * Analyze webhook bottlenecks with concurrent processing
   * What: Tests webhook processing performance under load
   * Why: Identifies bottlenecks before production deployment
   * How: Simulates concurrent webhook processing with performance metrics
   */
  async analyzeWebhookBottlenecks(concurrentWebhooks: number = 1000): Promise<WebhookBottleneckAnalysis> {
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    
    const testPromises: Promise<FlatteningResult>[] = [];
    let errorCount = 0;
    
    // Create test data
    const testBusinessPlan = this.createTestBusinessPlan();
    const testSparkSplit = this.createTestSparkSplit();
    
    // Simulate concurrent webhook processing
    for (let i = 0; i < concurrentWebhooks; i++) {
      const isBusinessPlan = i % 2 === 0;
      
      const promise = isBusinessPlan 
        ? Promise.resolve(this.flattenBusinessPlanPrompt(testBusinessPlan))
        : Promise.resolve(this.flattenSparkSplitPrompt(testSparkSplit));
      
      testPromises.push(
        promise.catch(error => {
          errorCount++;
          throw error;
        })
      );
    }
    
    try {
      const results = await Promise.allSettled(testPromises);
      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<FlatteningResult>).value);
      
      const totalProcessingTime = Date.now() - startTime;
      const averageProcessingTime = successfulResults.length > 0 
        ? successfulResults.reduce((sum, result) => sum + result.processingTime, 0) / successfulResults.length
        : 0;
      
      const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      const peakMemoryUsage = memoryAfter - memoryBefore;
      
      const errorRate = errorCount / concurrentWebhooks;
      
      // Determine bottleneck risk
      let bottleneckRisk: 'low' | 'medium' | 'high' | 'critical';
      const recommendations: string[] = [];
      
      if (averageProcessingTime > 500 || errorRate > 0.05 || peakMemoryUsage > 1000) {
        bottleneckRisk = 'critical';
        recommendations.push('Critical performance issues detected');
        recommendations.push('Consider horizontal scaling');
        recommendations.push('Implement circuit breaker pattern');
      } else if (averageProcessingTime > 200 || errorRate > 0.02 || peakMemoryUsage > 500) {
        bottleneckRisk = 'high';
        recommendations.push('High resource usage detected');
        recommendations.push('Implement Redis caching');
        recommendations.push('Consider async processing');
      } else if (averageProcessingTime > 100 || errorRate > 0.01 || peakMemoryUsage > 250) {
        bottleneckRisk = 'medium';
        recommendations.push('Moderate performance impact');
        recommendations.push('Monitor memory usage');
        recommendations.push('Consider connection pooling');
      } else {
        bottleneckRisk = 'low';
        recommendations.push('Performance within acceptable limits');
        recommendations.push('Continue monitoring');
      }
      
      return {
        concurrentWebhooks,
        averageProcessingTime,
        peakMemoryUsage,
        errorRate,
        bottleneckRisk,
        recommendations
      };
    } catch (error) {
      return {
        concurrentWebhooks,
        averageProcessingTime: 0,
        peakMemoryUsage: 0,
        errorRate: 1,
        bottleneckRisk: 'critical',
        recommendations: [
          'Webhook processing failed completely',
          'Check system resources',
          'Implement error handling'
        ]
      };
    }
  }

  /**
   * Update internal performance metrics
   */
  private updatePerformanceMetrics(processingTime: number, fieldCount: number): void {
    this.performanceMetrics.totalFlattened++;
    this.performanceMetrics.averageProcessingTime = 
      (this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.totalFlattened - 1) + processingTime) / 
      this.performanceMetrics.totalFlattened;
    this.performanceMetrics.totalFieldsProcessed += fieldCount;
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Create test BusinessPlanPrompt for bottleneck analysis
   */
  private createTestBusinessPlan(): BusinessPlanPrompt {
    return {
      businessName: 'Test Business',
      industry: 'Technology',
      targetMarket: 'Small businesses',
      businessModel: 'SaaS',
      uniqueValueProposition: 'AI-powered automation',
      competitiveAdvantage: 'Emotional intelligence',
      financials: {
        startupCosts: 50000,
        monthlyRevenue: 10000,
        monthlyExpenses: 7000,
        breakEvenPoint: 12,
        fundingNeeded: 100000,
        emotionalDrivers: {
          marketNeed: 'High demand for automation',
          personalMotivation: 'Solve real problems',
          riskTolerance: 'Moderate',
          successVision: 'Market leader in 5 years'
        }
      },
      emotionalContext: {
        entrepreneurialStyle: 'Collaborative',
        communicationPreference: 'Direct',
        decisionMakingStyle: 'Data-driven',
        stressManagement: 'Proactive',
        marketingApproach: {
          brandPersonality: 'Trustworthy',
          customerEngagement: 'Educational',
          contentStrategy: 'Value-first',
          socialMediaStyle: 'Professional'
        }
      },
      enhancers: {
        industryInsights: ['AI adoption growing', 'Remote work trend'],
        competitorAnalysis: ['Competitor A weak in UX', 'Competitor B expensive'],
        marketTrends: ['Automation demand', 'Cost reduction focus'],
        riskMitigation: ['Diversified revenue', 'Strong team']
      }
    };
  }

  /**
   * Create test SparkSplitPrompt for bottleneck analysis
   */
  private createTestSparkSplit(): SparkSplitPrompt {
    return {
      deliveredProduct: 'Business Plan',
      userSatisfaction: 'Highly satisfied',
      trustContext: 'First-time user',
      productType: 'business_plan',
      deliveryQuality: 'Excellent',
      emotionalResonance: 'Strong',
      trustEvolution: {
        initialTrust: 3.5,
        currentTrust: 4.8,
        trustDelta: 1.3,
        trustFactors: ['Quality output', 'Fast delivery', 'Clear communication'],
        trustBreakdown: {
          competence: 4.9,
          reliability: 4.7,
          transparency: 4.8,
          empathy: 4.6
        }
      },
      emotionalContext: {
        userMood: 'Optimistic',
        expectationLevel: 'High',
        previousExperience: 'None',
        emotionalState: 'Excited',
        emotionalCompass: {
          awe: 0.85,
          ownership: 0.92,
          wonder: 0.78,
          calm: 0.88,
          power: 0.91
        }
      },
      enhancers: {
        qualityIndicators: ['Comprehensive', 'Actionable', 'Professional'],
        sparkRevelationMoments: ['Market insight', 'Financial clarity'],
        emotions: ['Confidence', 'Excitement', 'Trust'],
        improvementSuggestions: ['Add more examples', 'Include templates']
      }
    };
  }

  /**
   * Generate webhook hash for deduplication
   */
  generateWebhookHash(payload: MakeComWebhookPayload): string {
    const sortedPayload = Object.keys(payload).sort().reduce((result, key) => {
      result[key] = payload[key];
      return result;
    }, {} as MakeComWebhookPayload);
    
    return createHash('sha256').update(JSON.stringify(sortedPayload)).digest('hex');
  }

  /**
   * Estimate webhook payload size
   */
  estimateWebhookSize(payload: MakeComWebhookPayload): number {
    return Buffer.byteLength(JSON.stringify(payload), 'utf8');
  }

  /**
   * Validate Make.com compatibility
   */
  validateMakeComCompatibility(payload: MakeComWebhookPayload): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check field count
    const fieldCount = Object.keys(payload).length;
    if (fieldCount > this.MAKECOM_FIELD_LIMIT) {
      issues.push(`Too many fields: ${fieldCount} > ${this.MAKECOM_FIELD_LIMIT}`);
      recommendations.push('Reduce field count or split into multiple webhooks');
    }
    
    // Check field name lengths
    for (const key of Object.keys(payload)) {
      if (key.length > this.MAX_FIELD_NAME_LENGTH) {
        issues.push(`Field name too long: ${key}`);
        recommendations.push('Shorten field names or use abbreviations');
      }
    }
    
    // Check payload size
    const size = this.estimateWebhookSize(payload);
    if (size > 1024 * 1024) { // 1MB limit
      issues.push(`Payload too large: ${size} bytes`);
      recommendations.push('Reduce payload size or use chunking');
    }
    
    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }
}

// Export convenience functions
export function createJsonFlattener(): JsonFlattener {
  return new JsonFlattener();
}

// Quick flattening function for simple use cases
export function flattenForMakeCom(obj: any): MakeComWebhookPayload {
  const flattener = new JsonFlattener();
  return flattener.flattenGenericObject(obj).flattened;
}

// Validation function for Make.com payloads
export function validateMakeComPayload(payload: MakeComWebhookPayload): boolean {
  const flattener = new JsonFlattener();
  return flattener.validateMakeComCompatibility(payload).compatible;
} 