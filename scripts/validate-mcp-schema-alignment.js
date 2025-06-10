#!/usr/bin/env node

/**
 * MCP Schema Alignment Validator
 * Validates that MCP field mappings align with Supabase schema
 * and CANAI-INTERFACE-CATALOG-V2.json requirements
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  interfaceCatalogPath: './CANAI-DEFINITIVE-INTERFACE-CATALOG-2025-CLEANED.json',
  mcpDirectory: './prompts',
  supabaseSchemaPath: './supabase/schema',
  trustScoreThreshold: 4.2,
  emotionalScoreThreshold: 0.85
};

class MCPSchemaValidator {
  constructor() {
    this.interfaceCatalog = null;
    this.mcpFiles = [];
    this.validationResults = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async validate() {
    console.log('🔍 Starting MCP Schema Alignment Validation...\n');
    
    try {
      // Load interface catalog
      await this.loadInterfaceCatalog();
      
      // Find all MCP files
      await this.discoverMCPFiles();
      
      // Validate each MCP
      for (const mcpFile of this.mcpFiles) {
        await this.validateMCPFile(mcpFile);
      }
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  }

  async loadInterfaceCatalog() {
    try {
      const catalogData = fs.readFileSync(CONFIG.interfaceCatalogPath, 'utf8');
      this.interfaceCatalog = JSON.parse(catalogData);
      console.log(`✅ Loaded interface catalog v${this.interfaceCatalog.version}`);
    } catch (error) {
      throw new Error(`Failed to load interface catalog: ${error.message}`);
    }
  }

  async discoverMCPFiles() {
    try {
      const mcpPattern = /\.mcp\.ts$/;
      const files = fs.readdirSync(CONFIG.mcpDirectory)
        .filter(file => mcpPattern.test(file))
        .map(file => path.join(CONFIG.mcpDirectory, file));
      
      this.mcpFiles = files;
      console.log(`📁 Found ${files.length} MCP files to validate\n`);
    } catch (error) {
      console.log(`⚠️  MCP directory not found, creating file list manually`);
      this.mcpFiles = [
        './gpt-templates/business-plan.mcp.ts',
        './gpt-templates/email_campaign.mcp.ts',
        './gpt-templates/sparksplit.mcp.ts',
        './gpt-templates/ad_amplify.mcp.ts',
        './gpt-templates/social_content.mcp.ts',
        './gpt-templates/ai_blueprint.mcp.ts'
      ].filter(file => fs.existsSync(file));
    }
  }

  async validateMCPFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`🔍 Validating ${fileName}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const validation = {
        file: fileName,
        checks: {},
        errors: [],
        warnings: []
      };

      // Check 1: Trust score threshold validation
      validation.checks.trustScoreValidation = this.validateTrustScores(content);
      
      // Check 2: Emotional sovereignty compliance
      validation.checks.emotionalSovereignty = this.validateEmotionalSovereignty(content);
      
      // Check 3: Field mapping consistency
      validation.checks.fieldMapping = this.validateFieldMapping(content, fileName);
      
      // Check 4: Interface catalog alignment
      validation.checks.catalogAlignment = this.validateCatalogAlignment(content, fileName);
      
      // Check 5: Schema validation implementation
      validation.checks.schemaValidation = this.validateSchemaImplementation(content);

      // Determine overall result
      const hasErrors = Object.values(validation.checks).some(check => !check.passed);
      
      if (hasErrors) {
        this.validationResults.failed.push(validation);
        console.log(`❌ ${fileName} - FAILED`);
      } else {
        this.validationResults.passed.push(validation);
        console.log(`✅ ${fileName} - PASSED`);
      }

    } catch (error) {
      console.log(`❌ ${fileName} - ERROR: ${error.message}`);
      this.validationResults.failed.push({
        file: fileName,
        error: error.message
      });
    }
    
    console.log(''); // Add spacing
  }

  validateTrustScores(content) {
    const trustThresholdPattern = new RegExp(`trustScore.*[>=].*${CONFIG.trustScoreThreshold}`, 'i');
    const hasTrustValidation = trustThresholdPattern.test(content);
    
    return {
      passed: hasTrustValidation,
      message: hasTrustValidation 
        ? 'Trust score validation found' 
        : `Missing trust score threshold (${CONFIG.trustScoreThreshold}+)`
    };
  }

  validateEmotionalSovereignty(content) {
    const emotionalPatterns = [
      /Sacred.*Reversal.*Test/i,
      /emotional.*sovereignty/i,
      /empowerment.*validation/i,
      /trust.*transparency/i
    ];
    
    const foundPatterns = emotionalPatterns.filter(pattern => pattern.test(content));
    const passed = foundPatterns.length >= 2;
    
    return {
      passed,
      message: passed 
        ? `Found ${foundPatterns.length}/4 emotional sovereignty patterns`
        : `Missing emotional sovereignty patterns (found ${foundPatterns.length}/4)`
    };
  }

  validateFieldMapping(content, fileName) {
    const fieldMappingPatterns = [
      /camelCase/i,
      /snake_case/i,
      /field.*mapping/i,
      /inference/i
    ];
    
    const foundPatterns = fieldMappingPatterns.filter(pattern => pattern.test(content));
    const passed = foundPatterns.length >= 2;
    
    return {
      passed,
      message: passed 
        ? 'Field mapping implementation found'
        : 'Missing or incomplete field mapping'
    };
  }

  validateCatalogAlignment(content, fileName) {
    const productName = fileName.replace('.mcp.ts', '');
    
    if (!this.interfaceCatalog?.interfaces) {
      return {
        passed: false,
        message: 'Interface catalog not loaded or invalid'
      };
    }

    const catalogInterface = this.interfaceCatalog.interfaces.find(
      iface => iface.name.toLowerCase().includes(productName.toLowerCase())
    );
    
    if (!catalogInterface) {
      return {
        passed: false,
        message: `No matching interface found in catalog for ${productName}`
      };
    }

    // Check if MCP implements required fields from catalog
    const requiredFields = catalogInterface.fields || [];
    const missingFields = requiredFields.filter(field => 
      !content.includes(field.name) && !content.includes(field.mappedName || field.name)
    );

    return {
      passed: missingFields.length === 0,
      message: missingFields.length === 0 
        ? 'All catalog fields implemented'
        : `Missing fields: ${missingFields.map(f => f.name).join(', ')}`
    };
  }

  validateSchemaImplementation(content) {
    const schemaPatterns = [
      /SchemaValidator/,
      /validation.*schema/i,
      /validateInput/i,
      /error.*handling/i
    ];
    
    const foundPatterns = schemaPatterns.filter(pattern => pattern.test(content));
    const passed = foundPatterns.length >= 2;
    
    return {
      passed,
      message: passed 
        ? 'Schema validation implementation found'
        : 'Missing or incomplete schema validation'
    };
  }

  generateReport() {
    console.log('\n📊 VALIDATION REPORT');
    console.log('='.repeat(50));
    
    console.log(`✅ Passed: ${this.validationResults.passed.length}`);
    console.log(`❌ Failed: ${this.validationResults.failed.length}`);
    console.log(`⚠️  Warnings: ${this.validationResults.warnings.length}\n`);

    if (this.validationResults.failed.length > 0) {
      console.log('❌ FAILED VALIDATIONS:');
      this.validationResults.failed.forEach(result => {
        console.log(`\n📄 ${result.file}:`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        } else {
          Object.entries(result.checks).forEach(([check, details]) => {
            if (!details.passed) {
              console.log(`   ${check}: ${details.message}`);
            }
          });
        }
      });
    }

    // Save detailed report
    const reportPath = './validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: this.mcpFiles.length,
        passed: this.validationResults.passed.length,
        failed: this.validationResults.failed.length
      },
      results: this.validationResults
    }, null, 2));

    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    
    // Exit with error code if any validations failed
    if (this.validationResults.failed.length > 0) {
      console.log('\n❌ Validation completed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ All validations passed successfully');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MCPSchemaValidator();
  validator.validate().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = { MCPSchemaValidator };
