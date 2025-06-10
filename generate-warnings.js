const fs = require('fs');

// Load the cleaned catalog
const catalog = JSON.parse(fs.readFileSync('CANAI-DEFINITIVE-INTERFACE-CATALOG-2025-CLEANED.json', 'utf-8'));

// Initialize warnings array
const warnings = [];

// Define expected field types for Supabase validation
const expectedFieldTypes = {
  'trust_score': 'numeric',
  'emotional_depth': 'numeric',
  'sentiment_score': 'numeric',
  'session_id': 'varchar',
  'user_id': 'varchar',
  'comparison_id': 'varchar',
  'competitive_advantage': 'numeric'
};

// Define critical interfaces that need special attention
const criticalInterfaces = [
  'BusinessPlanPrompt',
  'SparkSplitPrompt',
  'EmotionalExpectation',
  'AnalyticsQuery',
  'SessionAnalytics',
  'PromptLogs',
  'TrustFactors',
  'EmotionalSovereigntyRequest',
  'EmotionalSovereigntyResponse'
];

// Analyze each interface
for (const [interfaceName, interfaceData] of Object.entries(catalog.interfaces)) {
  // Check for missing fields in critical interfaces
  if (criticalInterfaces.includes(interfaceName)) {
    const requiredFields = getRequiredFieldsForInterface(interfaceName);
    const missingFields = requiredFields.filter(field => 
      !interfaceData.fields.some(f => f.name === field)
    );
    
    if (missingFields.length > 0) {
      warnings.push({
        type: 'missing_critical_fields',
        interface: interfaceName,
        fields: missingFields,
        priority: 'high',
        remediationSteps: `Add missing fields (${missingFields.join(', ')}) to ${interfaceName}`
      });
    }
  }
  
  // Check for emotional sovereignty fields when needed
  if (interfaceData.emotionalSovereignty.status === 'needs_review') {
    warnings.push({
      type: 'emotional_sovereignty_review',
      interface: interfaceName,
      fields: ['trust_score', 'emotional_depth', 'sentiment_score'],
      priority: interfaceName.includes('Emotional') || interfaceName.includes('Trust') ? 'high' : 'medium',
      remediationSteps: `Consider adding emotional sovereignty fields to ${interfaceName}`
    });
  }
  
  // Check database mappings for database_schemas category
  if (interfaceData.category === 'database_schemas' && interfaceData.supabaseMapping) {
    // Check if mappings are empty
    if (Object.keys(interfaceData.supabaseMapping.columns).length === 0) {
      warnings.push({
        type: 'empty_supabase_mapping',
        interface: interfaceName,
        priority: 'medium',
        remediationSteps: `Populate supabaseMapping.columns for ${interfaceName}`
      });
    }
    
    // Check field types against expected Supabase types
    interfaceData.fields.forEach(field => {
      const snakeCaseField = camelToSnakeCase(field.name);
      if (expectedFieldTypes[snakeCaseField] && 
          (!interfaceData.supabaseMapping.columns[snakeCaseField] || 
           interfaceData.supabaseMapping.columns[snakeCaseField] !== expectedFieldTypes[snakeCaseField])) {
        warnings.push({
          type: 'field_type_mismatch',
          interface: interfaceName,
          field: field.name,
          expectedType: expectedFieldTypes[snakeCaseField],
          actualType: interfaceData.supabaseMapping.columns[snakeCaseField] || 'undefined',
          priority: 'high',
          remediationSteps: `Ensure ${field.name} maps to ${expectedFieldTypes[snakeCaseField]} in Supabase`
        });
      }
    });
  }
  
  // Check for webhook compatibility issues
  if (interfaceData.webhookCompatible) {
    const hasComplexTypes = interfaceData.fields.some(field => 
      field.type === 'Function' || 
      field.type === 'Symbol' ||
      field.type === 'undefined' ||
      field.type.includes('Promise')
    );
    
    if (hasComplexTypes) {
      warnings.push({
        type: 'webhook_incompatible_fields',
        interface: interfaceName,
        priority: 'high',
        remediationSteps: `Remove complex types from ${interfaceName} for webhook compatibility`
      });
    }
  }
  
  // Check for missing descriptions
  const fieldsWithoutDescription = interfaceData.fields.filter(field => 
    !field.description || field.description === `${field.name} field`
  );
  
  if (fieldsWithoutDescription.length > 0) {
    warnings.push({
      type: 'missing_field_descriptions',
      interface: interfaceName,
      fields: fieldsWithoutDescription.map(f => f.name),
      priority: 'low',
      remediationSteps: `Add meaningful descriptions to fields in ${interfaceName}`
    });
  }
  
  // Specifically check AnalyticsQuery for trust_score validation
  if (interfaceName === 'AnalyticsQuery') {
    const trustScoreField = interfaceData.fields.find(f => f.name === 'trust_score');
    if (trustScoreField && !trustScoreField.constraints) {
      warnings.push({
        type: 'missing_constraints',
        interface: 'AnalyticsQuery',
        field: 'trust_score',
        priority: 'high',
        remediationSteps: 'Add constraints to AnalyticsQuery.trust_score: {"type": "range", "min": 0, "max": 5}'
      });
    }
    
    // Check Supabase mapping
    if (interfaceData.supabaseMapping) {
      const trustScoreMapping = interfaceData.supabaseMapping.columns['trust_score'];
      if (trustScoreMapping !== 'numeric') {
        warnings.push({
          type: 'incorrect_supabase_mapping',
          interface: 'AnalyticsQuery',
          field: 'trust_score',
          expectedType: 'numeric',
          actualType: trustScoreMapping || 'undefined',
          priority: 'high',
          remediationSteps: 'Fix AnalyticsQuery.trust_score mapping to numeric type in Supabase'
        });
      }
    }
  }
}

// Add inferred type warnings for dynamic interfaces
warnings.push({
  type: 'inferred_schema',
  interface: 'PromptLogs',
  priority: 'medium',
  fields: ['trustScore', 'sessionId', 'userId', 'timestamp'],
  remediationSteps: 'Verify inferred fields for PromptLogs against actual Zod schema'
});

warnings.push({
  type: 'inferred_schema',
  interface: 'SparkSplitAnalytics',
  priority: 'high',
  fields: ['comparison_id', 'trust_delta', 'user_selection', 'competitive_advantage'],
  remediationSteps: 'Verify SparkSplitAnalytics fields against actual implementation'
});

// Helper function to get required fields for critical interfaces
function getRequiredFieldsForInterface(interfaceName) {
  switch (interfaceName) {
    case 'BusinessPlanPrompt':
      return ['id', 'idea', 'audience', 'tone', 'industry'];
    case 'SparkSplitPrompt':
      return ['id', 'comparison_id', 'trust_delta', 'user_selection', 'competitive_advantage'];
    case 'EmotionalExpectation':
      return ['id', 'trust_score', 'emotional_depth', 'sentiment_score'];
    case 'AnalyticsQuery':
      return ['id', 'session_id', 'user_id', 'trust_score'];
    case 'SessionAnalytics':
      return ['id', 'session_id', 'user_id', 'trust_score'];
    case 'PromptLogs':
      return ['id', 'session_id', 'trust_score'];
    case 'TrustFactors':
      return ['id', 'trust_score', 'emotional_depth'];
    case 'EmotionalSovereigntyRequest':
    case 'EmotionalSovereigntyResponse':
      return ['id', 'trust_score', 'emotional_depth', 'sentiment_score'];
    default:
      return ['id'];
  }
}

// Helper function to convert camelCase to snake_case
function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Add specific assumptions made during catalog generation
warnings.push({
  type: 'assumption',
  description: 'Inferred fields for PromptLogs due to missing Zod schema',
  priority: 'medium',
  remediationSteps: 'Validate PromptLogs fields against actual Zod schema implementation'
});

warnings.push({
  type: 'assumption',
  description: 'Assumed standard Supabase numeric type for all score fields',
  priority: 'medium',
  remediationSteps: 'Verify numeric field types against actual Supabase schema'
});

warnings.push({
  type: 'assumption',
  description: 'Webhook compatibility determined without access to Make.com integration code',
  priority: 'high',
  remediationSteps: 'Validate webhook compatibility with actual Make.com scenarios'
});

// Save warnings to file
fs.writeFileSync('interface_warnings.json', JSON.stringify({
  metadata: {
    generatedAt: new Date().toISOString(),
    warningCount: warnings.length,
    priorityBreakdown: {
      high: warnings.filter(w => w.priority === 'high').length,
      medium: warnings.filter(w => w.priority === 'medium').length,
      low: warnings.filter(w => w.priority === 'low').length
    }
  },
  warnings: warnings
}, null, 2));

console.log(`Generated ${warnings.length} warnings.`);
console.log(`High priority: ${warnings.filter(w => w.priority === 'high').length}`);
console.log(`Medium priority: ${warnings.filter(w => w.priority === 'medium').length}`);
console.log(`Low priority: ${warnings.filter(w => w.priority === 'low').length}`);
