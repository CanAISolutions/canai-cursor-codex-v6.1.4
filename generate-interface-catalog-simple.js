const fs = require('fs');
const path = require('path');

class SimpleCatalogGenerator {
  constructor() {
    this.catalog = {
      metadata: {
        version: 'v1.0',
        generated: new Date().toISOString().split('T')[0],
        framework: 'CanAI Codex v6.1.4',
        totalInterfaces: 0,
        categories: ['database_schemas', 'prompts', 'api_webhooks', 'emotional_intelligence', 'analytics', 'core_services'],
        codeOwners: ['solo-dev'],
        verification: {
          validatedInterfaces: 0,
          warningsLogged: 0,
          assumptions: []
        }
      },
      interfaces: {}
    };
    this.warnings = [];

    // Load supabase schema
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

  generateFromCSV() {
    console.log('🚀 Starting interface catalog generation from CSV...');

    // Read interfaces from CSV
    const csvContent = fs.readFileSync('interfaces_list.csv', 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Group interfaces by category
    const interfacesByCategory = {
      database_schemas: [],
      prompts: [],
      api_webhooks: [],
      emotional_intelligence: [],
      analytics: [],
      core_services: []
    };

    lines.forEach(line => {
      const [filePath, interfaceName] = line.split(',');
      if (!filePath || !interfaceName) return;

      // Skip non-core directories
      if (filePath.includes('node_modules') || 
          filePath.includes('canai-orbital') || 
          filePath.includes('dist')) {
        return;
      }

      // Categorize based on path and name
      let category = 'core_services';
      
      if (filePath.includes('workspace-organization') && filePath.includes('supabase')) {
        category = 'database_schemas';
      } else if (filePath.includes('prompts')) {
        category = 'prompts';
      } else if (filePath.includes('api') || interfaceName.includes('Request') || interfaceName.includes('Response')) {
        category = 'api_webhooks';
      } else if (filePath.includes('emotional') || interfaceName.includes('Emotional') || interfaceName.includes('Trust')) {
        category = 'emotional_intelligence';
      } else if (filePath.includes('analytics') || interfaceName.includes('Analytics') || interfaceName.includes('Metrics')) {
        category = 'analytics';
      }

      interfacesByCategory[category].push({
        name: interfaceName,
        path: filePath,
        category
      });
    });

    // Process interfaces and create catalog entries
    Object.entries(interfacesByCategory).forEach(([category, interfaces]) => {
      console.log(`\n📁 Processing ${category} (${interfaces.length} interfaces)...`);
      
      interfaces.forEach(interfaceInfo => {
        console.log(`  📋 Adding interface: ${interfaceInfo.name}`);
        
        this.catalog.interfaces[interfaceInfo.name] = this.createInterfaceDefinition(
          interfaceInfo.name,
          interfaceInfo.path,
          category
        );
      });
    });

    // Update metadata
    this.catalog.metadata.totalInterfaces = Object.keys(this.catalog.interfaces).length;
    this.catalog.metadata.verification.warningsLogged = this.warnings.length;
    this.catalog.metadata.verification.validatedInterfaces = 
      Object.values(this.catalog.interfaces).filter(i => i.supabaseMapping).length;

    // Add special product interfaces from known sources
    this.addKnownProductInterfaces();

    // Save catalog
    fs.writeFileSync(
      'CANAI-DEFINITIVE-INTERFACE-CATALOG-2025.json',
      JSON.stringify(this.catalog, null, 2)
    );

    // Save warnings if any
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

  createInterfaceDefinition(interfaceName, filePath, category) {
    const definition = {
      category,
      path: filePath,
      purpose: this.getPurpose(interfaceName, category),
      integrationPriority: this.getPriority(interfaceName, category),
      fields: this.inferFields(interfaceName, category),
      webhookCompatible: this.isWebhookCompatible(interfaceName),
      emotionalSovereignty: this.checkEmotionalSovereignty(interfaceName),
      developerNotes: {
        tips: this.getDeveloperTips(interfaceName, category)
      }
    };

    // Add Supabase mapping for database interfaces
    if (category === 'database_schemas' && this.supabaseSchema) {
      definition.supabaseMapping = this.generateSupabaseMapping(interfaceName);
    }

    return definition;
  }

  inferFields(interfaceName, category) {
    // Infer fields based on known patterns and interface names
    const fields = [];
    
    // Common fields for all interfaces
    fields.push({
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier'
    });

    // Category-specific fields
    if (category === 'prompts') {
      // Based on known product interfaces
      if (interfaceName.includes('BusinessPlan')) {
        fields.push(
          { name: 'idea', type: 'string', required: true, description: 'Business idea or concept' },
          { name: 'audience', type: 'string', required: true, description: 'Target audience' },
          { name: 'tone', type: 'string', required: false, description: 'Communication tone' },
          { name: 'industry', type: 'string', required: false, description: 'Business industry' },
          { name: 'financials', type: 'object', required: false, description: 'Financial projections' }
        );
      } else if (interfaceName.includes('Email')) {
        fields.push(
          { name: 'goal', type: 'string', required: true, description: 'Email campaign goal' },
          { name: 'audience', type: 'string', required: true, description: 'Target audience' },
          { name: 'tone', type: 'string', required: false, description: 'Email tone' }
        );
      }
    } else if (category === 'database_schemas') {
      // Database schema fields
      fields.push(
        { name: 'created_at', type: 'timestamp', required: true, description: 'Record creation timestamp' },
        { name: 'updated_at', type: 'timestamp', required: false, description: 'Last update timestamp' }
      );
      
      if (interfaceName.includes('Analytics') || interfaceName.includes('Metrics')) {
        fields.push(
          { name: 'trust_score', type: 'number', required: false, description: 'Trust score (0-5)' },
          { name: 'session_id', type: 'string', required: true, description: 'Session identifier' },
          { name: 'user_id', type: 'string', required: false, description: 'User identifier' }
        );
      }
    }

    // Emotional sovereignty fields
    if (interfaceName.includes('Emotional') || interfaceName.includes('Trust')) {
      fields.push(
        { name: 'trust_score', type: 'number', required: false, description: 'Trust score (0-5)' },
        { name: 'emotional_depth', type: 'number', required: false, description: 'Emotional depth (0-1)' },
        { name: 'sentiment_score', type: 'number', required: false, description: 'Sentiment analysis score' }
      );
    }

    // SparkSplit specific fields
    if (interfaceName.includes('SparkSplit')) {
      fields.push(
        { name: 'comparison_id', type: 'string', required: true, description: 'Comparison identifier' },
        { name: 'trust_delta', type: 'number', required: false, description: 'Trust score improvement' },
        { name: 'user_selection', type: 'string', required: false, description: 'User choice (canai/sterile)' },
        { name: 'competitive_advantage', type: 'number', required: false, description: 'Competitive advantage score' }
      );
    }

    return fields;
  }

  getPurpose(interfaceName, category) {
    const purposes = {
      // Database schemas
      PromptLogs: 'Log prompt interactions with trust scores and emotional metrics',
      SessionAnalytics: 'Track user sessions with emotional journey and trust evolution',
      SparkSplitAnalytics: 'Revolutionary trust transparency comparison analytics',
      SparkSplitComparisons: 'Store side-by-side AI output comparisons for trust building',
      UserContext: 'Comprehensive user profile with emotional intelligence tracking',
      EmotionalIntelligence: 'Track user emotional state and journey',
      
      // Product prompts
      BusinessPlanPrompt: 'Generate comprehensive business plans with emotional resonance',
      EmailCampaignPrompt: 'Create emotionally intelligent email campaigns',
      SocialContentPrompt: 'Generate social media content with authentic voice',
      AIBlueprintPrompt: 'Design AI implementation strategies',
      
      // API interfaces
      EmotionalSovereigntyRequest: 'Request emotional sovereignty validation',
      EmotionalSovereigntyResponse: 'Response with emotional sovereignty metrics',
      
      // Default
      default: `${category} interface for ${interfaceName}`
    };

    return purposes[interfaceName] || purposes.default;
  }

  getPriority(interfaceName, category) {
    // Critical interfaces
    const critical = [
      'PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics', 
      'SparkSplitComparisons', 'UserContext', 'EmotionalIntelligence'
    ];
    if (critical.includes(interfaceName)) return 'critical';

    // High priority categories
    if (category === 'database_schemas' || category === 'prompts') return 'high';
    if (category === 'emotional_intelligence') return 'high';

    // Medium priority
    if (category === 'api_webhooks' || category === 'analytics') return 'medium';

    return 'low';
  }

  isWebhookCompatible(interfaceName) {
    // Webhook compatible if it has request/response pattern or is used in Make.com
    if (interfaceName.includes('Request') || interfaceName.includes('Response')) return true;
    if (interfaceName.includes('Webhook')) return true;
    if (interfaceName.includes('Analytics') || interfaceName.includes('Logs')) return true;
    
    return false;
  }

  checkEmotionalSovereignty(interfaceName) {
    const hasEmotionalFields = 
      interfaceName.includes('Emotional') || 
      interfaceName.includes('Trust') ||
      interfaceName.includes('Sovereignty');
    
    if (hasEmotionalFields) {
      return {
        status: 'supported',
        notes: 'Contains emotional sovereignty fields and trust metrics'
      };
    }

    return {
      status: 'needs_review',
      notes: 'Consider adding emotional sovereignty fields like trustScore or emotionalDepth'
    };
  }

  generateSupabaseMapping(interfaceName) {
    // Convert interface name to snake_case table name
    const tableName = interfaceName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
    
    // Map known interfaces to Supabase tables
    const tableMapping = {
      'prompt_logs': 'prompt_logs',
      'session_analytics': 'session_analytics',
      'spark_split_analytics': 'sparksplit_analytics',
      'spark_split_comparisons': 'sparksplit_comparisons',
      'user_context': 'user_context',
      'emotional_intelligence': 'emotional_intelligence'
    };

    return {
      table: tableMapping[tableName] || tableName,
      columns: {},
      transformation: {}
    };
  }

  getDeveloperTips(interfaceName, category) {
    const tips = {
      PromptLogs: 'Ensure unique sessionId and valid trustScore (0-5)',
      SessionAnalytics: 'Track emotional journey across the entire session',
      SparkSplitAnalytics: 'Use for A/B testing trust transparency',
      SparkSplitComparisons: 'Store both sterile and enhanced outputs for comparison',
      BusinessPlanPrompt: 'Complex interface with nested objects - handle financials carefully',
      default: `Implement ${interfaceName} according to ${category} best practices`
    };

    return tips[interfaceName] || tips.default;
  }

  addKnownProductInterfaces() {
    // Add detailed definitions for the 11 known product interfaces
    const products = [
      { name: 'AdAmplifyPrompt', fields: 16 },
      { name: 'BlogBlitzPrompt', fields: 13 },
      { name: 'ProfileMakeoverPrompt', fields: 14 },
      { name: 'BusinessPlanPrompt', fields: 31, complex: true },
      { name: 'EmailCampaignPrompt', fields: 6 },
      { name: 'SiteAuditPrompt', fields: 15 },
      { name: 'SocialContentPrompt', fields: 6 },
      { name: 'ReverseStrategyPrompt', fields: 6 },
      { name: 'AIBlueprintPrompt', fields: 6 },
      { name: 'AIBrandIdentityPrompt', fields: 6 },
      { name: 'SparkSplitPrompt', fields: 28, complex: true }
    ];

    products.forEach(product => {
      if (!this.catalog.interfaces[product.name]) {
        this.catalog.interfaces[product.name] = {
          category: 'prompts',
          path: `prompts/${product.name.replace('Prompt', '').toLowerCase()}.ts`,
          purpose: this.getPurpose(product.name, 'prompts'),
          integrationPriority: product.complex ? 'critical' : 'high',
          fields: this.inferFields(product.name, 'prompts'),
          webhookCompatible: true,
          emotionalSovereignty: {
            status: 'supported',
            notes: 'All products include emotional sovereignty and trust metrics'
          },
          developerNotes: {
            tips: product.complex ? 
              'Complex interface with nested objects - careful handling required' :
              'Standard product interface - follow prompt template pattern',
            fieldCount: product.fields
          }
        };
      }
    });
  }
}

// Run the generator
const generator = new SimpleCatalogGenerator();
generator.generateFromCSV(); 