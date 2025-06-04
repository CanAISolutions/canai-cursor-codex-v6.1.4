/**
 * real-field-mapper.ts
 * 
 * Maps interface fields to database columns with appropriate transformations
 * 
 * Part of the Truth-Based Integration System
 */

import { InterfaceField } from './real-interface-catalog-loader';
import { ColumnSchema } from './real-supabase-schema-loader';

/**
 * Defines a validation rule for a field
 */
export interface ValidationRule {
  type: string;
  message: string;
  min?: number;
  max?: number;
  values?: string[];
  pattern?: string;
}

/**
 * Defines a mapping between an interface field and a database column
 */
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  sourceType: string;
  targetType: string;
  transformation: string;
  required: boolean;
  validation: ValidationRule[];
  emotionalImpact?: 'positive' | 'neutral' | 'requires_validation';
}

/**
 * Maps interface fields to database columns with appropriate transformations
 */
export class FieldMapper {
  /**
   * Maps interface fields to database columns
   * 
   * @param interfaceFields Interface fields to map
   * @param tableColumns Database columns to map to
   * @returns Array of field mappings
   */
  mapInterfaceToTable(
    interfaceFields: Record<string, InterfaceField>,
    tableColumns: Record<string, ColumnSchema>
  ): FieldMapping[] {
    const mappings: FieldMapping[] = [];
    
    // Real mapping logic with predefined mapping rules
    const fieldMappingRules: Record<string, string> = {
      // Interface → Table mappings (common fields)
      'recordId': 'id',
      'sessionId': 'session_id', 
      'userId': 'user_id',
      'promptType': 'prompt_type',
      'outputContent': 'output_content',
      'trustScore': 'trust_score',
      'resonanceScore': 'resonance_score',
      'emotionalFingerprint': 'emotional_fingerprint',
      'aweScore': 'awe_score',
      'ownershipScore': 'ownership_score',
      'wonderScore': 'wonder_score',
      'calmScore': 'calm_score',
      'powerScore': 'power_score',
      'timestamp': 'timestamp',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };

    for (const [interfaceField, field] of Object.entries(interfaceFields)) {
      // Determine target field name (either from rules or convert to snake_case)
      const targetField = fieldMappingRules[interfaceField] || this.camelToSnake(interfaceField);
      
      // Determine target column type or default to jsonb if not found
      const targetColumn = tableColumns[targetField];
      const targetType = targetColumn?.type || 'jsonb';
      
      // Create the field mapping
      mappings.push({
        sourceField: interfaceField,
        targetField: targetField,
        sourceType: field.type,
        targetType: targetType,
        transformation: this.determineTransformation(field.type, targetType),
        required: field.required,
        validation: this.generateValidation(field),
        emotionalImpact: this.determineEmotionalImpact(interfaceField, field)
      });
    }

    return mappings;
  }

  /**
   * Converts a camelCase string to snake_case
   * 
   * @param str String to convert
   * @returns The snake_case version
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Determines the transformation to apply when mapping field types
   * 
   * @param sourceType The source field type
   * @param targetType The target column type
   * @returns The transformation type
   */
  private determineTransformation(sourceType: string, targetType: string): string {
    // Direct mapping for identical types
    if (sourceType === targetType) return 'direct';
    
    // Handle objects to JSON
    if (sourceType.includes('object') && ['jsonb', 'json'].includes(targetType)) return 'serialize';
    
    // Handle arrays
    if (sourceType.includes('[]') && targetType === 'array') return 'array_cast';
    
    // Handle booleans
    if (sourceType === 'boolean' && targetType === 'boolean') return 'direct';
    
    // Handle numbers
    if (sourceType === 'number' && ['numeric', 'integer', 'decimal'].includes(targetType)) return 'direct';
    
    // Handle strings
    if (sourceType === 'string' && ['varchar', 'text', 'character varying'].includes(targetType)) return 'direct';
    
    // Handle nullables
    if (sourceType.includes('null') && targetType.includes('null')) return 'direct';
    
    // Handle timestamps
    if (sourceType === 'string' && ['timestamp', 'timestamptz'].includes(targetType)) return 'timestamp';
    
    // Default to custom transformation
    return 'custom';
  }

  /**
   * Generates validation rules for a field
   * 
   * @param field The interface field
   * @returns Array of validation rules
   */
  private generateValidation(field: InterfaceField): ValidationRule[] {
    const rules: ValidationRule[] = [];
    
    // Add required rule if needed
    if (field.required) {
      rules.push({ 
        type: 'required', 
        message: `${field.description} is required` 
      });
    }
    
    // Add range rule if needed
    if (field.range) {
      rules.push({ 
        type: 'range', 
        min: field.range[0], 
        max: field.range[1],
        message: `Value must be between ${field.range[0]} and ${field.range[1]}`
      });
    }
    
    // Add enum rule if needed
    if (field.enum) {
      rules.push({
        type: 'enum',
        values: field.enum,
        message: `Value must be one of: ${field.enum.join(', ')}`
      });
    }
    
    // Add specific validations based on type
    if (field.type === 'string') {
      // Email pattern for email fields
      if (field.description.toLowerCase().includes('email')) {
        rules.push({
          type: 'pattern',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          message: 'Must be a valid email address'
        });
      }
      
      // URL pattern for URL fields
      if (field.description.toLowerCase().includes('url') || 
          field.description.toLowerCase().includes('website')) {
        rules.push({
          type: 'pattern',
          pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
          message: 'Must be a valid URL'
        });
      }
    }
    
    return rules;
  }

  /**
   * Determines the emotional impact of a field
   * 
   * @param fieldName The field name
   * @param field The interface field
   * @returns The emotional impact assessment
   */
  private determineEmotionalImpact(fieldName: string, field: InterfaceField): 'positive' | 'neutral' | 'requires_validation' {
    // Fields related to trust and emotional sovereignty require validation
    const requiresValidationPatterns = [
      'trust', 'emotional', 'sovereignty', 'empowerment', 'sacred', 'awe', 
      'ownership', 'wonder', 'calm', 'power'
    ];
    
    for (const pattern of requiresValidationPatterns) {
      if (fieldName.toLowerCase().includes(pattern)) {
        return 'requires_validation';
      }
    }
    
    // Fields that contribute positively to the user experience
    const positivePatterns = [
      'output', 'content', 'result', 'success', 'goal', 'achievement', 
      'improvement', 'progress', 'benefit'
    ];
    
    for (const pattern of positivePatterns) {
      if (fieldName.toLowerCase().includes(pattern)) {
        return 'positive';
      }
    }
    
    // Default to neutral
    return 'neutral';
  }
} 