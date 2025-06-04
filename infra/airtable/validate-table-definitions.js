/**
 * DEPRECATED: This script references deleted airtable-table-definitions.json
 * Legacy table definitions file has been deleted as part of 36→18 table transformation
 * Use direct Airtable API integration for 18-table architecture instead
 * 
 * Table Definition Validator
 * 
 * Validates the Airtable table definitions for completeness, integrity, and Make.com integration compatibility.
 * Codex v6.1.4 compliant with production-ready error handling and logging.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json');
const OUTPUT_FILE = path.join(__dirname, 'validation-results.json');
const LOG_FILE = path.join(__dirname, 'validation-log.md');

// Required emotional roles
const VALID_EMOTIONAL_ROLES = [
  'identity', 'traceability', 'clarity', 'trust', 'emotion', 'context', 'resilience', 'improvement'
];

// Required data sensitivity levels
const VALID_DATA_SENSITIVITY = [
  'internal', 'pii', 'public'
];

// Required field types
const VALID_FIELD_TYPES = [
  'string', 'number', 'boolean', 'datetime', 'json', 'longtext', 'ULID'
];

// Essential Make.com scenarios
const ESSENTIAL_MAKE_SCENARIOS = [
  'admin_add_project', 'add_project', 'add_client', 'saap_update', 'emotional_recovery', 'sparksplit_integration'
];

// Utility: Write to log file
function appendToLog(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `\n## ${timestamp}\n${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
  console.log(message);
}

// Utility: Initialize log file
function initializeLog() {
  const header = `# Table Definition Validation Log\n\nValidation started at ${new Date().toISOString()}\n`;
  fs.writeFileSync(LOG_FILE, header, 'utf8');
}

// Load table definitions
function loadTableDefinitions() {
  try {
    return JSON.parse(fs.readFileSync(TABLE_DEFINITIONS_PATH, 'utf8'));
  } catch (error) {
    appendToLog(`❌ Error loading table definitions: ${error.message}`);
    return null;
  }
}

// Validate a single field
function validateField(field, tableName) {
  const errors = [];
  const warnings = [];
  
  // Check required properties
  if (!field.name) errors.push(`Field is missing 'name' property`);
  if (!field.type) errors.push(`Field '${field.name}' is missing 'type' property`);
  if (field.required === undefined) errors.push(`Field '${field.name}' is missing 'required' property`);
  if (!field.description) warnings.push(`Field '${field.name}' is missing 'description'`);
  
  // Check emotional role
  if (!field.emotionalRole) {
    errors.push(`Field '${field.name}' is missing 'emotionalRole' property`);
  } else if (!VALID_EMOTIONAL_ROLES.includes(field.emotionalRole)) {
    errors.push(`Field '${field.name}' has invalid emotionalRole: '${field.emotionalRole}'`);
  }
  
  // Check data sensitivity
  if (!field.dataSensitivity) {
    errors.push(`Field '${field.name}' is missing 'dataSensitivity' property`);
  } else if (!VALID_DATA_SENSITIVITY.includes(field.dataSensitivity)) {
    errors.push(`Field '${field.name}' has invalid dataSensitivity: '${field.dataSensitivity}'`);
  }
  
  // Check field type
  if (field.type && !VALID_FIELD_TYPES.includes(field.type)) {
    errors.push(`Field '${field.name}' has invalid type: '${field.type}'`);
  }
  
  // Check field name format (should be camelCase)
  if (field.name && field.name !== field.name.charAt(0).toLowerCase() + field.name.slice(1)) {
    warnings.push(`Field '${field.name}' should be camelCase`);
  }
  
  return { errors, warnings };
}

// Validate relationships
function validateRelationships(relationships, allTableNames, tableName) {
  const errors = [];
  const warnings = [];
  
  if (!relationships || !Array.isArray(relationships)) {
    errors.push(`Table '${tableName}' is missing relationships array`);
    return { errors, warnings };
  }
  
  relationships.forEach(relationship => {
    // Check required properties
    if (!relationship.targetTable) errors.push(`Relationship is missing 'targetTable' property`);
    if (!relationship.type) errors.push(`Relationship is missing 'type' property`);
    if (!relationship.keyField) errors.push(`Relationship is missing 'keyField' property`);
    
    // Check if target table exists
    if (relationship.targetTable && !allTableNames.includes(relationship.targetTable)) {
      errors.push(`Relationship target table '${relationship.targetTable}' does not exist`);
    }
    
    // Check relationship type
    if (relationship.type && !['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany'].includes(relationship.type)) {
      errors.push(`Invalid relationship type: '${relationship.type}'`);
    }
  });
  
  return { errors, warnings };
}

// Validate Make.com integration points
function validateMakeIntegration(makeIntegrationPoints, fields, tableName) {
  const errors = [];
  const warnings = [];
  
  if (!makeIntegrationPoints || !Array.isArray(makeIntegrationPoints)) {
    if (tableName === 'PromptLogs' || tableName === 'SparkSplitAnalytics' || 
        tableName === 'EmotionalSovereignty' || tableName === 'EmotionalRecovery') {
      errors.push(`Table '${tableName}' is missing Make.com integration points array`);
    }
    return { errors, warnings };
  }
  
  const fieldNames = fields.map(field => field.name);
  
  makeIntegrationPoints.forEach(integration => {
    // Check required properties
    if (!integration.scenarioName) errors.push(`Make.com integration is missing 'scenarioName' property`);
    if (!integration.webhookId) errors.push(`Make.com integration is missing 'webhookId' property`);
    if (!integration.fields || !Array.isArray(integration.fields)) {
      errors.push(`Make.com integration is missing 'fields' array`);
    } else {
      // Check if all fields exist in the table
      integration.fields.forEach(field => {
        if (!fieldNames.includes(field)) {
          errors.push(`Make.com integration field '${field}' does not exist in table`);
        }
      });
    }
    
    // Check scenario name
    if (integration.scenarioName && !ESSENTIAL_MAKE_SCENARIOS.includes(integration.scenarioName)) {
      warnings.push(`Non-standard Make.com scenario name: '${integration.scenarioName}'`);
    }
  });
  
  return { errors, warnings };
}

// Validate a single table
function validateTable(table, allTableNames) {
  const errors = [];
  const warnings = [];
  
  // Check required properties
  if (!table.name) errors.push(`Table is missing 'name' property`);
  if (!table.description) warnings.push(`Table is missing 'description' property`);
  if (!table.primaryKey) errors.push(`Table is missing 'primaryKey' property`);
  if (table.makeIntegration === undefined) warnings.push(`Table is missing 'makeIntegration' property`);
  if (table.priority === undefined) warnings.push(`Table is missing 'priority' property`);
  
  // Check fields
  if (!table.fields || !Array.isArray(table.fields) || table.fields.length === 0) {
    errors.push(`Table '${table.name}' has no fields`);
  } else {
    // Validate each field
    const fieldValidations = table.fields.map(field => validateField(field, table.name));
    
    fieldValidations.forEach((validation, index) => {
      const fieldName = table.fields[index].name || `at index ${index}`;
      
      validation.errors.forEach(error => {
        errors.push(`Field '${fieldName}' in table '${table.name}': ${error}`);
      });
      
      validation.warnings.forEach(warning => {
        warnings.push(`Field '${fieldName}' in table '${table.name}': ${warning}`);
      });
    });
    
    // Check for required system fields
    const hasRecordId = table.fields.some(field => field.name === 'recordId');
    const hasCreatedAt = table.fields.some(field => field.name === 'createdAt');
    const hasUpdatedAt = table.fields.some(field => field.name === 'updatedAt');
    
    if (!hasRecordId) errors.push(`Table '${table.name}' is missing required 'recordId' field`);
    if (!hasCreatedAt) errors.push(`Table '${table.name}' is missing required 'createdAt' field`);
    if (!hasUpdatedAt) errors.push(`Table '${table.name}' is missing required 'updatedAt' field`);
    
    // Check for duplicate field names
    const fieldNames = table.fields.map(field => field.name);
    const uniqueFieldNames = [...new Set(fieldNames)];
    
    if (fieldNames.length !== uniqueFieldNames.length) {
      errors.push(`Table '${table.name}' has duplicate field names`);
    }
  }
  
  // Validate relationships
  if (table.relationships) {
    const relationshipValidation = validateRelationships(table.relationships, allTableNames, table.name);
    
    relationshipValidation.errors.forEach(error => {
      errors.push(`Table '${table.name}' relationships: ${error}`);
    });
    
    relationshipValidation.warnings.forEach(warning => {
      warnings.push(`Table '${table.name}' relationships: ${warning}`);
    });
  }
  
  // Validate Make.com integration
  if (table.makeIntegrationPoints) {
    const makeValidation = validateMakeIntegration(table.makeIntegrationPoints, table.fields || [], table.name);
    
    makeValidation.errors.forEach(error => {
      errors.push(`Table '${table.name}' Make.com integration: ${error}`);
    });
    
    makeValidation.warnings.forEach(warning => {
      warnings.push(`Table '${table.name}' Make.com integration: ${warning}`);
    });
  }
  
  return {
    tableName: table.name || 'Unnamed table',
    isValid: errors.length === 0,
    errors,
    warnings,
    fieldCount: table.fields?.length || 0
  };
}

// Validate all tables
function validateTables(tables) {
  if (!tables || !Array.isArray(tables)) {
    appendToLog('❌ No tables to validate or invalid format');
    return { 
      isValid: false, 
      tableValidations: [], 
      summary: { 
        totalTables: 0, 
        validTables: 0, 
        totalErrors: 0, 
        totalWarnings: 0 
      } 
    };
  }
  
  const allTableNames = tables.map(table => table.name).filter(Boolean);
  
  // Validate each table
  const tableValidations = tables.map(table => validateTable(table, allTableNames));
  
  // Calculate summary
  const totalTables = tables.length;
  const validTables = tableValidations.filter(validation => validation.isValid).length;
  const totalErrors = tableValidations.reduce((sum, validation) => sum + validation.errors.length, 0);
  const totalWarnings = tableValidations.reduce((sum, validation) => sum + validation.warnings.length, 0);
  const totalFields = tableValidations.reduce((sum, validation) => sum + validation.fieldCount, 0);
  
  // Check for essential tables
  const essentialTables = ['PromptLogs', 'SparkSplitAnalytics', 'EmotionalSovereignty', 'SessionAnalytics', 'UserContext', 'EmotionalRecovery'];
  const missingEssentialTables = essentialTables.filter(tableName => !allTableNames.includes(tableName));
  
  const summary = {
    totalTables,
    validTables,
    totalErrors,
    totalWarnings,
    totalFields,
    missingEssentialTables,
    makeIntegrationTables: tables.filter(table => table.makeIntegration).length,
    highPriorityTables: tables.filter(table => table.priority <= 8).length
  };
  
  return { 
    isValid: totalErrors === 0 && missingEssentialTables.length === 0,
    tableValidations,
    summary
  };
}

// Main execution
function main() {
  // Initialize log
  initializeLog();
  
  appendToLog('🔍 Starting table definition validation...');
  
  // Load table definitions
  const tableDefinitions = loadTableDefinitions();
  
  if (!tableDefinitions) {
    appendToLog('❌ Could not load table definitions. Validation aborted.');
    return;
  }
  
  appendToLog(`📊 Found ${tableDefinitions.length} table definitions to validate`);
  
  // Validate tables
  const validationResult = validateTables(tableDefinitions);
  
  // Write validation results to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validationResult, null, 2), 'utf8');
  
  // Log summary
  const summary = validationResult.summary;
  
  appendToLog(`\n## Validation Summary`);
  appendToLog(`- Total tables: ${summary.totalTables}`);
  appendToLog(`- Valid tables: ${summary.validTables}`);
  appendToLog(`- Total fields: ${summary.totalFields}`);
  appendToLog(`- Total errors: ${summary.totalErrors}`);
  appendToLog(`- Total warnings: ${summary.totalWarnings}`);
  appendToLog(`- Make.com integration tables: ${summary.makeIntegrationTables}`);
  appendToLog(`- High priority tables: ${summary.highPriorityTables}`);
  
  if (summary.missingEssentialTables.length > 0) {
    appendToLog(`\n⚠️ Missing essential tables: ${summary.missingEssentialTables.join(', ')}`);
  }
  
  // Log status
  if (validationResult.isValid) {
    appendToLog(`\n✅ Validation successful! All tables are valid.`);
  } else {
    appendToLog(`\n❌ Validation failed with ${summary.totalErrors} errors.`);
    
    // Log first 10 errors
    const allErrors = validationResult.tableValidations
      .flatMap(validation => validation.errors.map(error => `[${validation.tableName}] ${error}`));
    
    if (allErrors.length > 0) {
      appendToLog(`\n## First ${Math.min(10, allErrors.length)} errors:`);
      allErrors.slice(0, 10).forEach(error => {
        appendToLog(`- ${error}`);
      });
      
      if (allErrors.length > 10) {
        appendToLog(`... and ${allErrors.length - 10} more errors. See validation-results.json for details.`);
      }
    }
  }
  
  appendToLog(`\n🔍 Validation completed at ${new Date().toISOString()}`);
  appendToLog(`📝 Full results written to ${OUTPUT_FILE}`);
}

// Execute main function with error handling
try {
  main();
} catch (error) {
  appendToLog(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
} 