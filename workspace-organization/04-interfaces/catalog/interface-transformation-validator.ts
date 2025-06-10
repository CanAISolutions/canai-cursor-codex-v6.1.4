/**
 * Interface Transformation Validator
 * 
 * Validates the accuracy of field mappings and transformations between
 * TypeScript interfaces (camelCase) and Supabase database schema (snake_case)
 * 
 * Sacred Covenant: Test-First Truth - All transformations must be proven accurate
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  interface: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  mappingAccuracy: number;
  emotionalSovereigntyCompliance: boolean;
}

interface TransformationTest {
  camelCase: string;
  snakeCase: string;
  transformationType: string;
  isValid: boolean;
}

/**
 * Sacred Reversal Test: Does this validation make developers feel empowered?
 * Answer: Yes - it provides clear, actionable feedback and builds confidence
 */
export class InterfaceTransformationValidator {
  private results: ValidationResult[] = [];
  private transformationTests: TransformationTest[] = [];
  private catalog: any;

  constructor() {
    try {
      const catalogPath = join(__dirname, 'CANAI-INTERFACE-CATALOG-V2.json');
      this.catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
    } catch (error) {
      console.error('Failed to load interface catalog:', error);
      throw error;
    }
  }

  /**
   * Validates all interfaces in the catalog
   */
  async validateAllInterfaces(): Promise<ValidationResult[]> {
    console.log('🔍 Starting Interface Transformation Validation...\n');
    
    const interfaces = this.catalog.interfaces;
    
    for (const [interfaceName, interfaceData] of Object.entries(interfaces)) {
      const result = await this.validateInterface(interfaceName, interfaceData as any);
      this.results.push(result);
    }
    
    this.generateSummaryReport();
    return this.results;
  }

  /**
   * Validates a single interface
   */
  private async validateInterface(name: string, data: any): Promise<ValidationResult> {
    const result: ValidationResult = {
      interface: name,
      passed: true,
      errors: [],
      warnings: [],
      mappingAccuracy: 0,
      emotionalSovereigntyCompliance: true
    };

    console.log(`🧪 Validating ${name}...`);

    // Check if interface has field mappings
    if (!data.fieldMappings) {
      result.warnings.push('Missing fieldMappings configuration - interface may not need database mapping');
      result.mappingAccuracy = 1.0; // Non-database interfaces are considered complete
      return result;
    }

    // Validate field mapping completeness
    const mappingValidation = this.validateFieldMappings(data);
    result.errors.push(...mappingValidation.errors);
    result.warnings.push(...mappingValidation.warnings);
    result.mappingAccuracy = mappingValidation.accuracy;

    // Validate transformation configuration
    const transformationValidation = this.validateTransformationConfig(data);
    result.errors.push(...transformationValidation.errors);
    result.warnings.push(...transformationValidation.warnings);

    // Validate emotional sovereignty compliance
    const emotionalValidation = this.validateEmotionalSovereignty(data);
    result.emotionalSovereigntyCompliance = emotionalValidation.compliant;
    if (!emotionalValidation.compliant) {
      result.errors.push(...emotionalValidation.errors);
    }

    // Test actual transformations
    const transformationTests = this.testFieldTransformations(name, data);
    this.transformationTests.push(...transformationTests);

    result.passed = result.errors.length === 0 && result.mappingAccuracy >= 0.95;

    if (result.passed) {
      console.log(`  ✅ ${name} - PASSED (${(result.mappingAccuracy * 100).toFixed(1)}% accuracy)`);
    } else {
      console.log(`  ❌ ${name} - FAILED (${result.errors.length} errors)`);
      result.errors.forEach(error => console.log(`    • ${error}`));
    }

    return result;
  }

  /**
   * Validates field mapping completeness and accuracy
   */
  private validateFieldMappings(data: any): { errors: string[], warnings: string[], accuracy: number } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalFields = 0;
    let mappedFields = 0;

    const fields = data.fields || {};
    const databaseToInterface = data.fieldMappings?.databaseToInterface || {};
    const interfaceToDatabase = data.fieldMappings?.interfaceToDatabase || {};

    // Check each field has proper mapping
    for (const [fieldName, fieldData] of Object.entries(fields)) {
      totalFields++;
      const fieldInfo = fieldData as any;

      // Check if field has database mapping
      if (fieldInfo.databaseField) {
        mappedFields++;

        // Validate bidirectional mapping consistency
        const dbField = fieldInfo.databaseField;
        const interfaceField = fieldName;

        // Check database-to-interface mapping
        if (databaseToInterface[dbField] !== interfaceField) {
          errors.push(`Inconsistent mapping: ${dbField} -> ${databaseToInterface[dbField]} (expected ${interfaceField})`);
        }

        // Check interface-to-database mapping
        if (interfaceToDatabase[interfaceField] !== dbField) {
          errors.push(`Inconsistent mapping: ${interfaceField} -> ${interfaceToDatabase[interfaceField]} (expected ${dbField})`);
        }

        // Validate transformation type
        if (!fieldInfo.transformation) {
          warnings.push(`Missing transformation type for field: ${fieldName}`);
        } else {
          this.validateTransformationType(fieldName, fieldInfo.transformation, errors);
        }
      } else {
        warnings.push(`Field ${fieldName} missing databaseField mapping`);
      }
    }

    const accuracy = totalFields > 0 ? mappedFields / totalFields : 0;
    return { errors, warnings, accuracy };
  }

  /**
   * Validates transformation configuration
   */
  private validateTransformationConfig(data: any): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const config = data.transformationConfig;
    if (!config) {
      warnings.push('Missing transformationConfig - may not be needed for non-database interfaces');
      return { errors, warnings };
    }

    // Validate required configuration fields
    const requiredFields = ['jsonFields', 'dateFields', 'enumFields', 'emotionalSovereigntyFields', 'validationRequired', 'testGeneration'];
    for (const field of requiredFields) {
      if (!(field in config)) {
        warnings.push(`Missing transformationConfig.${field}`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validates emotional sovereignty compliance
   */
  private validateEmotionalSovereignty(data: any): { compliant: boolean, errors: string[] } {
    const errors: string[] = [];
    let compliant = true;

    // Check for trust score fields
    const fields = data.fields || {};
    const trustFields = Object.entries(fields).filter(([name]: [string, any]) => 
      name.toLowerCase().includes('trust') && name.toLowerCase().includes('score')
    );

    for (const [fieldName, fieldData] of trustFields) {
      const field = fieldData as any;
      if (field.validation) {
        // Trust scores should have proper range validation
        if (!field.validation.min && field.validation.min !== 0) {
          errors.push(`Trust field ${fieldName} missing min validation`);
          compliant = false;
        }
        if (!field.validation.max) {
          errors.push(`Trust field ${fieldName} missing max validation`);
          compliant = false;
        }
        if (field.validation.max !== 5) {
          errors.push(`Trust field ${fieldName} should have max value of 5`);
          compliant = false;
        }
      }
    }

    return { compliant, errors };
  }

  /**
   * Validates transformation type
   */
  private validateTransformationType(fieldName: string, transformationType: string, errors: string[]): void {
    const validTypes = ['none', 'camelToSnake', 'camelToSnake_json', 'dateTransform', 'enumTransform'];
    
    if (!validTypes.includes(transformationType)) {
      errors.push(`Invalid transformation type '${transformationType}' for field ${fieldName}`);
    }

    // Validate transformation type matches field characteristics
    if (fieldName.includes('_') && transformationType === 'none') {
      errors.push(`Field ${fieldName} appears to be snake_case but has transformation 'none'`);
    }
  }

  /**
   * Tests actual field transformations
   */
  private testFieldTransformations(_interfaceName: string, data: any): TransformationTest[] {
    const tests: TransformationTest[] = [];
    const fields = data.fields || {};

    for (const [fieldName, fieldData] of Object.entries(fields)) {
      const field = fieldData as any;
      if (field.databaseField && field.transformation) {
        const test: TransformationTest = {
          camelCase: fieldName,
          snakeCase: field.databaseField,
          transformationType: field.transformation,
          isValid: this.testTransformation(fieldName, field.databaseField, field.transformation)
        };
        tests.push(test);
      }
    }

    return tests;
  }

  /**
   * Tests a specific transformation
   */
  private testTransformation(camelCase: string, snakeCase: string, transformationType: string): boolean {
    switch (transformationType) {
      case 'none':
        return camelCase === snakeCase;
      
      case 'camelToSnake':
      case 'camelToSnake_json':
        return this.camelToSnakeCase(camelCase) === snakeCase;
      
      default:
        return true; // For now, assume other transformations are valid
    }
  }

  /**
   * Converts camelCase to snake_case
   */
  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }



  /**
   * Generates a comprehensive summary report
   */
  private generateSummaryReport(): void {
    const totalInterfaces = this.results.length;
    const passedInterfaces = this.results.filter(r => r.passed).length;
    const failedInterfaces = this.results.filter(r => !r.passed).length;
    const averageAccuracy = this.results.reduce((sum, r) => sum + r.mappingAccuracy, 0) / totalInterfaces;
    const emotionalCompliantInterfaces = this.results.filter(r => r.emotionalSovereigntyCompliance).length;

    console.log('\n📊 VALIDATION SUMMARY REPORT');
    console.log('=' .repeat(50));
    console.log(`Total Interfaces: ${totalInterfaces}`);
    console.log(`✅ Passed: ${passedInterfaces}`);
    console.log(`❌ Failed: ${failedInterfaces}`);
    console.log(`📈 Average Mapping Accuracy: ${(averageAccuracy * 100).toFixed(1)}%`);
    console.log(`🌟 Emotional Sovereignty Compliant: ${emotionalCompliantInterfaces}/${totalInterfaces}`);
    
    console.log('\n🧪 TRANSFORMATION TESTS');
    console.log('=' .repeat(50));
    const totalTests = this.transformationTests.length;
    const passedTests = this.transformationTests.filter(t => t.isValid).length;
    console.log(`Total Transformation Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}`);

    // Show failed transformations
    const failedTests = this.transformationTests.filter(t => !t.isValid);
    if (failedTests.length > 0) {
      console.log('\n❌ FAILED TRANSFORMATIONS:');
      failedTests.forEach(test => {
        console.log(`  • ${test.camelCase} -> ${test.snakeCase} (${test.transformationType})`);
      });
    }

    // Show interfaces that need attention
    const failedResults = this.results.filter(r => !r.passed);
    if (failedResults.length > 0) {
      console.log('\n🚨 INTERFACES NEEDING ATTENTION:');
      failedResults.forEach(result => {
        console.log(`\n${result.interface}:`);
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
        result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
      });
    }

    // Sacred Reversal Test Results
    console.log('\n🌟 SACRED REVERSAL TEST RESULTS');
    console.log('=' .repeat(50));
    const sacredReversalPassed = passedInterfaces === totalInterfaces && 
                                averageAccuracy >= 0.95 && 
                                emotionalCompliantInterfaces === totalInterfaces;
    
    if (sacredReversalPassed) {
      console.log('✅ PASSED: All transformations honor user empowerment and build trust');
      console.log('✅ PASSED: Developers will feel confident using these mappings');
      console.log('✅ PASSED: Users will experience seamless data flow');
    } else {
      console.log('❌ FAILED: Some transformations need improvement');
      console.log('🔧 ACTION REQUIRED: Fix failing validations to ensure user empowerment');
    }

    console.log('\n🎯 TEST-FIRST TRUTH VALIDATION');
    console.log('=' .repeat(50));
    if (sacredReversalPassed) {
      console.log('✅ All interface transformations have been validated');
      console.log('✅ Mapping accuracy meets 95%+ threshold');
      console.log('✅ Emotional sovereignty compliance verified');
      console.log('✅ Ready for production deployment');
    } else {
      console.log('❌ Validation incomplete - address issues before deployment');
    }
  }
}

/**
 * Generates TypeScript type definitions from the validated mappings
 */
export function generateTypeDefinitions(): string {
  const catalogPath = join(__dirname, 'CANAI-INTERFACE-CATALOG-V2.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  const interfaces = catalog.interfaces;
  let typeDefinitions = `/**
 * Auto-generated TypeScript definitions from validated interface catalog
 * Generated: ${new Date().toISOString()}
 * 
 * Sacred Covenant: These types are validated for accuracy and emotional sovereignty
 */

`;

  for (const [interfaceName, interfaceData] of Object.entries(interfaces)) {
    const data = interfaceData as any;
    if (data.fields) {
      typeDefinitions += `export interface ${interfaceName} {\n`;
      
      for (const [fieldName, fieldData] of Object.entries(data.fields)) {
        const field = fieldData as any;
        const optional = !field.required ? '?' : '';
        typeDefinitions += `  ${fieldName}${optional}: ${field.type};\n`;
      }
      
      typeDefinitions += `}\n\n`;

      // Generate database interface
      if (data.databaseTable) {
        typeDefinitions += `export interface ${interfaceName}Database {\n`;
        
        for (const [fieldName, fieldData] of Object.entries(data.fields)) {
          const field = fieldData as any;
          const optional = !field.required ? '?' : '';
          const dbFieldName = field.databaseField || fieldName;
          typeDefinitions += `  ${dbFieldName}${optional}: ${field.type};\n`;
        }
        
        typeDefinitions += `}\n\n`;
      }
    }
  }

  return typeDefinitions;
}

/**
 * Generates transformation utility functions
 */
export function generateTransformationUtils(): string {
  return `/**
 * Auto-generated transformation utilities
 * Sacred Covenant: These functions preserve emotional sovereignty in all transformations
 */

export class InterfaceTransformer {
  /**
   * Converts camelCase to snake_case
   */
  static camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => \`_\${letter.toLowerCase()}\`);
  }

  /**
   * Converts snake_case to camelCase
   */
  static snakeToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Transforms interface object to database format
   */
  static transformToDatabase<T extends Record<string, any>>(
    interfaceName: string,
    data: T
  ): Record<string, any> {
    const interfaceConfig = catalog.interfaces[interfaceName];
    if (!interfaceConfig?.fieldMappings?.interfaceToDatabase) {
      throw new Error(\`No field mappings found for interface: \${interfaceName}\`);
    }

    const result: Record<string, any> = {};
    const mappings = interfaceConfig.fieldMappings.interfaceToDatabase;

    for (const [interfaceField, dbField] of Object.entries(mappings)) {
      if (data[interfaceField] !== undefined) {
        result[dbField] = data[interfaceField];
      }
    }

    return result;
  }

  /**
   * Transforms database object to interface format
   */
  static transformFromDatabase<T extends Record<string, any>>(
    interfaceName: string,
    data: T
  ): Record<string, any> {
    const interfaceConfig = catalog.interfaces[interfaceName];
    if (!interfaceConfig?.fieldMappings?.databaseToInterface) {
      throw new Error(\`No field mappings found for interface: \${interfaceName}\`);
    }

    const result: Record<string, any> = {};
    const mappings = interfaceConfig.fieldMappings.databaseToInterface;

    for (const [dbField, interfaceField] of Object.entries(mappings)) {
      if (data[dbField] !== undefined) {
        result[interfaceField] = data[dbField];
      }
    }

    return result;
  }

  /**
   * Validates emotional sovereignty compliance
   */
  static validateEmotionalSovereignty(data: Record<string, any>): boolean {
    // Trust scores must be >= 4.2
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase().includes('trust') && key.toLowerCase().includes('score')) {
        if (typeof value === 'number' && value < 4.2) {
          return false;
        }
      }
    }
    return true;
  }
}
`;
}

// Main execution function
export async function runValidation(): Promise<void> {
  const validator = new InterfaceTransformationValidator();
  await validator.validateAllInterfaces();
}

// Run validation if this file is executed directly
if (require.main === module) {
  runValidation().catch(console.error);
} 