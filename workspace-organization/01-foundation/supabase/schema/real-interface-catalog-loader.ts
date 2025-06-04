/**
 * real-interface-catalog-loader.ts
 * 
 * Loads and provides access to the CANAI interface catalog data
 * from CANAI-INTERFACE-CATALOG.json
 * 
 * Part of the Truth-Based Integration System
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Interface definitions
export interface InterfaceField {
  type: string;
  required: boolean;
  description: string;
  range?: [number, number];
  enum?: string[];
  properties?: Record<string, { type: string; description: string }>;
}

export interface InterfaceCatalogEntry {
  name: string;
  category: string;
  path: string;
  purpose: string;
  integrationPriority: 'high' | 'medium' | 'low';
  fields: Record<string, InterfaceField>;
  relationships: string[];
  usagePatterns: string[];
  isNested?: boolean;
  isTrustCritical?: boolean;
}

export interface InterfaceCatalog {
  lastUpdated: string;
  version: string;
  interfaces: Record<string, InterfaceCatalogEntry>;
}

/**
 * Loads and provides access to the CANAI interface catalog
 */
export class InterfaceCatalogLoader {
  private catalog: InterfaceCatalog | null = null;
  private catalogPath: string;
  
  /**
   * Creates a new InterfaceCatalogLoader
   * 
   * @param catalogPath Path to the catalog JSON file
   */
  constructor(catalogPath: string = '../../04-interfaces/catalog/CANAI-INTERFACE-CATALOG.json') {
    this.catalogPath = catalogPath;
  }
  
  /**
   * Loads the interface catalog from the JSON file
   * 
   * @returns A promise that resolves when the catalog is loaded
   */
  async loadCatalog(): Promise<void> {
    try {
      // In a real implementation, this would be an async file read
      const catalogJson = readFileSync(join(__dirname, this.catalogPath), 'utf8');
      this.catalog = JSON.parse(catalogJson);
      
      // Set the name property on each interface
      if (this.catalog) {
        for (const [interfaceName, interfaceData] of Object.entries(this.catalog.interfaces)) {
          interfaceData.name = interfaceName;
        }
      }
      
      console.log(`Loaded interface catalog version ${this.catalog?.version} with ${this.getInterfaceCount()} interfaces`);
    } catch (error) {
      console.error('Error loading interface catalog:', error);
      
      // Create a minimal catalog for testing
      this.catalog = {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0-demo',
        interfaces: this.createDemoInterfaces()
      };
      
      console.log('Created demo interface catalog');
    }
  }
  
  /**
   * Gets an interface by name
   * 
   * @param name Interface name
   * @returns The interface or null if not found
   */
  getInterface(name: string): InterfaceCatalogEntry | null {
    if (!this.catalog) return null;
    return this.catalog.interfaces[name] || null;
  }
  
  /**
   * Gets all interface names
   * 
   * @returns Array of interface names
   */
  getAllInterfaceNames(): string[] {
    if (!this.catalog) return [];
    return Object.keys(this.catalog.interfaces);
  }
  
  /**
   * Gets the number of interfaces in the catalog
   * 
   * @returns The number of interfaces
   */
  getInterfaceCount(): number {
    if (!this.catalog) return 0;
    return Object.keys(this.catalog.interfaces).length;
  }
  
  /**
   * Creates demo interfaces for testing
   * 
   * @returns A record of demo interfaces
   */
  private createDemoInterfaces(): Record<string, InterfaceCatalogEntry> {
    return {
      'PromptLogs': {
        name: 'PromptLogs',
        category: 'Analytics',
        path: '/analytics/prompt-logs',
        purpose: 'Store and analyze prompt usage and performance',
        integrationPriority: 'high',
        fields: {
          'recordId': {
            type: 'string',
            required: true,
            description: 'Unique identifier for the prompt log'
          },
          'userId': {
            type: 'string',
            required: true,
            description: 'User who created the prompt'
          },
          'promptType': {
            type: 'string',
            required: true,
            description: 'Type of prompt (e.g., business_plan, email_campaign)'
          },
          'inputContent': {
            type: 'string',
            required: true,
            description: 'The input content provided by the user'
          },
          'outputContent': {
            type: 'string',
            required: true,
            description: 'The generated output content'
          },
          'trustScore': {
            type: 'number',
            required: true,
            description: 'Trust score for the prompt',
            range: [0, 5]
          },
          'resonanceScore': {
            type: 'number',
            required: false,
            description: 'Emotional resonance score',
            range: [0, 5]
          },
          'emotionalFingerprint': {
            type: 'object',
            required: false,
            description: 'Emotional fingerprint of the prompt',
            properties: {
              'awe': { type: 'number', description: 'Awe score' },
              'wonder': { type: 'number', description: 'Wonder score' },
              'empowerment': { type: 'number', description: 'Empowerment score' }
            }
          },
          'timestamp': {
            type: 'string',
            required: true,
            description: 'When the prompt was created'
          }
        },
        relationships: ['Users', 'PromptTypes'],
        usagePatterns: ['Analytics', 'Optimization']
      },
      'GoldmineOutput': {
        name: 'GoldmineOutput',
        category: 'Content',
        path: '/content/goldmine',
        purpose: 'Store valuable content insights extracted from prompts',
        integrationPriority: 'medium',
        fields: {
          'recordId': {
            type: 'string',
            required: true,
            description: 'Unique identifier for the goldmine output'
          },
          'promptLogId': {
            type: 'string',
            required: true,
            description: 'Reference to the original prompt log'
          },
          'insightType': {
            type: 'string',
            required: true,
            description: 'Type of insight (e.g., market, competitor, strategy)'
          },
          'insightContent': {
            type: 'string',
            required: true,
            description: 'The valuable insight content'
          },
          'trustScore': {
            type: 'number',
            required: true,
            description: 'Trust score for the insight',
            range: [0, 5]
          },
          'timestamp': {
            type: 'string',
            required: true,
            description: 'When the insight was extracted'
          }
        },
        relationships: ['PromptLogs'],
        usagePatterns: ['Insights', 'Strategy']
      }
    };
  }
} 