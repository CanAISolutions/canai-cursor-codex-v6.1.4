// Interface Catalog Enhancement Script
const fs = require('fs');

// File paths
const AUTO_CATALOG_PATH = 'CANAI-DEFINITIVE-INTERFACE-CATALOG-2025-CLEANED.json';
const V1_CATALOG_PATH = 'workspace-organization/04-interfaces/catalog/CANAI-INTERFACE-CATALOG.json';
const V2_CATALOG_PATH = 'workspace-organization/04-interfaces/catalog/CANAI-INTERFACE-CATALOG-V2.json';
const OUTPUT_PATH = 'CANAI-ENHANCED-INTERFACE-CATALOG.json';

// Statistics tracking
const stats = {
  total: 0,
  enhanced: 0,
  missingFields: 0,
  emotionalSovereigntyUpdated: 0,
  relationshipsAdded: 0,
  usagePatternsAdded: 0,
  categoriesStandardized: 0,
  warnings: []
};

// Load catalogs
console.log('Loading catalogs...');

try {
  // Load auto-generated catalog
  let autoCatalog = null;
  if (fs.existsSync(AUTO_CATALOG_PATH)) {
    autoCatalog = JSON.parse(fs.readFileSync(AUTO_CATALOG_PATH, 'utf8'));
    console.log(`Loaded auto-generated catalog with ${Object.keys(autoCatalog.interfaces).length} interfaces`);
  } else {
    console.log('Auto-generated catalog not found');
    process.exit(1);
  }

  // Load V1 catalog
  let v1Catalog = null;
  if (fs.existsSync(V1_CATALOG_PATH)) {
    v1Catalog = JSON.parse(fs.readFileSync(V1_CATALOG_PATH, 'utf8'));
    console.log(`Loaded V1 catalog with ${Object.keys(v1Catalog.interfaces).length} interfaces`);
  } else {
    console.log('V1 catalog not found - continuing without it');
  }

  // Load V2 catalog
  let v2Catalog = null;
  if (fs.existsSync(V2_CATALOG_PATH)) {
    v2Catalog = JSON.parse(fs.readFileSync(V2_CATALOG_PATH, 'utf8'));
    console.log(`Loaded V2 catalog with ${Object.keys(v2Catalog.interfaces).length} interfaces`);
  } else {
    console.log('V2 catalog not found - continuing without it');
  }

  // Create enhanced catalog structure
  console.log('Creating enhanced catalog...');
  
  // Initialize with metadata
  const enhancedCatalog = {
    metadata: {
      version: 'v3.0',
      generated: new Date().toISOString().split('T')[0],
      framework: 'CanAI Codex v6.1.4',
      purpose: 'Unified, enhanced interface catalog with emotional sovereignty and trust transparency metrics',
      totalInterfaces: 0,
      enhancedInterfaces: 0,
      sources: {
        auto: autoCatalog ? Object.keys(autoCatalog.interfaces).length : 0,
        v1: v1Catalog ? Object.keys(v1Catalog.interfaces).length : 0,
        v2: v2Catalog ? Object.keys(v2Catalog.interfaces).length : 0
      },
      categories: [],
      integrationPriority: {
        critical: [],
        high: [],
        medium: [],
        low: []
      }
    },
    interfaces: {}
  };

  // Collect categories from all catalogs
  const allCategories = new Set([
    ...(autoCatalog?.metadata?.categories || []),
    ...(v1Catalog?.metadata?.categories || []),
    ...(v2Catalog?.metadata?.categories || [])
  ]);
  enhancedCatalog.metadata.categories = Array.from(allCategories);

  // Step 1: Initialize with auto-generated catalog interfaces
  console.log('Step 1: Initializing from auto-generated catalog...');
  
  for (const [name, interfaceData] of Object.entries(autoCatalog.interfaces)) {
    // Convert fields from array to object format (like V2)
    const formattedFields = {};
    
    if (Array.isArray(interfaceData.fields)) {
      interfaceData.fields.forEach(field => {
        formattedFields[field.name] = {
          type: field.type,
          required: field.required,
          description: field.description
        };
        
        // Add constraints if available
        if (field.constraints) {
          formattedFields[field.name].constraints = field.constraints;
        }
      });
    }
    
    // Initialize the interface with standardized format
    enhancedCatalog.interfaces[name] = {
      source: 'auto',
      category: interfaceData.category,
      path: interfaceData.path,
      purpose: interfaceData.purpose,
      integrationPriority: interfaceData.integrationPriority || 'low',
      fields: formattedFields,
      relationships: [],
      usagePatterns: [],
      emotionalSovereignty: interfaceData.emotionalSovereignty || {
        status: 'needs_review',
        notes: 'Needs emotional sovereignty assessment'
      }
    };
    
    // Add other metadata if available
    if (interfaceData.webhookCompatible !== undefined) {
      enhancedCatalog.interfaces[name].webhookCompatible = interfaceData.webhookCompatible;
    }
    
    if (interfaceData.developerNotes) {
      enhancedCatalog.interfaces[name].developerNotes = interfaceData.developerNotes;
    }
    
    if (interfaceData.supabaseMapping) {
      enhancedCatalog.interfaces[name].supabaseMapping = interfaceData.supabaseMapping;
    }
    
    stats.total++;
  }
  
  console.log(`  ✓ Initialized ${stats.total} interfaces from auto-generated catalog`);

  // Step 2: Enhance with V1 catalog
  if (v1Catalog) {
    console.log('Step 2: Enhancing with V1 catalog...');
    enhanceCatalog(enhancedCatalog, v1Catalog, 'v1');
  }
  
  // Step 3: Enhance with V2 catalog (takes precedence over V1)
  if (v2Catalog) {
    console.log('Step 3: Enhancing with V2 catalog...');
    enhanceCatalog(enhancedCatalog, v2Catalog, 'v2');
  }
  
  // Step 4: Standardize and fill gaps
  console.log('Step 4: Standardizing and filling gaps...');
  standardizeAndFillGaps(enhancedCatalog);
  
  // Step 5: Update metadata
  console.log('Step 5: Updating metadata...');
  updateMetadata(enhancedCatalog);
  
  // Save enhanced catalog
  console.log('Saving enhanced catalog...');
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enhancedCatalog, null, 2));
  console.log(`Enhanced catalog saved to ${OUTPUT_PATH}`);
  
  // Generate report
  console.log('\n📋 Enhancement Report:');
  console.log(`  • Total interfaces: ${stats.total}`);
  console.log(`  • Enhanced interfaces: ${stats.enhanced}`);
  console.log(`  • Missing fields added: ${stats.missingFields}`);
  console.log(`  • Emotional sovereignty updates: ${stats.emotionalSovereigntyUpdated}`);
  console.log(`  • Relationships added: ${stats.relationshipsAdded}`);
  console.log(`  • Usage patterns added: ${stats.usagePatternsAdded}`);
  console.log(`  • Categories standardized: ${stats.categoriesStandardized}`);
  console.log(`  • Warnings: ${stats.warnings.length}`);
  
  fs.writeFileSync(
    'interface-catalog-enhancement-report.json',
    JSON.stringify(stats, null, 2)
  );
  console.log('  ✓ Report saved to interface-catalog-enhancement-report.json');

} catch (error) {
  console.error(`Error: ${error.message}`);
  console.error(error.stack);
}

/**
 * Enhances the catalog with information from a curated catalog
 */
function enhanceCatalog(enhancedCatalog, curatedCatalog, source) {
  for (const [name, curatedInterface] of Object.entries(curatedCatalog.interfaces)) {
    // Check if interface exists in our enhanced catalog
    if (enhancedCatalog.interfaces[name]) {
      // Update existing interface with more detailed information
      const enhanced = enhancedCatalog.interfaces[name];
      
      // Update source info
      enhanced.sourceEnhanced = source;
      
      // Update purpose with more detailed version if available
      if (curatedInterface.purpose && curatedInterface.purpose.length > enhanced.purpose.length) {
        enhanced.purpose = curatedInterface.purpose;
      }
      
      // Update integration priority if available
      if (curatedInterface.integrationPriority) {
        enhanced.integrationPriority = curatedInterface.integrationPriority;
      }
      
      // Enhance fields with more detailed information
      if (curatedInterface.fields) {
        if (typeof curatedInterface.fields === 'object' && !Array.isArray(curatedInterface.fields)) {
          // V1/V2 format (object)
          for (const [fieldName, fieldData] of Object.entries(curatedInterface.fields)) {
            if (!enhanced.fields[fieldName]) {
              // Add missing field
              enhanced.fields[fieldName] = fieldData;
            } else {
              // Enhance existing field
              if (fieldData.description && fieldData.description.length > enhanced.fields[fieldName].description.length) {
                enhanced.fields[fieldName].description = fieldData.description;
              }
              
              // Add additional properties from curated field
              for (const [propName, propValue] of Object.entries(fieldData)) {
                if (!enhanced.fields[fieldName][propName]) {
                  enhanced.fields[fieldName][propName] = propValue;
                }
              }
            }
          }
        }
      }
      
      // Add relationships if available
      if (curatedInterface.relationships && Array.isArray(curatedInterface.relationships)) {
        enhanced.relationships = Array.from(new Set([
          ...enhanced.relationships,
          ...curatedInterface.relationships
        ]));
        stats.relationshipsAdded += curatedInterface.relationships.length;
      }
      
      // Add usage patterns if available
      if (curatedInterface.usagePatterns && Array.isArray(curatedInterface.usagePatterns)) {
        enhanced.usagePatterns = Array.from(new Set([
          ...enhanced.usagePatterns,
          ...curatedInterface.usagePatterns
        ]));
        stats.usagePatternsAdded += curatedInterface.usagePatterns.length;
      }
      
      // Enhance emotional sovereignty if available
      if (curatedInterface.emotionalSovereignty && 
          (curatedInterface.emotionalSovereignty.status === 'supported' || 
           (curatedInterface.emotionalSovereignty.notes && 
            (!enhanced.emotionalSovereignty.notes || 
             curatedInterface.emotionalSovereignty.notes.length > enhanced.emotionalSovereignty.notes.length)))) {
        enhanced.emotionalSovereignty = curatedInterface.emotionalSovereignty;
        stats.emotionalSovereigntyUpdated++;
      }
      
      stats.enhanced++;
    } else {
      // Interface doesn't exist in our catalog yet, add it
      let formattedFields = {};
      
      if (typeof curatedInterface.fields === 'object' && !Array.isArray(curatedInterface.fields)) {
        // V1/V2 format (object)
        formattedFields = { ...curatedInterface.fields };
      } else if (Array.isArray(curatedInterface.fields)) {
        // Convert array format to object format
        curatedInterface.fields.forEach(field => {
          formattedFields[field.name] = {
            type: field.type,
            required: field.required,
            description: field.description
          };
          
          // Add constraints if available
          if (field.constraints) {
            formattedFields[field.name].constraints = field.constraints;
          }
        });
      }
      
      // Add new interface
      enhancedCatalog.interfaces[name] = {
        source,
        category: curatedInterface.category,
        path: curatedInterface.path,
        purpose: curatedInterface.purpose,
        integrationPriority: curatedInterface.integrationPriority || 'low',
        fields: formattedFields,
        relationships: curatedInterface.relationships || [],
        usagePatterns: curatedInterface.usagePatterns || [],
        emotionalSovereignty: curatedInterface.emotionalSovereignty || {
          status: 'needs_review',
          notes: 'Needs emotional sovereignty assessment'
        }
      };
      
      // Add other metadata if available
      if (curatedInterface.webhookCompatible !== undefined) {
        enhancedCatalog.interfaces[name].webhookCompatible = curatedInterface.webhookCompatible;
      }
      
      if (curatedInterface.developerNotes) {
        enhancedCatalog.interfaces[name].developerNotes = curatedInterface.developerNotes;
      }
      
      if (curatedInterface.supabaseMapping) {
        enhancedCatalog.interfaces[name].supabaseMapping = curatedInterface.supabaseMapping;
      }
      
      // New interface counts as enhanced
      stats.enhanced++;
      stats.total++;
    }
  }
  
  console.log(`  ✓ Enhanced with ${source} catalog`);
}

/**
 * Standardizes categories and fills gaps in interfaces
 */
function standardizeAndFillGaps(enhancedCatalog) {
  for (const [name, interfaceData] of Object.entries(enhancedCatalog.interfaces)) {
    // Ensure integration priority is valid
    if (!['critical', 'high', 'medium', 'low'].includes(interfaceData.integrationPriority)) {
      interfaceData.integrationPriority = inferPriority(name, interfaceData.category);
    }
    
    // Standardize category
    const oldCategory = interfaceData.category;
    interfaceData.category = standardizeCategory(interfaceData.category);
    
    if (oldCategory !== interfaceData.category) {
      stats.categoriesStandardized++;
    }
    
    // Fill missing emotional sovereignty assessment
    if (!interfaceData.emotionalSovereignty || !interfaceData.emotionalSovereignty.status) {
      interfaceData.emotionalSovereignty = generateEmotionalSovereigntyAssessment(name, interfaceData);
      stats.emotionalSovereigntyUpdated++;
    }
    
    // Add missing fields for well-known interface types
    addMissingFields(name, interfaceData);
    
    // Infer relationships if empty
    if (!interfaceData.relationships || interfaceData.relationships.length === 0) {
      interfaceData.relationships = inferRelationships(name, interfaceData);
      if (interfaceData.relationships.length > 0) {
        stats.relationshipsAdded += interfaceData.relationships.length;
      }
    }
    
    // Infer usage patterns if empty
    if (!interfaceData.usagePatterns || interfaceData.usagePatterns.length === 0) {
      interfaceData.usagePatterns = inferUsagePatterns(name, interfaceData.category);
      if (interfaceData.usagePatterns.length > 0) {
        stats.usagePatternsAdded += interfaceData.usagePatterns.length;
      }
    }
  }
  
  console.log(`  ✓ Standardized and filled gaps`);
}

/**
 * Standardizes a category name
 */
function standardizeCategory(category) {
  // Map variations to standard categories
  const categoryMap = {
    'database': 'database_schema',
    'database_schemas': 'database_schema',
    'api': 'api_webhooks',
    'api_webhook': 'api_webhooks',
    'webhook': 'api_webhooks',
    'emotional': 'emotional_intelligence',
    'analytic': 'analytics'
  };
  
  return categoryMap[category.toLowerCase()] || category;
}

/**
 * Infers integration priority based on interface name and category
 */
function inferPriority(name, category) {
  // Critical interfaces
  if (name.includes('Analytics') || 
      name.includes('Metrics') || 
      name.includes('SparkSplit') ||
      name.includes('Trust') ||
      name.includes('User') ||
      name.includes('Session')) {
    return 'critical';
  }
  
  // High priority interfaces
  if (name.includes('Prompt') ||
      name.includes('Emotional') ||
      name.includes('Plan') ||
      category === 'prompts') {
    return 'high';
  }
  
  // Medium priority interfaces
  if (name.includes('Config') ||
      name.includes('Settings') ||
      category === 'core_services') {
    return 'medium';
  }
  
  // Default to low
  return 'low';
}

/**
 * Generates an emotional sovereignty assessment based on interface name and fields
 */
function generateEmotionalSovereigntyAssessment(name, interfaceData) {
  // Check if fields contain emotional sovereignty indicators
  const hasEmotionalFields = Object.values(interfaceData.fields).some(field => 
    field.description && (
      field.description.includes('trust') ||
      field.description.includes('emotional') ||
      field.description.includes('sovereignty')
    )
  );
  
  // Check if name suggests emotional sovereignty
  const nameIndicatesEmotional = 
    name.includes('Emotional') ||
    name.includes('Trust') ||
    name.includes('SparkSplit') ||
    name.includes('Sentiment');
  
  if (hasEmotionalFields || nameIndicatesEmotional) {
    return {
      status: 'supported',
      notes: 'Interface includes emotional sovereignty metrics and supports trust transparency'
    };
  } else if (interfaceData.category === 'prompts' || interfaceData.category === 'analytics') {
    return {
      status: 'needs_enhancement',
      notes: 'Should add trust scores and emotional sovereignty metrics'
    };
  } else {
    return {
      status: 'needs_review',
      notes: 'Needs emotional sovereignty assessment'
    };
  }
}

/**
 * Adds missing fields based on interface type
 */
function addMissingFields(name, interfaceData) {
  // Check for minimal fields
  if (Object.keys(interfaceData.fields).length < 2) {
    // Add standard fields based on interface type
    if (interfaceData.category === 'prompts') {
      if (!interfaceData.fields.id) {
        interfaceData.fields.id = {
          type: 'string',
          required: true,
          description: 'Unique identifier'
        };
      }
      
      if (!interfaceData.fields.trustScore) {
        interfaceData.fields.trustScore = {
          type: 'number',
          required: true,
          description: 'Trust transparency score (0-5)',
          range: [0, 5]
        };
      }
      
      if (!interfaceData.fields.emotionalDepth) {
        interfaceData.fields.emotionalDepth = {
          type: 'number',
          required: true,
          description: 'Emotional intelligence depth (0-1)',
          range: [0, 1]
        };
      }
    } else if (interfaceData.category === 'database_schema') {
      if (!interfaceData.fields.id) {
        interfaceData.fields.id = {
          type: 'UUID',
          required: true,
          description: 'Unique identifier'
        };
      }
      
      if (!interfaceData.fields.created_at) {
        interfaceData.fields.created_at = {
          type: 'timestamp',
          required: true,
          description: 'Record creation timestamp'
        };
      }
      
      if (!interfaceData.fields.updated_at) {
        interfaceData.fields.updated_at = {
          type: 'timestamp',
          required: false,
          description: 'Last update timestamp'
        };
      }
    } else if (interfaceData.category === 'emotional_intelligence') {
      if (!interfaceData.fields.trustScore) {
        interfaceData.fields.trustScore = {
          type: 'number',
          required: true,
          description: 'Trust transparency score (0-5)',
          range: [0, 5]
        };
      }
      
      if (!interfaceData.fields.emotionalSovereigntyStatus) {
        interfaceData.fields.emotionalSovereigntyStatus = {
          type: 'string',
          required: true,
          description: 'Emotional sovereignty status',
          enum: ['supported', 'needs_enhancement', 'needs_review']
        };
      }
    }
    
    stats.missingFields++;
  }
}

/**
 * Infers relationships based on interface name
 */
function inferRelationships(name, interfaceData) {
  const relationships = [];
  
  // Common relationships based on interface name
  if (name.includes('Analytics')) {
    relationships.push('UserContext', 'PromptLogs');
  }
  
  if (name.includes('Prompt')) {
    relationships.push('PromptLogs', 'SessionAnalytics');
  }
  
  if (name.includes('SparkSplit')) {
    relationships.push('SparkSplitMetrics', 'SessionAnalytics');
  }
  
  if (name.includes('User')) {
    relationships.push('SessionAnalytics', 'PromptLogs');
  }
  
  if (name.includes('Emotional')) {
    relationships.push('UserContext', 'SessionAnalytics', 'EmotionalIntelligenceMetrics');
  }
  
  return relationships;
}

/**
 * Infers usage patterns based on interface name and category
 */
function inferUsagePatterns(name, category) {
  const patterns = [];
  
  // Infer usage patterns based on category
  if (category === 'database_schema') {
    patterns.push('data_storage', 'analytics_tracking');
  }
  
  if (category === 'prompts') {
    patterns.push('content_generation', 'user_interaction');
  }
  
  if (category === 'analytics') {
    patterns.push('metrics_tracking', 'performance_analysis');
  }
  
  if (category === 'emotional_intelligence') {
    patterns.push('trust_building', 'emotional_sovereignty_validation');
  }
  
  if (category === 'api_webhooks') {
    patterns.push('integration', 'data_exchange');
  }
  
  // Add specific patterns based on name
  if (name.includes('SparkSplit')) {
    patterns.push('trust_transparency', 'competitive_advantage');
  }
  
  if (name.includes('Metrics')) {
    patterns.push('performance_monitoring', 'trend_analysis');
  }
  
  return patterns;
}

/**
 * Updates metadata in the enhanced catalog
 */
function updateMetadata(enhancedCatalog) {
  // Update total interfaces
  enhancedCatalog.metadata.totalInterfaces = Object.keys(enhancedCatalog.interfaces).length;
  enhancedCatalog.metadata.enhancedInterfaces = stats.enhanced;
  
  // Update integration priorities
  for (const [name, interfaceData] of Object.entries(enhancedCatalog.interfaces)) {
    if (!enhancedCatalog.metadata.integrationPriority[interfaceData.integrationPriority].includes(name)) {
      enhancedCatalog.metadata.integrationPriority[interfaceData.integrationPriority].push(name);
    }
  }
  
  // Add emotional sovereignty compliance metadata
  enhancedCatalog.metadata.emotionalSovereigntyCompliance = {
    supported: Object.values(enhancedCatalog.interfaces).filter(i => 
      i.emotionalSovereignty && i.emotionalSovereignty.status === 'supported'
    ).length,
    needsEnhancement: Object.values(enhancedCatalog.interfaces).filter(i => 
      i.emotionalSovereignty && i.emotionalSovereignty.status === 'needs_enhancement'
    ).length,
    needsReview: Object.values(enhancedCatalog.interfaces).filter(i => 
      i.emotionalSovereignty && i.emotionalSovereignty.status === 'needs_review'
    ).length
  };
  
  console.log(`  ✓ Updated metadata`);
}
