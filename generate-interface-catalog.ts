import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

interface InterfaceField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: any;
}

interface InterfaceDefinition {
  category: string;
  path: string;
  purpose: string;
  integrationPriority: 'critical' | 'high' | 'medium' | 'low';
  fields: InterfaceField[];
  supabaseMapping?: {
    table: string;
    columns: Record<string, string>;
    transformation: Record<string, string>;
  };
  webhookCompatible: boolean;
  emotionalSovereignty: {
    status: 'supported' | 'needs_review';
    notes: string;
  };
  failureRisk?: {
    type: string | null;
    remediationSteps: string | null;
  };
  developerNotes?: {
    tips: string;
    exampleCode?: string;
  };
}

interface InterfaceCatalog {
  metadata: {
    version: string;
    generated: string;
    framework: string;
    totalInterfaces: number;
    categories: string[];
    codeOwners: string[];
    verification: {
      validatedInterfaces: number;
      warningsLogged: number;
      assumptions: string[];
    };
  };
  interfaces: Record<string, InterfaceDefinition>;
}

class InterfaceCatalogGenerator {
  private catalog: InterfaceCatalog;
  private warnings: any[] = [];
  private supabaseSchema: any = null;

  // Key files to extract from (based on our analysis)
  private keyFiles = {
    database: [
      'workspace-organization/01-foundation/supabase/schema/supabase-schema-mapping.ts'
    ],
    products: [
      'prompts/ad_amplify.ts',
      'prompts/blogblitz.ts',
      'prompts/profile_makeover.ts',
      'prompts/business_plan.ts',
      'prompts/email_campaign.ts',
      'prompts/site_audit.ts',
      'prompts/social_content.ts',
      'prompts/reverse_strategy.ts',
      'prompts/ai_blueprint.ts',
      'prompts/ai_brand_identity.ts',
      'prompts/sparksplit.ts'
    ],
    api: [
      'api/types/airtable.ts',
      'api/types/prompt.ts',
      'api/types/openai.ts',
      'api/services/schema-api.ts'
    ],
    emotional: [
      'cursor/types/emotional-sovereignty.ts',
      'workspace-organization/03-emotional-intelligence/orchestrator/core/emotional-sovereignty-orchestrator.ts'
    ],
    analytics: [
      'analytics/sparksplit-analytics.ts',
      'analytics/session.ts',
      'analytics/goldmine-intelligence-engine.ts'
    ]
  };

  constructor() {
    this.catalog = {
      metadata: {
        version: 'v1.0',
        generated: new Date().toISOString().split('T')[0],
        framework: 'CanAI Codex v6.1.4',
        totalInterfaces: 0,
        categories: ['database_schemas', 'prompts', 'api_webhooks', 'emotional_intelligence', 'analytics'],
        codeOwners: ['solo-dev'],
        verification: {
          validatedInterfaces: 0,
          warningsLogged: 0,
          assumptions: []
        }
      },
      interfaces: {}
    };

    // Load Supabase schema if available
    try {
      const schemaPath = 'workspace-organization/01-foundation/supabase/schema/supabase-schema.json';
      if (fs.existsSync(schemaPath)) {
        this.supabaseSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      }
    } catch (e) {
      this.warnings.push({
        type: 'schema_load_error',
        message: 'Could not load supabase-schema.json',
        error: e.message
      });
    }
  }

  async generate(): Promise<void> {
    console.log('🚀 Starting interface catalog generation...');

    // Process each category
    for (const [category, files] of Object.entries(this.keyFiles)) {
      console.log(`\n📁 Processing ${category} interfaces...`);
      
      for (const filePath of files) {
        if (fs.existsSync(filePath)) {
          await this.extractInterfacesFromFile(filePath, category);
        } else {
          this.warnings.push({
            type: 'file_not_found',
            file: filePath,
            category
          });
        }
      }
    }

    // Update metadata
    this.catalog.metadata.totalInterfaces = Object.keys(this.catalog.interfaces).length;
    this.catalog.metadata.verification.warningsLogged = this.warnings.length;
    this.catalog.metadata.verification.validatedInterfaces = 
      Object.values(this.catalog.interfaces).filter(i => i.supabaseMapping).length;

    // Save catalog
    fs.writeFileSync(
      'CANAI-DEFINITIVE-INTERFACE-CATALOG-2025.json',
      JSON.stringify(this.catalog, null, 2)
    );

    // Save warnings
    if (this.warnings.length > 0) {
      fs.writeFileSync(
        'interface_warnings.json',
        JSON.stringify(this.warnings, null, 2)
      );
    }

    console.log(`\n✅ Catalog generated successfully!`);
    console.log(`📊 Total interfaces: ${this.catalog.metadata.totalInterfaces}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
  }

  private async extractInterfacesFromFile(filePath: string, category: string): Promise<void> {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node) && node.name) {
        const interfaceName = node.name.text;
        
        // Skip if it's a utility interface
        if (this.isUtilityInterface(interfaceName)) {
          return;
        }

        console.log(`  📋 Found interface: ${interfaceName}`);
        
        const interfaceDef = this.extractInterfaceDefinition(
          node,
          filePath,
          category,
          interfaceName
        );

        this.catalog.interfaces[interfaceName] = interfaceDef;
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  private extractInterfaceDefinition(
    node: ts.InterfaceDeclaration,
    filePath: string,
    category: string,
    interfaceName: string
  ): InterfaceDefinition {
    const fields: InterfaceField[] = [];

    // Extract fields
    node.members.forEach(member => {
      if (ts.isPropertySignature(member) && member.name) {
        const fieldName = member.name.getText();
        const fieldType = member.type ? member.type.getText() : 'any';
        const isRequired = !member.questionToken;

        fields.push({
          name: fieldName,
          type: fieldType,
          required: isRequired,
          description: this.getFieldDescription(member),
          constraints: this.getFieldConstraints(fieldName, fieldType)
        });
      }
    });

    // Determine properties based on interface name and category
    const interfaceDef: InterfaceDefinition = {
      category: this.mapCategory(category),
      path: filePath,
      purpose: this.getPurpose(interfaceName, category),
      integrationPriority: this.getPriority(interfaceName, category),
      fields,
      webhookCompatible: this.isWebhookCompatible(interfaceName, fields),
      emotionalSovereignty: this.checkEmotionalSovereignty(fields),
      developerNotes: {
        tips: this.getDeveloperTips(interfaceName, category)
      }
    };

    // Add Supabase mapping for database interfaces
    if (category === 'database') {
      interfaceDef.supabaseMapping = this.generateSupabaseMapping(interfaceName, fields);
    }

    return interfaceDef;
  }

  private mapCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      database: 'database_schemas',
      products: 'prompts',
      api: 'api_webhooks',
      emotional: 'emotional_intelligence',
      analytics: 'analytics'
    };
    return categoryMap[category] || category;
  }

  private getPurpose(interfaceName: string, category: string): string {
    // Define purposes based on known interfaces
    const purposes: Record<string, string> = {
      PromptLogs: 'Log prompt interactions with trust scores and emotional metrics',
      SessionAnalytics: 'Track user sessions with emotional journey and trust evolution',
      SparkSplitAnalytics: 'Revolutionary trust transparency comparison analytics',
      UserContext: 'Comprehensive user profile with emotional intelligence tracking',
      EmotionalSovereigntyRequest: 'Request emotional sovereignty validation',
      EmotionalSovereigntyResponse: 'Response with emotional sovereignty metrics'
    };

    return purposes[interfaceName] || `${category} interface for ${interfaceName}`;
  }

  private getPriority(interfaceName: string, category: string): 'critical' | 'high' | 'medium' | 'low' {
    // Critical interfaces
    const critical = ['PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics', 'UserContext'];
    if (critical.includes(interfaceName)) return 'critical';

    // High priority categories
    if (category === 'database' || category === 'products') return 'high';
    if (category === 'emotional') return 'high';

    // Medium priority
    if (category === 'api' || category === 'analytics') return 'medium';

    return 'low';
  }

  private isWebhookCompatible(interfaceName: string, fields: InterfaceField[]): boolean {
    // Webhook compatible if it has request/response pattern or is used in Make.com
    if (interfaceName.includes('Request') || interfaceName.includes('Response')) return true;
    if (interfaceName.includes('Webhook')) return true;
    
    // Check if it has simple serializable fields
    const hasComplexTypes = fields.some(f => 
      f.type.includes('Function') || 
      f.type.includes('Symbol') ||
      f.type.includes('undefined')
    );
    
    return !hasComplexTypes;
  }

  private checkEmotionalSovereignty(fields: InterfaceField[]): { status: 'supported' | 'needs_review'; notes: string } {
    const emotionalFields = ['trustScore', 'emotionalDepth', 'emotionalProfile', 'sentimentScore', 
                           'aweScore', 'ownershipScore', 'wonderScore', 'calmScore', 'powerScore'];
    
    const hasEmotionalFields = fields.some(f => emotionalFields.includes(f.name));
    
    if (hasEmotionalFields) {
      return {
        status: 'supported',
        notes: 'Contains emotional sovereignty fields'
      };
    }

    return {
      status: 'needs_review',
      notes: 'Consider adding emotional sovereignty fields like trustScore or emotionalDepth'
    };
  }

  private generateSupabaseMapping(interfaceName: string, fields: InterfaceField[]): any {
    // Convert interface name to snake_case table name
    const tableName = this.camelToSnakeCase(interfaceName);
    
    const columns: Record<string, string> = {};
    const transformation: Record<string, string> = {};

    fields.forEach(field => {
      const snakeCaseField = this.camelToSnakeCase(field.name);
      columns[snakeCaseField] = this.mapTypeToSupabase(field.type);
      transformation[field.name] = snakeCaseField;
    });

    return {
      table: tableName,
      columns,
      transformation
    };
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  }

  private mapTypeToSupabase(tsType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'varchar',
      'number': 'numeric',
      'boolean': 'boolean',
      'Date': 'timestamp',
      'any': 'jsonb',
      'object': 'jsonb'
    };

    // Handle arrays
    if (tsType.includes('[]')) return 'array';
    
    // Handle complex types
    if (tsType.includes('|') || tsType.includes('&')) return 'jsonb';

    return typeMap[tsType] || 'jsonb';
  }

  private getFieldDescription(member: ts.PropertySignature): string {
    // Extract JSDoc comments if available
    const sourceFile = member.getSourceFile();
    const comments = ts.getLeadingCommentRanges(sourceFile.text, member.pos);
    
    if (comments && comments.length > 0) {
      const comment = sourceFile.text.slice(comments[0].pos, comments[0].end);
      // Extract description from JSDoc
      const match = comment.match(/@description\s+(.+)/);
      if (match) return match[1].trim();
    }

    // Generate description based on field name
    return this.generateFieldDescription(member.name?.getText() || '');
  }

  private generateFieldDescription(fieldName: string): string {
    const descriptions: Record<string, string> = {
      trustScore: 'Trust score (0-5) measuring user confidence in the system',
      emotionalDepth: 'Emotional depth score (0-1) indicating emotional engagement',
      sessionId: 'Unique session identifier',
      userId: 'User identifier for tracking across sessions',
      timestamp: 'When the event occurred',
      createdAt: 'Record creation timestamp',
      updatedAt: 'Last update timestamp'
    };

    return descriptions[fieldName] || `${fieldName} field`;
  }

  private getFieldConstraints(fieldName: string, fieldType: string): any {
    // Define known constraints
    if (fieldName.includes('Score') && fieldType === 'number') {
      if (fieldName === 'trustScore') {
        return { type: 'range', min: 0, max: 5 };
      }
      return { type: 'range', min: 0, max: 1 };
    }

    if (fieldType.includes('|')) {
      const values = fieldType.split('|').map(t => t.trim().replace(/['"]/g, ''));
      return { type: 'enum', values };
    }

    return null;
  }

  private getDeveloperTips(interfaceName: string, category: string): string {
    const tips: Record<string, string> = {
      PromptLogs: 'Ensure unique sessionId and valid trustScore (0-5)',
      SessionAnalytics: 'Track emotional journey across the entire session',
      SparkSplitAnalytics: 'Use for A/B testing trust transparency'
    };

    return tips[interfaceName] || `Implement ${interfaceName} according to ${category} best practices`;
  }

  private isUtilityInterface(name: string): boolean {
    const utilityPatterns = ['Options', 'Config', 'Props', 'State', 'Context'];
    return utilityPatterns.some(pattern => name.endsWith(pattern));
  }
}

// Run the generator
const generator = new InterfaceCatalogGenerator();
generator.generate().catch(console.error); 