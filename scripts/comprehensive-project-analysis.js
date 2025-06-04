#!/usr/bin/env node

/**
 * Comprehensive Project Analysis Script
 * 
 * Purpose: Understand the COMPLETE CanAI project architecture without bias
 * toward any specific integration (Make.com, Airtable, etc.)
 * 
 * What it analyzes:
 * - All interfaces across the entire codebase
 * - Core business logic and architecture
 * - Product offerings and capabilities
 * - Data flows and integrations
 * - Infrastructure and services
 * - Actual vs. aspirational components
 * 
 * Goal: Provide unbiased, complete picture of what exists
 */

const fs = require('fs');
const path = require('path');

class ComprehensiveProjectAnalyzer {
  constructor() {
    this.interfaces = new Map();
    this.exportedInterfaces = new Map();
    this.fieldInventory = new Set();
    this.fileCount = 0;
    this.interfaceCount = 0;
    this.productComponents = new Map();
    this.serviceComponents = new Map();
    this.infrastructureComponents = new Map();
    this.integrationComponents = new Map();
    
    // Patterns for interface detection
    this.interfacePattern = /(?:export\s+)?interface\s+(\w+)(?:\s*<[^>]*>)?\s*(?:extends\s+[^{]+)?\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs;
    this.fieldPattern = /^\s*(?:readonly\s+)?(\w+)(\?)?:\s*([^;,\n]+)(?:[;,]|$)/gm;
    this.commentPattern = /\/\*\*[\s\S]*?\*\/|\/\/.*$/gm;
    
    // Comprehensive directory scan (everything except noise)
    this.scanDirs = [
      'api',
      'cursor',
      'prompts', 
      'src',
      'types',
      'utils',
      'lib',
      'components',
      'services',
      'infra',
      'schemas',
      'automations',
      'analytics',
      'brand',
      'webflow',
      'stripe',
      'emails'
    ];
    
    // Only exclude actual noise, not functional code
    this.excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.jest-cache',
      'test-results',
      'logs'
    ];

    // Component categories for analysis
    this.componentCategories = {
      products: ['business_plan', 'email_campaign', 'social_content', 'ai_blueprint', 'site_audit', 'reverse_strategy', 'ai_brand_identity', 'profile_makeover', 'blogblitz', 'ad_amplify', 'sparksplit'],
      services: ['emotional-sovereignty', 'spark-split', 'trust-score', 'orchestration', 'webhook', 'validation'],
      infrastructure: ['airtable', 'webflow', 'make', 'stripe', 'render', 'openai', 'claude'],
      integrations: ['make.com', 'airtable', 'webflow', 'stripe', 'email', 'analytics'],
      core: ['emotional', 'trust', 'spark', 'resonance', 'sovereignty', 'intelligence']
    };
  }

  /**
   * Main analysis method - comprehensive project understanding
   */
  async analyzeCompleteProject() {
    console.log('🔍 Starting COMPREHENSIVE project analysis...');
    console.log('🎯 Goal: Understand complete CanAI architecture without bias');
    console.log('📊 Analyzing ALL components, not just Make.com integration');
    
    try {
      // Scan all relevant directories
      for (const dir of this.scanDirs) {
        if (fs.existsSync(dir)) {
          console.log(`📁 Scanning directory: ${dir}`);
          await this.scanDirectory(dir);
        }
      }
      
      // Analyze what we found
      const architectureAnalysis = this.analyzeArchitecture();
      const productAnalysis = this.analyzeProducts();
      const serviceAnalysis = this.analyzeServices();
      const integrationAnalysis = this.analyzeIntegrations();
      const dataFlowAnalysis = this.analyzeDataFlows();
      
      // Generate comprehensive report
      const report = this.generateComprehensiveReport(
        architectureAnalysis,
        productAnalysis, 
        serviceAnalysis,
        integrationAnalysis,
        dataFlowAnalysis
      );
      
      // Write comprehensive results
      this.writeComprehensiveResults(report);
      
      console.log(`✅ Comprehensive analysis complete!`);
      console.log(`📁 Files analyzed: ${this.fileCount}`);
      console.log(`🔧 Interfaces found: ${this.interfaceCount}`);
      console.log(`📋 Unique fields: ${this.fieldInventory.size}`);
      console.log(`🏗️ Architecture components: ${this.infrastructureComponents.size}`);
      console.log(`🎯 Product components: ${this.productComponents.size}`);
      console.log(`⚙️ Service components: ${this.serviceComponents.size}`);
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }

  /**
   * Recursively scan directory for all files
   */
  async scanDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Only skip actual noise
      if (this.excludePatterns.some(pattern => fullPath.includes(pattern))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.isAnalyzableFile(entry.name)) {
        await this.processFile(fullPath);
      }
    }
  }

  /**
   * Check if file should be analyzed
   */
  isAnalyzableFile(filename) {
    return /\.(ts|tsx|js|jsx|json|md)$/.test(filename);
  }

  /**
   * Process individual file for comprehensive analysis
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileCount++;
      
      // Categorize the file
      this.categorizeFile(filePath, content);
      
      // Extract interfaces if it's a code file
      if (/\.(ts|tsx|js|jsx)$/.test(filePath)) {
        await this.extractInterfaces(filePath, content);
      }
      
      // Extract configuration if it's a config file
      if (/\.(json|jsonc)$/.test(filePath)) {
        this.extractConfiguration(filePath, content);
      }
      
    } catch (error) {
      console.warn(`⚠️  Error processing ${filePath}:`, error.message);
    }
  }

  /**
   * Categorize file by its purpose and content
   */
  categorizeFile(filePath, content) {
    const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
    
    // Product components
    this.componentCategories.products.forEach(product => {
      if (normalizedPath.includes(product)) {
        this.productComponents.set(product, {
          path: filePath,
          type: 'product',
          hasInterface: content.includes('interface'),
          hasMCP: content.includes('.mcp.'),
          hasValidation: content.includes('validation'),
          size: content.length
        });
      }
    });
    
    // Service components
    this.componentCategories.services.forEach(service => {
      if (normalizedPath.includes(service)) {
        this.serviceComponents.set(service, {
          path: filePath,
          type: 'service',
          hasInterface: content.includes('interface'),
          hasExports: content.includes('export'),
          hasTests: content.includes('test'),
          size: content.length
        });
      }
    });
    
    // Infrastructure components
    this.componentCategories.infrastructure.forEach(infra => {
      if (normalizedPath.includes(infra)) {
        this.infrastructureComponents.set(infra, {
          path: filePath,
          type: 'infrastructure',
          hasConfig: content.includes('config') || content.includes('Config'),
          hasAPI: content.includes('api') || content.includes('API'),
          hasAuth: content.includes('auth') || content.includes('key'),
          size: content.length
        });
      }
    });
    
    // Integration components
    this.componentCategories.integrations.forEach(integration => {
      if (normalizedPath.includes(integration)) {
        this.integrationComponents.set(integration, {
          path: filePath,
          type: 'integration',
          hasWebhook: content.includes('webhook'),
          hasAPI: content.includes('api'),
          hasAuth: content.includes('auth') || content.includes('key'),
          size: content.length
        });
      }
    });
  }

  /**
   * Extract interfaces from code files
   */
  async extractInterfaces(filePath, content) {
    // Remove comments to avoid false matches
    const cleanContent = content.replace(this.commentPattern, '');
    
    // Extract interfaces
    let match;
    while ((match = this.interfacePattern.exec(cleanContent)) !== null) {
      const [fullMatch, interfaceName, interfaceBody] = match;
      const isExported = fullMatch.startsWith('export');
      
      const interfaceData = {
        name: interfaceName,
        filePath: filePath.replace(/\\/g, '/'),
        isExported,
        fields: this.extractFields(interfaceBody),
        rawDefinition: fullMatch.trim(),
        category: this.categorizeInterface(interfaceName, interfaceBody, filePath),
        businessValue: this.assessBusinessValue(interfaceName, interfaceBody, filePath)
      };
      
      this.interfaces.set(`${filePath}:${interfaceName}`, interfaceData);
      
      if (isExported) {
        this.exportedInterfaces.set(interfaceName, interfaceData);
      }
      
      this.interfaceCount++;
      
      // Add fields to inventory
      interfaceData.fields.forEach(field => {
        this.fieldInventory.add(field.name);
      });
    }
  }

  /**
   * Extract configuration from JSON files
   */
  extractConfiguration(filePath, content) {
    try {
      const config = JSON.parse(content);
      // Store configuration analysis
      // This could be expanded based on what configurations are important
    } catch (error) {
      // Not valid JSON, skip
    }
  }

  /**
   * Categorize interface by business purpose
   */
  categorizeInterface(interfaceName, interfaceBody, filePath) {
    const name = interfaceName.toLowerCase();
    const body = interfaceBody.toLowerCase();
    const path = filePath.toLowerCase();
    
    if (name.includes('emotional') || body.includes('emotional')) return 'emotional-intelligence';
    if (name.includes('spark') || body.includes('spark')) return 'spark-system';
    if (name.includes('trust') || body.includes('trust')) return 'trust-system';
    if (name.includes('webhook') || body.includes('webhook')) return 'integration';
    if (path.includes('prompt')) return 'product';
    if (path.includes('orchestration')) return 'orchestration';
    if (path.includes('service')) return 'service';
    if (path.includes('api')) return 'api';
    if (path.includes('type')) return 'type-definition';
    
    return 'general';
  }

  /**
   * Assess business value of interface
   */
  assessBusinessValue(interfaceName, interfaceBody, filePath) {
    let score = 0;
    
    // Core business interfaces
    if (interfaceName.includes('EmotionalSovereignty')) score += 10;
    if (interfaceName.includes('SparkSplit')) score += 10;
    if (interfaceName.includes('TrustScore')) score += 8;
    
    // Product interfaces
    if (filePath.includes('prompts/')) score += 7;
    if (interfaceName.includes('Input') || interfaceName.includes('Output')) score += 5;
    
    // Integration interfaces
    if (interfaceBody.includes('webhook')) score += 6;
    if (interfaceBody.includes('api')) score += 4;
    
    // Core fields
    if (interfaceBody.includes('sessionId')) score += 3;
    if (interfaceBody.includes('userId')) score += 3;
    if (interfaceBody.includes('trustScore')) score += 5;
    if (interfaceBody.includes('emotionalContext')) score += 5;
    
    return score;
  }

  /**
   * Extract field definitions from interface body
   */
  extractFields(interfaceBody) {
    const fields = [];
    let match;
    
    // Reset regex
    this.fieldPattern.lastIndex = 0;
    
    while ((match = this.fieldPattern.exec(interfaceBody)) !== null) {
      const [, fieldName, optional, fieldType] = match;
      
      fields.push({
        name: fieldName,
        type: fieldType.trim(),
        optional: !!optional,
        required: !optional,
        category: this.categorizeField(fieldName)
      });
    }
    
    return fields;
  }

  /**
   * Categorize field by business purpose
   */
  categorizeField(fieldName) {
    const name = fieldName.toLowerCase();
    
    if (name.includes('session') || name.includes('user') || name.includes('id')) return 'identity';
    if (name.includes('emotional') || name.includes('trust') || name.includes('spark')) return 'emotional-intelligence';
    if (name.includes('webhook') || name.includes('api') || name.includes('data')) return 'integration';
    if (name.includes('timestamp') || name.includes('created') || name.includes('updated')) return 'metadata';
    if (name.includes('score') || name.includes('metric') || name.includes('rating')) return 'analytics';
    if (name.includes('content') || name.includes('text') || name.includes('output')) return 'content';
    
    return 'general';
  }

  /**
   * Analyze overall architecture
   */
  analyzeArchitecture() {
    const interfacesByCategory = {};
    const fieldsByCategory = {};
    
    // Group interfaces by category
    for (const [key, interfaceData] of this.interfaces) {
      const category = interfaceData.category;
      if (!interfacesByCategory[category]) {
        interfacesByCategory[category] = [];
      }
      interfacesByCategory[category].push(interfaceData);
      
      // Group fields by category
      interfaceData.fields.forEach(field => {
        const fieldCategory = field.category;
        if (!fieldsByCategory[fieldCategory]) {
          fieldsByCategory[fieldCategory] = [];
        }
        fieldsByCategory[fieldCategory].push(field.name);
      });
    }
    
    return {
      interfacesByCategory,
      fieldsByCategory,
      totalInterfaces: this.interfaceCount,
      totalFields: this.fieldInventory.size,
      exportedInterfaces: this.exportedInterfaces.size
    };
  }

  /**
   * Analyze product offerings
   */
  analyzeProducts() {
    const products = {};
    
    for (const [productName, productData] of this.productComponents) {
      products[productName] = {
        ...productData,
        completeness: this.assessProductCompleteness(productData),
        interfaces: this.getProductInterfaces(productName)
      };
    }
    
    return {
      totalProducts: this.productComponents.size,
      products,
      completenessScore: this.calculateAverageCompleteness(products)
    };
  }

  /**
   * Analyze services
   */
  analyzeServices() {
    const services = {};
    
    for (const [serviceName, serviceData] of this.serviceComponents) {
      services[serviceName] = {
        ...serviceData,
        maturity: this.assessServiceMaturity(serviceData),
        interfaces: this.getServiceInterfaces(serviceName)
      };
    }
    
    return {
      totalServices: this.serviceComponents.size,
      services,
      maturityScore: this.calculateAverageMaturity(services)
    };
  }

  /**
   * Analyze integrations
   */
  analyzeIntegrations() {
    const integrations = {};
    
    for (const [integrationName, integrationData] of this.integrationComponents) {
      integrations[integrationName] = {
        ...integrationData,
        readiness: this.assessIntegrationReadiness(integrationData),
        interfaces: this.getIntegrationInterfaces(integrationName)
      };
    }
    
    return {
      totalIntegrations: this.integrationComponents.size,
      integrations,
      readinessScore: this.calculateAverageReadiness(integrations)
    };
  }

  /**
   * Analyze data flows
   */
  analyzeDataFlows() {
    const flows = {};
    const coreFields = ['sessionId', 'userId', 'emotionalContext', 'sparkResonance', 'trustScore'];
    
    // Analyze how core fields flow through the system
    coreFields.forEach(field => {
      flows[field] = this.traceFieldFlow(field);
    });
    
    return {
      coreDataFlows: flows,
      fieldCoverage: this.calculateFieldCoverage(),
      dataConsistency: this.assessDataConsistency()
    };
  }

  /**
   * Helper methods for analysis
   */
  assessProductCompleteness(productData) {
    let score = 0;
    if (productData.hasInterface) score += 25;
    if (productData.hasMCP) score += 25;
    if (productData.hasValidation) score += 25;
    if (productData.size > 1000) score += 25; // Has substantial content
    return score;
  }

  assessServiceMaturity(serviceData) {
    let score = 0;
    if (serviceData.hasInterface) score += 30;
    if (serviceData.hasExports) score += 30;
    if (serviceData.hasTests) score += 40;
    return score;
  }

  assessIntegrationReadiness(integrationData) {
    let score = 0;
    if (integrationData.hasWebhook) score += 35;
    if (integrationData.hasAPI) score += 35;
    if (integrationData.hasAuth) score += 30;
    return score;
  }

  getProductInterfaces(productName) {
    return Array.from(this.interfaces.values())
      .filter(iface => iface.filePath.toLowerCase().includes(productName))
      .map(iface => iface.name);
  }

  getServiceInterfaces(serviceName) {
    return Array.from(this.interfaces.values())
      .filter(iface => iface.filePath.toLowerCase().includes(serviceName))
      .map(iface => iface.name);
  }

  getIntegrationInterfaces(integrationName) {
    return Array.from(this.interfaces.values())
      .filter(iface => iface.filePath.toLowerCase().includes(integrationName))
      .map(iface => iface.name);
  }

  calculateAverageCompleteness(products) {
    const scores = Object.values(products).map(p => p.completeness);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  calculateAverageMaturity(services) {
    const scores = Object.values(services).map(s => s.maturity);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  calculateAverageReadiness(integrations) {
    const scores = Object.values(integrations).map(i => i.readiness);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  traceFieldFlow(fieldName) {
    const interfaces = Array.from(this.interfaces.values())
      .filter(iface => iface.fields.some(field => field.name === fieldName));
    
    return {
      fieldName,
      usageCount: interfaces.length,
      interfaces: interfaces.map(iface => ({
        name: iface.name,
        filePath: iface.filePath,
        category: iface.category
      }))
    };
  }

  calculateFieldCoverage() {
    const totalFields = this.fieldInventory.size;
    const categorizedFields = Array.from(this.fieldInventory)
      .map(field => this.categorizeField(field));
    
    const categories = {};
    categorizedFields.forEach(category => {
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
      totalFields,
      categories,
      coverage: Object.keys(categories).length / 7 // 7 main categories
    };
  }

  assessDataConsistency() {
    // Check for consistent field naming and types across interfaces
    const fieldTypes = {};
    
    for (const [key, interfaceData] of this.interfaces) {
      interfaceData.fields.forEach(field => {
        if (!fieldTypes[field.name]) {
          fieldTypes[field.name] = new Set();
        }
        fieldTypes[field.name].add(field.type);
      });
    }
    
    const inconsistentFields = Object.entries(fieldTypes)
      .filter(([fieldName, types]) => types.size > 1)
      .map(([fieldName, types]) => ({
        fieldName,
        types: Array.from(types)
      }));
    
    return {
      totalUniqueFields: Object.keys(fieldTypes).length,
      inconsistentFields,
      consistencyScore: (Object.keys(fieldTypes).length - inconsistentFields.length) / Object.keys(fieldTypes).length
    };
  }

  /**
   * Generate comprehensive report
   */
  generateComprehensiveReport(architecture, products, services, integrations, dataFlows) {
    return {
      summary: {
        projectName: 'CanAI Emotional Sovereignty Platform',
        analysisTimestamp: new Date().toISOString(),
        totalFiles: this.fileCount,
        totalInterfaces: this.interfaceCount,
        totalFields: this.fieldInventory.size,
        exportedInterfaces: this.exportedInterfaces.size
      },
      architecture,
      products,
      services,
      integrations,
      dataFlows,
      topInterfaces: this.getTopInterfaces(),
      criticalFields: this.getCriticalFields(),
      recommendations: this.generateRecommendations(architecture, products, services, integrations, dataFlows)
    };
  }

  getTopInterfaces() {
    return Array.from(this.interfaces.values())
      .sort((a, b) => b.businessValue - a.businessValue)
      .slice(0, 20)
      .map(iface => ({
        name: iface.name,
        filePath: iface.filePath,
        category: iface.category,
        businessValue: iface.businessValue,
        fieldCount: iface.fields.length,
        isExported: iface.isExported
      }));
  }

  getCriticalFields() {
    const fieldFrequency = {};
    
    for (const [key, interfaceData] of this.interfaces) {
      interfaceData.fields.forEach(field => {
        fieldFrequency[field.name] = (fieldFrequency[field.name] || 0) + 1;
      });
    }
    
    return Object.entries(fieldFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 30)
      .map(([fieldName, frequency]) => ({
        fieldName,
        frequency,
        category: this.categorizeField(fieldName)
      }));
  }

  generateRecommendations(architecture, products, services, integrations, dataFlows) {
    const recommendations = [];
    
    // Product recommendations
    if (products.completenessScore < 75) {
      recommendations.push({
        type: 'product',
        priority: 'high',
        message: `Product completeness is ${products.completenessScore.toFixed(1)}%. Focus on adding MCP files and validation.`
      });
    }
    
    // Service recommendations
    if (services.maturityScore < 70) {
      recommendations.push({
        type: 'service',
        priority: 'high',
        message: `Service maturity is ${services.maturityScore.toFixed(1)}%. Add tests and proper exports.`
      });
    }
    
    // Integration recommendations
    if (integrations.readinessScore < 80) {
      recommendations.push({
        type: 'integration',
        priority: 'medium',
        message: `Integration readiness is ${integrations.readinessScore.toFixed(1)}%. Complete webhook and API implementations.`
      });
    }
    
    // Data consistency recommendations
    if (dataFlows && dataFlows.dataConsistency && dataFlows.dataConsistency.consistencyScore < 0.9) {
      recommendations.push({
        type: 'data',
        priority: 'high',
        message: `Data consistency is ${(dataFlows.dataConsistency.consistencyScore * 100).toFixed(1)}%. Standardize field types across interfaces.`
      });
    }
    
    return recommendations;
  }

  /**
   * Write comprehensive results to files
   */
  writeComprehensiveResults(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Write comprehensive report
    fs.writeFileSync(
      `comprehensive-project-analysis-${timestamp}.json`,
      JSON.stringify(report, null, 2)
    );
    
    // Write executive summary
    const summary = this.generateExecutiveSummary(report);
    fs.writeFileSync(
      `project-executive-summary-${timestamp}.md`,
      summary
    );
    
    // Write field inventory
    fs.writeFileSync(
      `complete-field-inventory-${timestamp}.txt`,
      Array.from(this.fieldInventory).sort().join('\n')
    );
    
    // Write interface catalog
    const interfaceCatalog = this.generateInterfaceCatalog();
    fs.writeFileSync(
      `interface-catalog-${timestamp}.json`,
      JSON.stringify(interfaceCatalog, null, 2)
    );
    
    console.log(`📄 Comprehensive analysis written:`);
    console.log(`   - comprehensive-project-analysis-${timestamp}.json`);
    console.log(`   - project-executive-summary-${timestamp}.md`);
    console.log(`   - complete-field-inventory-${timestamp}.txt`);
    console.log(`   - interface-catalog-${timestamp}.json`);
  }

  generateExecutiveSummary(report) {
    return `# CanAI Project Executive Summary

## Overview
- **Total Files Analyzed**: ${report.summary.totalFiles}
- **Total Interfaces**: ${report.summary.totalInterfaces}
- **Total Fields**: ${report.summary.totalFields}
- **Exported Interfaces**: ${report.summary.exportedInterfaces}

## Product Portfolio
- **Total Products**: ${report.products.totalProducts}
- **Average Completeness**: ${report.products.completenessScore.toFixed(1)}%

## Service Architecture
- **Total Services**: ${report.services.totalServices}
- **Average Maturity**: ${report.services.maturityScore.toFixed(1)}%

## Integration Ecosystem
- **Total Integrations**: ${report.integrations.totalIntegrations}
- **Average Readiness**: ${report.integrations.readinessScore.toFixed(1)}%

## Data Architecture
- **Field Coverage**: ${(report.dataFlows.fieldCoverage.coverage * 100).toFixed(1)}%
- **Data Consistency**: ${(report.dataFlows.dataConsistency.consistencyScore * 100).toFixed(1)}%

## Top Business-Critical Interfaces
${report.topInterfaces.slice(0, 10).map((iface, index) => 
  `${index + 1}. **${iface.name}** (${iface.category}) - Value: ${iface.businessValue}`
).join('\n')}

## Critical Fields
${report.criticalFields.slice(0, 15).map((field, index) => 
  `${index + 1}. **${field.fieldName}** (${field.category}) - Used ${field.frequency} times`
).join('\n')}

## Recommendations
${report.recommendations.map(rec => 
  `- **${rec.type.toUpperCase()}** (${rec.priority}): ${rec.message}`
).join('\n')}

## Analysis Date
${report.summary.analysisTimestamp}
`;
  }

  generateInterfaceCatalog() {
    const catalog = {};
    
    for (const [key, interfaceData] of this.interfaces) {
      catalog[interfaceData.name] = {
        filePath: interfaceData.filePath,
        category: interfaceData.category,
        businessValue: interfaceData.businessValue,
        isExported: interfaceData.isExported,
        fieldCount: interfaceData.fields.length,
        fields: interfaceData.fields.map(field => ({
          name: field.name,
          type: field.type,
          required: field.required,
          category: field.category
        }))
      };
    }
    
    return catalog;
  }
}

// Run the comprehensive analysis
if (require.main === module) {
  const analyzer = new ComprehensiveProjectAnalyzer();
  analyzer.analyzeCompleteProject().catch(console.error);
}

module.exports = ComprehensiveProjectAnalyzer; 