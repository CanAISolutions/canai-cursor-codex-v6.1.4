/**
 * Schema Integrity Tests
 * 
 * Purpose: Ensures all prompt templates have Airtable-mapped variables
 * and prevents schema drift between templates and database schema.
 * 
 * Codex: v6.1.4
 * Schema Lock: v3
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Schema lock reference
const SCHEMA_LOCK_PATH = '../../schemas/airtable-v3.lock.json';
const PROMPTS_DIR = '../../prompts';
const GPT_TEMPLATES_DIR = '../../gpt-templates';

interface SchemaLock {
  version: string;
  status: string;
  fields: string[];
  emotionalDefaults: Record<string, string>;
  templateCoverage: string;
  trust: string;
  enforcement: {
    codexValidation: boolean;
    driftProtection: boolean;
    mcpEnhancement: boolean;
    schemaIntegrity: boolean;
  };
  mcpEnhancers: Record<string, string>;
  validationRules: {
    requiredFields: string[];
    enhancedFields: string[];
    emotionalFields: string[];
  };
}

interface TemplateVariable {
  name: string;
  file: string;
  line: number;
  context: string;
}

function loadSchemaLock(): SchemaLock {
  try {
    const lockContent = readFileSync(join(__dirname, SCHEMA_LOCK_PATH), 'utf-8');
    return JSON.parse(lockContent);
  } catch (error) {
    throw new Error(`Failed to load schema lock: ${error}`);
  }
}

function extractVariablesFromTemplate(filePath: string, content: string): TemplateVariable[] {
  const variables: TemplateVariable[] = [];
  const lines = content.split('\n');
  
  // Match template variables like {{variable}}, {variable}, ${variable}
  const variableRegex = /\{\{?([a-zA-Z_][a-zA-Z0-9_]*)\}?\}/g;
  
  lines.forEach((line, index) => {
    let match;
    while ((match = variableRegex.exec(line)) !== null) {
      const variableName = match[1];
      variables.push({
        name: variableName,
        file: filePath,
        line: index + 1,
        context: line.trim()
      });
    }
  });
  
  return variables;
}

function findTemplateFiles(directory: string): string[] {
  try {
    const files = readdirSync(join(__dirname, directory), { recursive: true });
    return files
      .filter(file => typeof file === 'string')
      .filter(file => file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json'))
      .map(file => join(__dirname, directory, file));
  } catch (error) {
    console.warn(`Could not read directory ${directory}: ${error}`);
    return [];
  }
}

function findUnmappedTemplateVariables(): TemplateVariable[] {
  const schemaLock = loadSchemaLock();
  const allowedFields = new Set([
    ...schemaLock.fields,
    ...schemaLock.validationRules.requiredFields,
    ...schemaLock.validationRules.enhancedFields,
    ...schemaLock.validationRules.emotionalFields,
    // Add common system variables
    'timestamp', 'sessionId', 'userId', 'version', 'promptType'
  ]);
  
  const unmappedVariables: TemplateVariable[] = [];
  
  // Check prompt templates
  const promptFiles = findTemplateFiles(PROMPTS_DIR);
  const gptTemplateFiles = findTemplateFiles(GPT_TEMPLATES_DIR);
  
  [...promptFiles, ...gptTemplateFiles].forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const variables = extractVariablesFromTemplate(filePath, content);
      
      variables.forEach(variable => {
        if (!allowedFields.has(variable.name)) {
          unmappedVariables.push(variable);
        }
      });
    } catch (error) {
      console.warn(`Could not read file ${filePath}: ${error}`);
    }
  });
  
  return unmappedVariables;
}

function validateSchemaLockIntegrity(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const schemaLock = loadSchemaLock();
    
    // Validate schema lock structure
    if (!schemaLock.version) {
      errors.push('Schema lock missing version');
    }
    
    if (!schemaLock.fields || !Array.isArray(schemaLock.fields)) {
      errors.push('Schema lock missing or invalid fields array');
    }
    
    if (!schemaLock.enforcement || typeof schemaLock.enforcement !== 'object') {
      errors.push('Schema lock missing enforcement configuration');
    }
    
    if (!schemaLock.mcpEnhancers || typeof schemaLock.mcpEnhancers !== 'object') {
      errors.push('Schema lock missing MCP enhancers configuration');
    }
    
    // Validate enforcement flags
    const requiredEnforcement = ['codexValidation', 'driftProtection', 'mcpEnhancement', 'schemaIntegrity'];
    requiredEnforcement.forEach(flag => {
      if (!schemaLock.enforcement[flag as keyof typeof schemaLock.enforcement]) {
        errors.push(`Schema lock missing enforcement flag: ${flag}`);
      }
    });
    
    // Validate MCP enhancer mappings
    const requiredEnhancers = ['problemSolved', 'customerContent', 'differentiator', 'founderBio'];
    requiredEnhancers.forEach(enhancer => {
      if (!schemaLock.mcpEnhancers[enhancer]) {
        errors.push(`Schema lock missing MCP enhancer: ${enhancer}`);
      }
    });
    
  } catch (error) {
    errors.push(`Failed to validate schema lock: ${error}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateMCPEnhancerCoverage(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const schemaLock = loadSchemaLock();
    const enhancedFields = schemaLock.validationRules.enhancedFields;
    const mcpEnhancers = Object.keys(schemaLock.mcpEnhancers);
    
    // Check that all enhanced fields have MCP enhancers
    enhancedFields.forEach(field => {
      if (!mcpEnhancers.includes(field)) {
        errors.push(`Enhanced field '${field}' missing MCP enhancer`);
      }
    });
    
    // Check that all MCP enhancers target valid fields
    mcpEnhancers.forEach(enhancer => {
      if (!enhancedFields.includes(enhancer)) {
        errors.push(`MCP enhancer '${enhancer}' targets non-enhanced field`);
      }
    });
    
  } catch (error) {
    errors.push(`Failed to validate MCP enhancer coverage: ${error}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Test Suite
describe('Schema Integrity Tests', () => {
  test('Schema lock file exists and is valid', () => {
    const validation = validateSchemaLockIntegrity();
    
    if (!validation.isValid) {
      console.error('Schema lock validation errors:', validation.errors);
    }
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
  
  test('All prompt templates have Airtable-mapped variables', () => {
    const unmapped = findUnmappedTemplateVariables();
    
    if (unmapped.length > 0) {
      console.error('Unmapped template variables found:');
      unmapped.forEach(variable => {
        console.error(`  - ${variable.name} in ${variable.file}:${variable.line}`);
        console.error(`    Context: ${variable.context}`);
      });
    }
    
    expect(unmapped).toHaveLength(0);
  });
  
  test('MCP enhancers cover all enhanced fields', () => {
    const validation = validateMCPEnhancerCoverage();
    
    if (!validation.isValid) {
      console.error('MCP enhancer coverage errors:', validation.errors);
    }
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
  
  test('Schema lock enforcement is enabled', () => {
    const schemaLock = loadSchemaLock();
    
    expect(schemaLock.enforcement.codexValidation).toBe(true);
    expect(schemaLock.enforcement.driftProtection).toBe(true);
    expect(schemaLock.enforcement.mcpEnhancement).toBe(true);
    expect(schemaLock.enforcement.schemaIntegrity).toBe(true);
  });
  
  test('Required fields are properly defined', () => {
    const schemaLock = loadSchemaLock();
    const requiredFields = schemaLock.validationRules.requiredFields;
    
    expect(requiredFields).toContain('idea');
    expect(requiredFields).toContain('audience');
    expect(requiredFields).toContain('tone');
  });
  
  test('Enhanced fields have MCP enhancer functions', () => {
    const schemaLock = loadSchemaLock();
    const enhancedFields = schemaLock.validationRules.enhancedFields;
    const mcpEnhancers = schemaLock.mcpEnhancers;
    
    enhancedFields.forEach(field => {
      expect(mcpEnhancers[field]).toBeDefined();
      expect(typeof mcpEnhancers[field]).toBe('string');
      expect(mcpEnhancers[field]).toMatch(/^infer[A-Z]/); // Should start with 'infer'
    });
  });
  
  test('Emotional defaults are properly configured', () => {
    const schemaLock = loadSchemaLock();
    const emotionalDefaults = schemaLock.emotionalDefaults;
    
    expect(emotionalDefaults.tone).toBe('supportive');
    expect(emotionalDefaults.emotionalContext).toBe('confident');
    expect(emotionalDefaults.voice).toBe('empowering');
    expect(emotionalDefaults.vibe).toBe('professional');
  });
  
  test('Schema lock version matches expected format', () => {
    const schemaLock = loadSchemaLock();
    
    expect(schemaLock.version).toBe('v3');
    expect(schemaLock.status).toBe('Codex-Validated');
    expect(schemaLock.trust).toBe('Locked');
    expect(schemaLock.templateCoverage).toBe('100%');
  });
}); 