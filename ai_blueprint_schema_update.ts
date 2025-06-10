/**
 * ai_blueprint_schema_update.ts
 * 
 * Purpose: Updated input schema for AI Blueprint MCP with 12 standardized fields
 * Date: June 09, 2025, 09:25 AM MDT
 * Compliance: V4 Standardization Plan
 * 
 * This file defines the enhanced schema structure required for ai_blueprint.mcp.ts
 * to align with MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.md
 */

import { SchemaValidator } from '../lib/schemas/validator';

// Enhanced AI Blueprint Input Interface with 12 required fields
export interface AIBlueprintInputV4 {
  // Core business identification
  businessName: string;                    // Business/company name
  targetAudience: string;                  // Primary target market
  primaryGoal: string;                     // Main objective for AI solution
  
  // Strategic context
  competitiveContext: string;              // Competitive landscape and differentiation
  brandVoice: string;                      // Communication style/tone
  resourceConstraints: string;             // Budget, time, team limitations
  
  // Current state and solution design
  currentStatus: string;                   // Current AI/tech maturity level
  aiSolution: string;                      // Proposed AI solution type
  mvpFeatures: string;                     // Minimum viable product features
  
  // Success measurement and integration
  successMetrics: string;                  // Key performance indicators
  linkedPrompts: string[];                 // Related prompt integrations
  minimumViableExecution: string;          // Practical implementation approach
  
  // Optional enhancers for advanced processing
  enhancers?: {
    emotionalDepth?: boolean;
    useAnalogies?: boolean;
    urgency?: boolean;
    technicalDetail?: boolean;
    marketFocus?: boolean;
  };
}

// Updated validation schema with all 12 required fields
export const aiBlueprintSchemaV4 = {
  type: 'object',
  required: [
    'businessName',
    'targetAudience', 
    'primaryGoal',
    'competitiveContext',
    'brandVoice',
    'resourceConstraints',
    'currentStatus',
    'aiSolution',
    'mvpFeatures',
    'successMetrics',
    'linkedPrompts',
    'minimumViableExecution'
  ],
  properties: {
    businessName: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
      description: 'Business or company name implementing AI solution'
    },
    targetAudience: {
      type: 'string',
      minLength: 10,
      maxLength: 200,
      description: 'Primary target market or customer segment'
    },
    primaryGoal: {
      type: 'string', 
      minLength: 15,
      maxLength: 300,
      description: 'Main business objective for AI implementation'
    },
    competitiveContext: {
      type: 'string',
      minLength: 10,
      maxLength: 300,
      description: 'Competitive landscape and differentiation strategy'
    },
    brandVoice: {
      type: 'string',
      enum: ['professional', 'technical', 'strategic', 'innovative', 'approachable', 'authoritative'],
      description: 'Brand communication style and tone'
    },
    resourceConstraints: {
      type: 'string',
      minLength: 5,
      maxLength: 200,
      description: 'Budget, timeline, and team constraints'
    },
    currentStatus: {
      type: 'string',
      minLength: 5,
      maxLength: 200,
      description: 'Current AI/technology maturity and capabilities'
    },
    aiSolution: {
      type: 'string',
      minLength: 10,
      maxLength: 200,
      description: 'Proposed AI solution type and approach'
    },
    mvpFeatures: {
      type: 'string',
      minLength: 10,
      maxLength: 300,
      description: 'Essential features for minimum viable product'
    },
    successMetrics: {
      type: 'string',
      minLength: 10,
      maxLength: 200,
      description: 'Key performance indicators and success measures'
    },
    linkedPrompts: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['business-plan', 'ad-amplify', 'email-campaign', 'site-audit', 'social-content']
      },
      minItems: 0,
      maxItems: 5,
      description: 'Related prompt integrations for cross-functionality'
    },
    minimumViableExecution: {
      type: 'string',
      minLength: 15,
      maxLength: 300,
      description: 'Practical implementation approach with specific tools'
    },
    enhancers: {
      type: 'object',
      properties: {
        emotionalDepth: { type: 'boolean' },
        useAnalogies: { type: 'boolean' },
        urgency: { type: 'boolean' },
        technicalDetail: { type: 'boolean' },
        marketFocus: { type: 'boolean' }
      },
      additionalProperties: false,
      description: 'Optional processing enhancers'
    }
  },
  additionalProperties: false
};

// Default values for enhanced schema
export const aiBlueprintDefaults = {
  brandVoice: 'strategic',
  linkedPrompts: ['business-plan'],
  successMetrics: '30d: Prototype; 60d: Beta; 90d: Launch',
  enhancers: {
    emotionalDepth: true,
    useAnalogies: false,
    urgency: false,
    technicalDetail: true,
    marketFocus: true
  }
};

// Backward compatibility mapping from old schema to new schema
export const backwardCompatibilityMap = {
  industry: 'competitiveContext',           // Map industry to competitive context
  targetAudience: 'targetAudience',         // Direct mapping
  goals: 'primaryGoal',                     // Convert array to primary goal string
  constraints: 'resourceConstraints',       // Convert array to constraints string
  tone: 'brandVoice',                       // Direct mapping
  enhancers: 'enhancers'                    // Direct mapping
};

// Migration function to convert old schema to new schema
export function migrateToV4Schema(oldInput: any): Partial<AIBlueprintInputV4> {
  const migrated: Partial<AIBlueprintInputV4> = {};
  
  // Apply backward compatibility mappings
  Object.entries(backwardCompatibilityMap).forEach(([oldField, newField]) => {
    if (oldInput[oldField] !== undefined) {
      if (oldField === 'goals' && Array.isArray(oldInput[oldField])) {
        // Convert goals array to primary goal string
        migrated.primaryGoal = oldInput[oldField].join('; ');
      } else if (oldField === 'constraints' && Array.isArray(oldInput[oldField])) {
        // Convert constraints array to resource constraints string
        migrated.resourceConstraints = oldInput[oldField].join('; ');
      } else {
        (migrated as any)[newField] = oldInput[oldField];
      }
    }
  });
  
  // Apply defaults for missing required fields
  if (!migrated.businessName) {
    migrated.businessName = 'Your Business';
  }
  if (!migrated.brandVoice) {
    migrated.brandVoice = aiBlueprintDefaults.brandVoice;
  }
  if (!migrated.linkedPrompts) {
    migrated.linkedPrompts = aiBlueprintDefaults.linkedPrompts;
  }
  if (!migrated.successMetrics) {
    migrated.successMetrics = aiBlueprintDefaults.successMetrics;
  }
  
  return migrated;
}

// Enhanced validation function with V4 schema
export async function validateAIBlueprintV4(input: any): Promise<{
  isValid: boolean;
  missingFields: string[];
  invalidFields: string[];
  migrationApplied: boolean;
}> {
  const validator = new SchemaValidator();
  
  // Attempt migration if old schema detected
  let processedInput = input;
  let migrationApplied = false;
  
  if (input.industry || input.goals || input.constraints) {
    processedInput = { ...input, ...migrateToV4Schema(input) };
    migrationApplied = true;
  }
  
  // Validate against V4 schema
  const result = await validator.validate(aiBlueprintSchemaV4, processedInput);
  
  const validationResult = {
    isValid: result.valid,
    missingFields: [] as string[],
    invalidFields: [] as string[],
    migrationApplied
  };
  
  if (!result.valid && result.errors) {
    result.errors.forEach((error: any) => {
      if (error.code === 'REQUIRED_ERROR') {
        validationResult.missingFields.push(error.path.join('.'));
      } else {
        validationResult.invalidFields.push(error.path.join('.'));
      }
    });
  }
  
  return validationResult;
}

export { AIBlueprintInputV4 as AIBlueprintInput }; 