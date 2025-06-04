/**
 * real-makecom-scenario-builder.ts
 * 
 * Generates Make.com integration scenarios for interface-to-database mappings
 * 
 * Part of the Truth-Based Integration System
 */

import { InterfaceCatalogEntry, InterfaceField } from './real-interface-catalog-loader';
import { FieldMapping } from './real-field-mapper';

/**
 * Represents a module in a Make.com scenario
 */
export interface MakeComModule {
  id: number;
  module: string;
  version: number;
  parameters?: Record<string, any>;
  mapper?: Record<string, any>;
  filter?: {
    name: string;
    conditions: Array<{
      a: string;
      b: any;
      o: string;
    }>;
  };
  metadata?: {
    designer?: { x: number; y: number };
    expect?: any[];
  };
}

/**
 * Represents a complete Make.com scenario
 */
export interface MakeComScenario {
  name: string;
  description: string;
  flow: MakeComModule[];
  settings: {
    executionTimeout: number;
    sequential: boolean;
    maxErrors: number;
  };
}

/**
 * Builds Make.com scenarios for interface-to-database mappings
 */
export class MakeComScenarioBuilder {
  /**
   * Builds a complete Make.com scenario for an interface
   * 
   * @param interfaceName The name of the interface
   * @param interfaceData The interface definition
   * @param fieldMappings The field mappings for the interface
   * @returns A Make.com scenario
   */
  buildScenario(
    interfaceName: string,
    interfaceData: InterfaceCatalogEntry,
    fieldMappings: FieldMapping[]
  ): MakeComScenario {
    return {
      name: `CanAI ${interfaceName} Integration`,
      description: interfaceData.purpose,
      flow: [
        this.createWebhookModule(interfaceName, interfaceData, fieldMappings),
        this.createValidationModule(interfaceName, fieldMappings),
        this.createSupabaseModule(interfaceName, fieldMappings),
        this.createResponseModule(interfaceName)
      ],
      settings: {
        executionTimeout: 40,
        sequential: true,
        maxErrors: 3
      }
    };
  }

  /**
   * Creates a webhook module for receiving data
   * 
   * @param interfaceName The name of the interface
   * @param interfaceData The interface definition
   * @param fieldMappings The field mappings for the interface
   * @returns A webhook module
   */
  private createWebhookModule(
    interfaceName: string,
    interfaceData: InterfaceCatalogEntry,
    fieldMappings: FieldMapping[]
  ): MakeComModule {
    return {
      id: 1,
      module: 'gateway:CustomWebHook',
      version: 1,
      parameters: {
        name: `${interfaceName} Webhook`,
        hook: {
          label: `${interfaceName} Data Receiver`,
          type: 'web',
          condition: null
        }
      },
      mapper: this.generateWebhookMapper(fieldMappings),
      metadata: {
        designer: { x: 0, y: 0 },
        expect: this.generateExpectStructure(interfaceData.fields)
      }
    };
  }

  /**
   * Generates a mapper for the webhook module
   * 
   * @param fieldMappings The field mappings for the interface
   * @returns A mapper object
   */
  private generateWebhookMapper(fieldMappings: FieldMapping[]): Record<string, any> {
    const mapper: Record<string, any> = {};
    
    fieldMappings.forEach(mapping => {
      mapper[mapping.targetField] = `{{${mapping.sourceField}}}`;
    });
    
    // Add emotional sovereignty fields
    mapper['trust_score_validated'] = '{{validateTrustScore(trustScore)}}';
    mapper['emotional_sovereignty_preserved'] = '{{validateEmotionalSovereignty(emotionalFingerprint)}}';
    
    return mapper;
  }

  /**
   * Generates the expect structure for webhook parameters
   * 
   * @param fields The interface fields
   * @returns An expect structure
   */
  private generateExpectStructure(fields: Record<string, InterfaceField>): any[] {
    return Object.entries(fields).map(([fieldName, field]) => ({
      name: fieldName,
      type: this.mapToMakeComType(field.type),
      label: field.description,
      required: field.required
    }));
  }

  /**
   * Maps TypeScript types to Make.com types
   * 
   * @param interfaceType The TypeScript type
   * @returns The Make.com type
   */
  private mapToMakeComType(interfaceType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'boolean',
      'object': 'collection',
      'string[]': 'array',
      'any': 'any'
    };
    
    return typeMap[interfaceType] || 'text';
  }

  /**
   * Creates a validation module for emotional sovereignty
   * 
   * @param interfaceName The name of the interface
   * @param fieldMappings The field mappings for the interface
   * @returns A validation module
   */
  private createValidationModule(interfaceName: string, fieldMappings: FieldMapping[]): MakeComModule {
    return {
      id: 2,
      module: 'builtin:BasicFeeder',
      version: 1,
      parameters: {},
      filter: {
        name: 'Emotional Sovereignty Validation',
        conditions: [
          {
            a: '{{1.trust_score}}',
            b: 4.2,
            o: 'number:greater'
          }
        ]
      },
      mapper: {
        validated_data: '{{1}}',
        validation_timestamp: '{{now}}',
        trust_validation: '{{1.trust_score >= 4.2}}',
        emotional_sovereignty: '{{validateEmotionalSovereignty(1)}}'
      },
      metadata: {
        designer: { x: 150, y: 0 }
      }
    };
  }

  /**
   * Creates a Supabase module for storing data
   * 
   * @param interfaceName The name of the interface
   * @param fieldMappings The field mappings for the interface
   * @returns A Supabase module
   */
  private createSupabaseModule(interfaceName: string, fieldMappings: FieldMapping[]): MakeComModule {
    const tableName = this.getSupabaseTableName(interfaceName);
    
    return {
      id: 3,
      module: 'supabase:CreateRecord',
      version: 1,
      parameters: {
        tableName: tableName,
        connection: '{{connections.supabase}}'
      },
      mapper: this.generateSupabaseMapper(fieldMappings),
      metadata: {
        designer: { x: 300, y: 0 }
      }
    };
  }

  /**
   * Generates a mapper for the Supabase module
   * 
   * @param fieldMappings The field mappings for the interface
   * @returns A mapper object
   */
  private generateSupabaseMapper(fieldMappings: FieldMapping[]): Record<string, any> {
    const mapper: Record<string, any> = {};
    
    fieldMappings.forEach(mapping => {
      if (mapping.transformation === 'direct') {
        mapper[mapping.targetField] = `{{2.${mapping.sourceField}}}`;
      } else if (mapping.transformation === 'serialize') {
        mapper[mapping.targetField] = `{{JSON.stringify(2.${mapping.sourceField})}}`;
      } else if (mapping.transformation === 'array_cast') {
        mapper[mapping.targetField] = `{{arrayFrom(2.${mapping.sourceField})}}`;
      } else if (mapping.transformation === 'timestamp') {
        mapper[mapping.targetField] = `{{formatDate(2.${mapping.sourceField}, "YYYY-MM-DD HH:mm:ss")}}`;
      } else {
        mapper[mapping.targetField] = `{{transform(2.${mapping.sourceField}, "${mapping.transformation}")}}`;
      }
    });
    
    // Add timestamps
    mapper['created_at'] = '{{now}}';
    mapper['updated_at'] = '{{now}}';
    
    return mapper;
  }

  /**
   * Creates a response module for returning data
   * 
   * @param interfaceName The name of the interface
   * @returns A response module
   */
  private createResponseModule(interfaceName: string): MakeComModule {
    return {
      id: 4,
      module: 'gateway:WebhookRespond',
      version: 1,
      parameters: {
        status: 200,
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
        body: JSON.stringify({
          success: true,
          message: 'Data processed with emotional sovereignty',
          recordId: '{{3.id}}',
          trustScore: '{{2.trust_score}}',
          emotionalSovereignty: '{{2.emotional_sovereignty}}',
          processingTime: '{{timestamp - 1.timestamp}}',
          userEmpowerment: {
            increased: true,
            message: 'Your data has been securely processed'
          },
          nextSteps: [
            {
              action: 'Review your data',
              link: '/dashboard/{{3.id}}'
            },
            {
              action: 'Explore other CanAI tools',
              link: '/products'
            }
          ]
        })
      },
      metadata: {
        designer: { x: 450, y: 0 }
      }
    };
  }

  /**
   * Gets the Supabase table name for an interface
   * 
   * @param interfaceName The name of the interface
   * @returns The Supabase table name
   */
  private getSupabaseTableName(interfaceName: string): string {
    const tableMap: Record<string, string> = {
      'PromptLogs': 'prompt_logs',
      'GoldmineOutput': 'goldmine_output',
      'SparkSplitMetrics': 'sparksplit_analytics',
      'UserAIProfile': 'user_context',
      'SparkSplitComparisons': 'sparksplit_comparisons',
      'TrustMetrics': 'trust_metrics',
      'EmotionalIntelligence': 'emotional_intelligence'
    };
    
    return tableMap[interfaceName] || this.camelToSnake(interfaceName);
  }

  /**
   * Converts a camelCase string to snake_case
   * 
   * @param str String to convert
   * @returns The snake_case version
   */
  private camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }
} 