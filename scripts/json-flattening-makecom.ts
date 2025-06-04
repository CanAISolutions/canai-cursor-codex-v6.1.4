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
        
        // Level 2 arrays (enhancers.*)
        ...this.flattenArrayFields('enhancers.industryInsights', prompt.enhancers.industryInsights),
        ...this.flattenArrayFields('enhancers.competitorAnalysis', prompt.enhancers.competitorAnalysis),
        ...this.flattenArrayFields('enhancers.marketTrends', prompt.enhancers.marketTrends),
        ...this.flattenArrayFields('enhancers.riskMitigation', prompt.enhancers.riskMitigation),
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
        nestingLevelsReduced: 3,
        processingTime
      };
    } catch (error: any) {
      this.performanceMetrics.errorCount++;
      throw new Error(`BusinessPlanPrompt flattening failed: ${error.message}`);
    }
  }

  /**
   * Flatten SparkSplitPrompt with complex arrays and nested objects
   * What: Converts SparkSplitPrompt to flat Make.com compatible structure
   * Why: SparkSplit data needs to be processed by Make.com for trust analytics
   * How: Handles arrays, nested objects, and emotional compass data
   */
  flattenSparkSplitPrompt(prompt: SparkSplitPrompt): FlatteningResult {
    const startTime = Date.now();
    
    try {
      const originalJson = JSON.stringify(prompt);
      const originalSize = Buffer.byteLength(originalJson, 'utf8');
      
      // Flatten the complex structure
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
        
        // Level 3 fields (emotionalContext.emotionalCompass.*) - 5-axis emotional compass
        'emotionalContext.emotionalCompass.awe': prompt.emotionalContext.emotionalCompass.awe,
        'emotionalContext.emotionalCompass.ownership': prompt.emotionalContext.emotionalCompass.ownership,
        'emotionalContext.emotionalCompass.wonder': prompt.emotionalContext.emotionalCompass.wonder,
        'emotionalContext.emotionalCompass.calm': prompt.emotionalContext.emotionalCompass.calm,
        'emotionalContext.emotionalCompass.power': prompt.emotionalContext.emotionalCompass.power,
        
        // Level 2 arrays (trustEvolution.trustFactors)
        ...this.flattenArrayFields('trustEvolution.trustFactors', prompt.trustEvolution.trustFactors),
        
        // Level 2 arrays (enhancers.*)
        ...this.flattenArrayFields('enhancers.qualityIndicators', prompt.enhancers.qualityIndicators),
        ...this.flattenArrayFields('enhancers.sparkRevelationMoments', prompt.enhancers.sparkRevelationMoments),
        ...this.flattenArrayFields('enhancers.emotions', prompt.enhancers.emotions),
        ...this.flattenArrayFields('enhancers.improvementSuggestions', prompt.enhancers.improvementSuggestions),
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
        nestingLevelsReduced: 3,
        processingTime
      };
    } catch (error: any) {
      this.performanceMetrics.errorCount++;
      throw new Error(`SparkSplitPrompt flattening failed: ${error.message}`);
    }
  }

  /**
   * Generic recursive flattening for any object
   * What: Recursively flattens any nested object structure
   * Why: Provides flexibility for future interface additions
   * How: Recursive traversal with configurable depth limits
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
    } catch (error: any) {
      this.performanceMetrics.errorCount++;
      throw new Error(`Generic object flattening failed: ${error.message}`);
    }
  }

  /**
   * Flatten array fields with indexed keys
   * What: Converts arrays to indexed flat fields for Make.com compatibility
   * Why: Make.com doesn't handle arrays well, needs indexed fields
   * How: Creates fieldName_0, fieldName_1, etc. for each array element
   */
  private flattenArrayFields(prefix: string, array: string[]): MakeComWebhookPayload {
    const result: MakeComWebhookPayload = {};
    
    // Add array length for Make.com processing
    result[`${prefix}_count`] = array.length;
    
    // Add indexed array elements
    array.forEach((item, index) => {
      const fieldName = `${prefix}${this.ARRAY_SEPARATOR}${index}`;
      if (fieldName.length <= this.MAX_FIELD_NAME_LENGTH) {
        result[fieldName] = item;
      } else {
        // Truncate field name if too long
        const truncatedName = fieldName.substring(0, this.MAX_FIELD_NAME_LENGTH - 3) + '...';
        result[truncatedName] = item;
      }
    });
    
    return result;
  }

  /**
   * Recursive flattening with depth control
   */
  private recursiveFlatten(obj: any, prefix: string, maxDepth: number): MakeComWebhookPayload {
    const result: MakeComWebhookPayload = {};
    
    if (maxDepth <= 0) {
      // Convert to string if max depth reached
      result[prefix || 'value'] = JSON.stringify(obj);
      return result;
    }
    
    if (obj === null || obj === undefined) {
      result[prefix || 'value'] = null;
      return result;
    }
    
    if (typeof obj !== 'object') {
      result[prefix || 'value'] = obj;
      return result;
    }
    
    if (Array.isArray(obj)) {
      // Handle arrays
      const arrayPrefix = prefix || 'array';
      result[`${arrayPrefix}_count`] = obj.length;
      
      obj.forEach((item, index) => {
        const itemPrefix = `${arrayPrefix}${this.ARRAY_SEPARATOR}${index}`;
        const flattened = this.recursiveFlatten(item, itemPrefix, maxDepth - 1);
        Object.assign(result, flattened);
      });
      
      return result;
    }
    
    // Handle objects
    for (const [key, value] of Object.entries(obj)) {
      const newPrefix = prefix ? `${prefix}${this.SEPARATOR}${key}` : key;
      const flattened = this.recursiveFlatten(value, newPrefix, maxDepth - 1);
      Object.assign(result, flattened);
    }
    
    return result;
  }

  /**
   * Validate field limits for Make.com compatibility
   * What: Checks if flattened object exceeds Make.com field limits
   * Why: Make.com has limits on number of fields and field name length
   * How: Counts fields and validates against known limits
   */
  validateFieldLimits(flattened: MakeComWebhookPayload): FieldLimitValidation {
    const totalFields = Object.keys(flattened).length;
    const withinLimit = totalFields <= this.MAKECOM_FIELD_LIMIT;
    const excessFields = Math.max(0, totalFields - this.MAKECOM_FIELD_LIMIT);
    
    const recommendations: string[] = [];
    
    if (!withinLimit) {
      recommendations.push(`Reduce field count by ${excessFields} fields`);
      recommendations.push('Consider grouping related fields or using shorter field names');
      recommendations.push('Remove optional fields or use field prioritization');
    }
    
    // Check field name lengths
    const longFieldNames = Object.keys(flattened).filter(
      name => name.length > this.MAX_FIELD_NAME_LENGTH
    );
    
    if (longFieldNames.length > 0) {
      recommendations.push(`${longFieldNames.length} field names exceed ${this.MAX_FIELD_NAME_LENGTH} character limit`);
      recommendations.push('Use shorter prefixes or abbreviations');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All field limits are within Make.com compatibility requirements');
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
   * Bottleneck analysis for 1,000 concurrent webhooks
   * What: Analyzes system performance under high concurrent webhook load
   * Why: Need to ensure system can handle 1,000 concurrent webhooks without failure
   * How: Simulates load and measures performance metrics
   */
  async analyzeWebhookBottlenecks(concurrentWebhooks: number = 1000): Promise<WebhookBottleneckAnalysis> {
    console.log(`🔍 Analyzing bottlenecks for ${concurrentWebhooks} concurrent webhooks...`);
    
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    
    // Create test data
    const testBusinessPlan: BusinessPlanPrompt = this.createTestBusinessPlan();
    const testSparkSplit: SparkSplitPrompt = this.createTestSparkSplit();
    
    const processingTimes: number[] = [];
    let errorCount = 0;
    
    try {
      // Simulate concurrent webhook processing
      const promises = Array.from({ length: concurrentWebhooks }, async (_, index) => {
        try {
          const webhookStartTime = Date.now();
          
          // Alternate between BusinessPlan and SparkSplit flattening
          if (index % 2 === 0) {
            await this.flattenBusinessPlanPrompt(testBusinessPlan);
          } else {
            await this.flattenSparkSplitPrompt(testSparkSplit);
          }
          
          const webhookProcessingTime = Date.now() - webhookStartTime;
          processingTimes.push(webhookProcessingTime);
        } catch (error) {
          errorCount++;
        }
      });
      
      await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      const peakMemoryUsage = memoryAfter - memoryBefore;
      
      const averageProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
      const errorRate = errorCount / concurrentWebhooks;
      
      // Determine bottleneck risk
      let bottleneckRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const recommendations: string[] = [];
      
      if (averageProcessingTime > 1000) { // > 1 second
        bottleneckRisk = 'critical';
        recommendations.push('Processing time exceeds 1 second - critical performance issue');
      } else if (averageProcessingTime > 500) { // > 500ms
        bottleneckRisk = 'high';
        recommendations.push('Processing time exceeds 500ms - consider optimization');
      } else if (averageProcessingTime > 200) { // > 200ms
        bottleneckRisk = 'medium';
        recommendations.push('Processing time exceeds 200ms - monitor performance');
      }
      
      if (errorRate > 0.05) { // > 5% error rate
        bottleneckRisk = 'critical';
        recommendations.push(`Error rate ${(errorRate * 100).toFixed(1)}% is too high`);
      } else if (errorRate > 0.01) { // > 1% error rate
        bottleneckRisk = bottleneckRisk === 'low' ? 'medium' : bottleneckRisk;
        recommendations.push(`Error rate ${(errorRate * 100).toFixed(1)}% should be monitored`);
      }
      
      if (peakMemoryUsage > 500) { // > 500MB
        bottleneckRisk = 'high';
        recommendations.push(`Memory usage ${peakMemoryUsage.toFixed(1)}MB is high`);
      } else if (peakMemoryUsage > 200) { // > 200MB
        bottleneckRisk = bottleneckRisk === 'low' ? 'medium' : bottleneckRisk;
        recommendations.push(`Memory usage ${peakMemoryUsage.toFixed(1)}MB should be monitored`);
      }
      
      if (recommendations.length === 0) {
        recommendations.push('System performance is optimal for concurrent webhook processing');
      }
      
      console.log(`✅ Bottleneck analysis completed: ${bottleneckRisk} risk`);
      
      return {
        concurrentWebhooks,
        averageProcessingTime,
        peakMemoryUsage,
        errorRate,
        bottleneckRisk,
        recommendations
      };
    } catch (error: any) {
      console.error('❌ Bottleneck analysis failed:', error);
      return {
        concurrentWebhooks,
        averageProcessingTime: 0,
        peakMemoryUsage: 0,
        errorRate: 1,
        bottleneckRisk: 'critical',
        recommendations: ['Bottleneck analysis failed - system may be unstable']
      };
    }
  }

  /**
   * Performance metrics and monitoring
   */
  private updatePerformanceMetrics(processingTime: number, fieldCount: number): void {
    this.performanceMetrics.totalFlattened++;
    this.performanceMetrics.averageProcessingTime = 
      (this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.totalFlattened - 1) + processingTime) / 
      this.performanceMetrics.totalFlattened;
    this.performanceMetrics.totalFieldsProcessed += fieldCount;
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Test data generators
   */
  private createTestBusinessPlan(): BusinessPlanPrompt {
    return {
      businessName: 'Test Business',
      industry: 'Technology',
      targetMarket: 'Small businesses',
      businessModel: 'SaaS',
      uniqueValueProposition: 'AI-powered solutions',
      competitiveAdvantage: 'Emotional intelligence',
      financials: {
        startupCosts: 50000,
        monthlyRevenue: 10000,
        monthlyExpenses: 8000,
        breakEvenPoint: 6,
        fundingNeeded: 100000,
        emotionalDrivers: {
          marketNeed: 'High demand for AI solutions',
          personalMotivation: 'Passion for technology',
          riskTolerance: 'Medium',
          successVision: 'Market leader in AI'
        }
      },
      emotionalContext: {
        entrepreneurialStyle: 'Innovative',
        communicationPreference: 'Direct',
        decisionMakingStyle: 'Data-driven',
        stressManagement: 'Proactive',
        marketingApproach: {
          brandPersonality: 'Professional',
          customerEngagement: 'Educational',
          contentStrategy: 'Thought leadership',
          socialMediaStyle: 'Informative'
        }
      },
      enhancers: {
        industryInsights: ['AI adoption growing', 'Market consolidation'],
        competitorAnalysis: ['Competitor A', 'Competitor B'],
        marketTrends: ['Remote work', 'Digital transformation'],
        riskMitigation: ['Diversification', 'Insurance']
      }
    };
  }

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
        trustFactors: ['Quality', 'Speed', 'Personalization'],
        trustBreakdown: {
          competence: 0.9,
          reliability: 0.85,
          transparency: 0.95,
          empathy: 0.88
        }
      },
      emotionalContext: {
        userMood: 'Optimistic',
        expectationLevel: 'High',
        previousExperience: 'None',
        emotionalState: 'Excited',
        emotionalCompass: {
          awe: 0.8,
          ownership: 0.9,
          wonder: 0.7,
          calm: 0.6,
          power: 0.85
        }
      },
      enhancers: {
        qualityIndicators: ['Comprehensive', 'Personalized', 'Actionable'],
        sparkRevelationMoments: ['Unique insights', 'Clear direction'],
        emotions: ['Excitement', 'Confidence', 'Clarity'],
        improvementSuggestions: ['More examples', 'Visual aids']
      }
    };
  }

  /**
   * Utility functions
   */
  generateWebhookHash(payload: MakeComWebhookPayload): string {
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    return createHash('sha256').update(payloadString).digest('hex');
  }

  estimateWebhookSize(payload: MakeComWebhookPayload): number {
    return Buffer.byteLength(JSON.stringify(payload), 'utf8');
  }

  /**
   * Webhook compatibility validation
   */
  validateMakeComCompatibility(payload: MakeComWebhookPayload): {
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check field count
    const fieldValidation = this.validateFieldLimits(payload);
    if (!fieldValidation.withinLimit) {
      issues.push(`Field count ${fieldValidation.totalFields} exceeds limit ${fieldValidation.makeComLimit}`);
      recommendations.push(...fieldValidation.recommendations);
    }

    // Check payload size (Make.com has ~1MB limit)
    const payloadSize = this.estimateWebhookSize(payload);
    const sizeLimitMB = 1;
    const sizeLimitBytes = sizeLimitMB * 1024 * 1024;
    
    if (payloadSize > sizeLimitBytes) {
      issues.push(`Payload size ${(payloadSize / 1024 / 1024).toFixed(2)}MB exceeds ${sizeLimitMB}MB limit`);
      recommendations.push('Reduce payload size by removing optional fields or compressing data');
    }

    // Check for unsupported data types
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'object' && value !== null) {
        issues.push(`Field ${key} contains object data - should be flattened`);
        recommendations.push(`Flatten nested object in field ${key}`);
      }
    }

    const compatible = issues.length === 0;

    if (compatible) {
      recommendations.push('Payload is fully compatible with Make.com webhooks');
    }

    return { compatible, issues, recommendations };
  }
}

/**
 * Factory function for easy usage
 */
export function createJsonFlattener(): JsonFlattener {
  return new JsonFlattener();
}

/**
 * Utility functions for common use cases
 */
export function flattenForMakeCom(obj: any): MakeComWebhookPayload {
  const flattener = new JsonFlattener();
  const result = flattener.flattenGenericObject(obj);
  return result.flattened;
}

export function validateMakeComPayload(payload: MakeComWebhookPayload): boolean {
  const flattener = new JsonFlattener();
  const validation = flattener.validateMakeComCompatibility(payload);
  return validation.compatible;
}

export default JsonFlattener; 