#!/usr/bin/env node

/**
 * Technical Blueprint Generator
 * 
 * Purpose: Create comprehensive technical documentation mapping every:
 * - Code path and execution flow
 * - Interface definition and usage
 * - Input/output relationships
 * - Data transformations
 * - Integration points
 * 
 * Goal: Complete technical understanding of the CanAI system
 */

const fs = require('fs');
const path = require('path');

class TechnicalBlueprintGenerator {
  constructor() {
    this.interfaces = new Map();
    this.functions = new Map();
    this.classes = new Map();
    this.exports = new Map();
    this.imports = new Map();
    this.codePaths = new Map();
    this.dataFlows = new Map();
    this.apiEndpoints = new Map();
    this.webhooks = new Map();
    this.fileCount = 0;
    
    // Enhanced patterns for comprehensive analysis
    this.interfacePattern = /(?:export\s+)?interface\s+(\w+)(?:\s*<[^>]*>)?\s*(?:extends\s+[^{]+)?\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs;
    this.functionPattern = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g;
    this.classPattern = /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?\s*\{/g;
    this.methodPattern = /(?:public\s+|private\s+|protected\s+)?(?:async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g;
    this.exportPattern = /export\s+(?:\{([^}]+)\}|(?:default\s+)?(\w+)|(?:const|let|var)\s+(\w+))/g;
    this.importPattern = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    this.apiPattern = /(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g;
    this.webhookPattern = /webhook|hook\.us1\.make\.com|https:\/\/hook/gi;
    this.fieldPattern = /^\s*(?:readonly\s+)?(\w+)(\?)?:\s*([^;,\n]+)(?:[;,]|$)/gm;
    this.commentPattern = /\/\*\*[\s\S]*?\*\/|\/\/.*$/gm;
    
    // Directories to analyze
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
      'webflow',
      'stripe',
      'emails'
    ];
    
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
  }

  /**
   * Generate comprehensive technical blueprint
   */
  async generateTechnicalBlueprint() {
    console.log('🔍 Generating COMPREHENSIVE Technical Blueprint...');
    console.log('📋 Mapping every code path, interface, and output...');
    
    try {
      // Scan all files for technical components
      for (const dir of this.scanDirs) {
        if (fs.existsSync(dir)) {
          console.log(`📁 Analyzing directory: ${dir}`);
          await this.scanDirectory(dir);
        }
      }
      
      // Analyze relationships and flows
      console.log('🔗 Analyzing relationships and data flows...');
      this.analyzeRelationships();
      this.traceDataFlows();
      this.mapCodePaths();
      
      // Generate comprehensive documentation
      const blueprint = this.generateBlueprint();
      
      // Write technical documentation
      this.writeTechnicalDocumentation(blueprint);
      
      console.log(`✅ Technical blueprint complete!`);
      console.log(`📁 Files analyzed: ${this.fileCount}`);
      console.log(`🔧 Interfaces: ${this.interfaces.size}`);
      console.log(`⚙️ Functions: ${this.functions.size}`);
      console.log(`🏗️ Classes: ${this.classes.size}`);
      console.log(`🌐 API Endpoints: ${this.apiEndpoints.size}`);
      console.log(`🔗 Webhooks: ${this.webhooks.size}`);
      
    } catch (error) {
      console.error('❌ Blueprint generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Recursively scan directory for technical components
   */
  async scanDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (this.excludePatterns.some(pattern => fullPath.includes(pattern))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.isCodeFile(entry.name)) {
        await this.analyzeFile(fullPath);
      }
    }
  }

  /**
   * Check if file contains code to analyze
   */
  isCodeFile(filename) {
    return /\.(ts|tsx|js|jsx)$/.test(filename);
  }

  /**
   * Comprehensive file analysis
   */
  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileCount++;
      
      const normalizedPath = filePath.replace(/\\/g, '/');
      console.log(`  📄 Analyzing: ${normalizedPath}`);
      
      // Remove comments for cleaner analysis
      const cleanContent = content.replace(this.commentPattern, '');
      
      // Extract all technical components
      this.extractInterfaces(normalizedPath, cleanContent);
      this.extractFunctions(normalizedPath, cleanContent);
      this.extractClasses(normalizedPath, cleanContent);
      this.extractExports(normalizedPath, cleanContent);
      this.extractImports(normalizedPath, cleanContent);
      this.extractApiEndpoints(normalizedPath, cleanContent);
      this.extractWebhooks(normalizedPath, cleanContent);
      
    } catch (error) {
      console.warn(`⚠️  Error analyzing ${filePath}:`, error.message);
    }
  }

  /**
   * Extract interface definitions with detailed field analysis
   */
  extractInterfaces(filePath, content) {
    let match;
    this.interfacePattern.lastIndex = 0;
    
    while ((match = this.interfacePattern.exec(content)) !== null) {
      const [fullMatch, interfaceName, interfaceBody] = match;
      const isExported = fullMatch.startsWith('export');
      
      const fields = this.extractInterfaceFields(interfaceBody);
      
      const interfaceData = {
        name: interfaceName,
        filePath,
        isExported,
        fields,
        rawDefinition: fullMatch.trim(),
        usageContext: this.determineUsageContext(interfaceName, interfaceBody, filePath),
        relationships: this.findInterfaceRelationships(interfaceBody),
        businessPurpose: this.determineBusinessPurpose(interfaceName, interfaceBody, filePath)
      };
      
      this.interfaces.set(`${filePath}:${interfaceName}`, interfaceData);
    }
  }

  /**
   * Extract function definitions with parameter and return type analysis
   */
  extractFunctions(filePath, content) {
    let match;
    this.functionPattern.lastIndex = 0;
    
    while ((match = this.functionPattern.exec(content)) !== null) {
      const [fullMatch, functionName, parameters, returnType] = match;
      const isExported = fullMatch.includes('export');
      const isAsync = fullMatch.includes('async');
      
      const functionData = {
        name: functionName,
        filePath,
        isExported,
        isAsync,
        parameters: this.parseParameters(parameters),
        returnType: returnType ? returnType.trim() : 'void',
        rawDefinition: fullMatch.trim(),
        purpose: this.determineFunctionPurpose(functionName, filePath),
        codeFlow: this.traceFunctionFlow(functionName, content)
      };
      
      this.functions.set(`${filePath}:${functionName}`, functionData);
    }
  }

  /**
   * Extract class definitions with method analysis
   */
  extractClasses(filePath, content) {
    let match;
    this.classPattern.lastIndex = 0;
    
    while ((match = this.classPattern.exec(content)) !== null) {
      const [fullMatch, className] = match;
      const isExported = fullMatch.includes('export');
      
      // Extract methods from this class
      const methods = this.extractClassMethods(className, content);
      
      const classData = {
        name: className,
        filePath,
        isExported,
        methods,
        rawDefinition: fullMatch.trim(),
        purpose: this.determineClassPurpose(className, filePath),
        architecture: this.analyzeClassArchitecture(className, content)
      };
      
      this.classes.set(`${filePath}:${className}`, classData);
    }
  }

  /**
   * Extract exports for dependency mapping
   */
  extractExports(filePath, content) {
    let match;
    this.exportPattern.lastIndex = 0;
    
    while ((match = this.exportPattern.exec(content)) !== null) {
      const [, namedExports, defaultExport, constExport] = match;
      
      if (namedExports) {
        namedExports.split(',').forEach(exp => {
          const exportName = exp.trim();
          this.exports.set(`${filePath}:${exportName}`, {
            name: exportName,
            filePath,
            type: 'named',
            rawDefinition: match[0]
          });
        });
      }
      
      if (defaultExport) {
        this.exports.set(`${filePath}:default`, {
          name: defaultExport,
          filePath,
          type: 'default',
          rawDefinition: match[0]
        });
      }
      
      if (constExport) {
        this.exports.set(`${filePath}:${constExport}`, {
          name: constExport,
          filePath,
          type: 'const',
          rawDefinition: match[0]
        });
      }
    }
  }

  /**
   * Extract imports for dependency mapping
   */
  extractImports(filePath, content) {
    let match;
    this.importPattern.lastIndex = 0;
    
    while ((match = this.importPattern.exec(content)) !== null) {
      const [, namedImports, defaultImport, source] = match;
      
      const importData = {
        filePath,
        source,
        namedImports: namedImports ? namedImports.split(',').map(imp => imp.trim()) : [],
        defaultImport: defaultImport || null,
        rawDefinition: match[0]
      };
      
      this.imports.set(`${filePath}:${source}`, importData);
    }
  }

  /**
   * Extract API endpoints
   */
  extractApiEndpoints(filePath, content) {
    let match;
    this.apiPattern.lastIndex = 0;
    
    while ((match = this.apiPattern.exec(content)) !== null) {
      const [fullMatch, endpoint] = match;
      const method = fullMatch.match(/\.(get|post|put|delete|patch)/)?.[1]?.toUpperCase() || 'UNKNOWN';
      
      const endpointData = {
        path: endpoint,
        method,
        filePath,
        rawDefinition: fullMatch,
        purpose: this.determineEndpointPurpose(endpoint, filePath),
        inputInterface: this.findEndpointInputInterface(endpoint, content),
        outputInterface: this.findEndpointOutputInterface(endpoint, content)
      };
      
      this.apiEndpoints.set(`${method}:${endpoint}`, endpointData);
    }
  }

  /**
   * Extract webhook references
   */
  extractWebhooks(filePath, content) {
    const webhookMatches = content.match(this.webhookPattern);
    if (webhookMatches) {
      webhookMatches.forEach((match, index) => {
        const webhookData = {
          reference: match,
          filePath,
          context: this.getWebhookContext(match, content),
          purpose: this.determineWebhookPurpose(match, filePath)
        };
        
        this.webhooks.set(`${filePath}:webhook_${index}`, webhookData);
      });
    }
  }

  /**
   * Extract detailed field information from interface body
   */
  extractInterfaceFields(interfaceBody) {
    const fields = [];
    let match;
    this.fieldPattern.lastIndex = 0;
    
    while ((match = this.fieldPattern.exec(interfaceBody)) !== null) {
      const [, fieldName, optional, fieldType] = match;
      
      fields.push({
        name: fieldName,
        type: fieldType.trim(),
        optional: !!optional,
        required: !optional,
        purpose: this.determineFieldPurpose(fieldName, fieldType),
        dataFlow: this.traceFieldDataFlow(fieldName)
      });
    }
    
    return fields;
  }

  /**
   * Parse function parameters
   */
  parseParameters(paramString) {
    if (!paramString.trim()) return [];
    
    return paramString.split(',').map(param => {
      const trimmed = param.trim();
      const [name, type] = trimmed.split(':').map(p => p.trim());
      return {
        name: name || trimmed,
        type: type || 'any',
        optional: name?.includes('?') || false
      };
    });
  }

  /**
   * Extract methods from class content
   */
  extractClassMethods(className, content) {
    const methods = [];
    let match;
    this.methodPattern.lastIndex = 0;
    
    while ((match = this.methodPattern.exec(content)) !== null) {
      const [fullMatch, methodName, parameters, returnType] = match;
      const isAsync = fullMatch.includes('async');
      const visibility = fullMatch.includes('private') ? 'private' : 
                        fullMatch.includes('protected') ? 'protected' : 'public';
      
      methods.push({
        name: methodName,
        visibility,
        isAsync,
        parameters: this.parseParameters(parameters),
        returnType: returnType ? returnType.trim() : 'void',
        purpose: this.determineMethodPurpose(methodName, className)
      });
    }
    
    return methods;
  }

  /**
   * Analyze relationships between components
   */
  analyzeRelationships() {
    console.log('🔗 Analyzing component relationships...');
    
    // Map import/export relationships
    for (const [key, importData] of this.imports) {
      const sourceFile = this.resolveImportPath(importData.source, importData.filePath);
      if (sourceFile) {
        importData.resolvedSource = sourceFile;
        importData.availableExports = this.getExportsFromFile(sourceFile);
      }
    }
  }

  /**
   * Trace data flows through the system
   */
  traceDataFlows() {
    console.log('📊 Tracing data flows...');
    
    const coreFields = ['sessionId', 'userId', 'emotionalContext', 'sparkResonance', 'trustScore'];
    
    coreFields.forEach(field => {
      const flow = {
        fieldName: field,
        interfaces: [],
        functions: [],
        apiEndpoints: [],
        transformations: []
      };
      
      // Find interfaces using this field
      for (const [key, interfaceData] of this.interfaces) {
        if (interfaceData.fields.some(f => f.name === field)) {
          flow.interfaces.push({
            name: interfaceData.name,
            filePath: interfaceData.filePath,
            usage: this.analyzeFieldUsage(field, interfaceData)
          });
        }
      }
      
      // Find functions using this field
      for (const [key, functionData] of this.functions) {
        if (this.functionUsesField(field, functionData)) {
          flow.functions.push({
            name: functionData.name,
            filePath: functionData.filePath,
            usage: this.analyzeFunctionFieldUsage(field, functionData)
          });
        }
      }
      
      this.dataFlows.set(field, flow);
    });
  }

  /**
   * Map code execution paths
   */
  mapCodePaths() {
    console.log('🛤️ Mapping code execution paths...');
    
    // Map API endpoint to function flows
    for (const [key, endpointData] of this.apiEndpoints) {
      const codePath = {
        entryPoint: `${endpointData.method} ${endpointData.path}`,
        filePath: endpointData.filePath,
        executionFlow: this.traceExecutionFlow(endpointData),
        dataTransformations: this.traceDataTransformations(endpointData),
        outputGeneration: this.traceOutputGeneration(endpointData)
      };
      
      this.codePaths.set(key, codePath);
    }
  }

  /**
   * Helper methods for analysis
   */
  determineUsageContext(interfaceName, interfaceBody, filePath) {
    if (filePath.includes('api/')) return 'API';
    if (filePath.includes('webhook')) return 'Webhook';
    if (filePath.includes('emotional')) return 'Emotional Intelligence';
    if (filePath.includes('spark')) return 'Spark System';
    if (filePath.includes('trust')) return 'Trust System';
    if (filePath.includes('prompt')) return 'Product';
    return 'General';
  }

  findInterfaceRelationships(interfaceBody) {
    const relationships = [];
    
    // Find references to other interfaces
    const interfaceRefs = interfaceBody.match(/:\s*(\w+)/g);
    if (interfaceRefs) {
      interfaceRefs.forEach(ref => {
        const interfaceName = ref.replace(':', '').trim();
        if (interfaceName && interfaceName !== 'string' && interfaceName !== 'number' && interfaceName !== 'boolean') {
          relationships.push(interfaceName);
        }
      });
    }
    
    return relationships;
  }

  determineBusinessPurpose(interfaceName, interfaceBody, filePath) {
    const name = interfaceName.toLowerCase();
    const body = interfaceBody.toLowerCase();
    
    if (name.includes('request') || name.includes('input')) return 'Input Processing';
    if (name.includes('response') || name.includes('output')) return 'Output Generation';
    if (name.includes('emotional')) return 'Emotional Intelligence';
    if (name.includes('spark')) return 'Creativity Enhancement';
    if (name.includes('trust')) return 'Trust Management';
    if (name.includes('webhook')) return 'Integration';
    if (body.includes('sessionid') && body.includes('userid')) return 'Session Management';
    
    return 'Data Structure';
  }

  determineFunctionPurpose(functionName, filePath) {
    const name = functionName.toLowerCase();
    
    if (name.includes('process') || name.includes('handle')) return 'Data Processing';
    if (name.includes('validate') || name.includes('check')) return 'Validation';
    if (name.includes('generate') || name.includes('create')) return 'Generation';
    if (name.includes('trigger') || name.includes('send')) return 'Integration';
    if (name.includes('emotional')) return 'Emotional Intelligence';
    if (name.includes('spark')) return 'Creativity Enhancement';
    if (name.includes('trust')) return 'Trust Management';
    
    return 'Utility';
  }

  determineClassPurpose(className, filePath) {
    const name = className.toLowerCase();
    
    if (name.includes('orchestrator')) return 'System Orchestration';
    if (name.includes('engine')) return 'Processing Engine';
    if (name.includes('service')) return 'Service Layer';
    if (name.includes('validator')) return 'Validation';
    if (name.includes('analyzer')) return 'Analysis';
    if (name.includes('emotional')) return 'Emotional Intelligence';
    if (name.includes('spark')) return 'Creativity Enhancement';
    if (name.includes('trust')) return 'Trust Management';
    
    return 'Component';
  }

  determineEndpointPurpose(endpoint, filePath) {
    if (endpoint.includes('webhook')) return 'Webhook Handler';
    if (endpoint.includes('emotional')) return 'Emotional Processing';
    if (endpoint.includes('spark')) return 'Spark Processing';
    if (endpoint.includes('trust')) return 'Trust Management';
    if (endpoint.includes('health')) return 'Health Check';
    if (endpoint.includes('auth')) return 'Authentication';
    
    return 'API Endpoint';
  }

  determineFieldPurpose(fieldName, fieldType) {
    const name = fieldName.toLowerCase();
    
    if (name.includes('id')) return 'Identifier';
    if (name.includes('timestamp') || name.includes('date')) return 'Temporal';
    if (name.includes('score') || name.includes('rating')) return 'Metric';
    if (name.includes('emotional')) return 'Emotional Data';
    if (name.includes('spark')) return 'Creativity Data';
    if (name.includes('trust')) return 'Trust Data';
    if (name.includes('context')) return 'Context Data';
    if (name.includes('config') || name.includes('setting')) return 'Configuration';
    
    return 'Data';
  }

  // Placeholder methods for complex analysis (can be expanded)
  traceFunctionFlow(functionName, content) { return 'Flow analysis pending'; }
  analyzeClassArchitecture(className, content) { return 'Architecture analysis pending'; }
  getWebhookContext(match, content) { return 'Context analysis pending'; }
  determineWebhookPurpose(match, filePath) { return 'Webhook integration'; }
  determineMethodPurpose(methodName, className) { return 'Method operation'; }
  resolveImportPath(source, filePath) { return null; }
  getExportsFromFile(sourceFile) { return []; }
  analyzeFieldUsage(field, interfaceData) { return 'Usage analysis pending'; }
  functionUsesField(field, functionData) { return false; }
  analyzeFunctionFieldUsage(field, functionData) { return 'Usage analysis pending'; }
  traceFieldDataFlow(fieldName) { return 'Flow analysis pending'; }
  traceExecutionFlow(endpointData) { return 'Execution flow analysis pending'; }
  traceDataTransformations(endpointData) { return 'Transformation analysis pending'; }
  traceOutputGeneration(endpointData) { return 'Output analysis pending'; }
  findEndpointInputInterface(endpoint, content) { return null; }
  findEndpointOutputInterface(endpoint, content) { return null; }

  /**
   * Generate comprehensive blueprint
   */
  generateBlueprint() {
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalFiles: this.fileCount,
        totalInterfaces: this.interfaces.size,
        totalFunctions: this.functions.size,
        totalClasses: this.classes.size,
        totalApiEndpoints: this.apiEndpoints.size,
        totalWebhooks: this.webhooks.size
      },
      interfaces: Object.fromEntries(this.interfaces),
      functions: Object.fromEntries(this.functions),
      classes: Object.fromEntries(this.classes),
      exports: Object.fromEntries(this.exports),
      imports: Object.fromEntries(this.imports),
      apiEndpoints: Object.fromEntries(this.apiEndpoints),
      webhooks: Object.fromEntries(this.webhooks),
      dataFlows: Object.fromEntries(this.dataFlows),
      codePaths: Object.fromEntries(this.codePaths)
    };
  }

  /**
   * Write comprehensive technical documentation
   */
  writeTechnicalDocumentation(blueprint) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Write complete blueprint JSON
    fs.writeFileSync(
      `technical-blueprint-${timestamp}.json`,
      JSON.stringify(blueprint, null, 2)
    );
    
    // Write human-readable documentation
    const documentation = this.generateHumanReadableDoc(blueprint);
    fs.writeFileSync(
      `technical-documentation-${timestamp}.md`,
      documentation
    );
    
    // Write interface reference
    const interfaceRef = this.generateInterfaceReference(blueprint);
    fs.writeFileSync(
      `interface-reference-${timestamp}.md`,
      interfaceRef
    );
    
    // Write API reference
    const apiRef = this.generateApiReference(blueprint);
    fs.writeFileSync(
      `api-reference-${timestamp}.md`,
      apiRef
    );
    
    // Write data flow diagrams
    const dataFlowDoc = this.generateDataFlowDocumentation(blueprint);
    fs.writeFileSync(
      `data-flow-analysis-${timestamp}.md`,
      dataFlowDoc
    );
    
    console.log(`📄 Technical documentation written:`);
    console.log(`   - technical-blueprint-${timestamp}.json`);
    console.log(`   - technical-documentation-${timestamp}.md`);
    console.log(`   - interface-reference-${timestamp}.md`);
    console.log(`   - api-reference-${timestamp}.md`);
    console.log(`   - data-flow-analysis-${timestamp}.md`);
  }

  generateHumanReadableDoc(blueprint) {
    return `# CanAI Technical Documentation

## System Overview
- **Generated**: ${blueprint.metadata.generatedAt}
- **Files Analyzed**: ${blueprint.metadata.totalFiles}
- **Interfaces**: ${blueprint.metadata.totalInterfaces}
- **Functions**: ${blueprint.metadata.totalFunctions}
- **Classes**: ${blueprint.metadata.totalClasses}
- **API Endpoints**: ${blueprint.metadata.totalApiEndpoints}
- **Webhooks**: ${blueprint.metadata.totalWebhooks}

## Architecture Summary

### Core Components
${Object.entries(blueprint.classes).map(([key, classData]) => 
  `- **${classData.name}** (${classData.purpose})\n  - File: \`${classData.filePath}\`\n  - Methods: ${classData.methods.length}\n  - Exported: ${classData.isExported ? 'Yes' : 'No'}`
).join('\n\n')}

### Key Interfaces
${Object.entries(blueprint.interfaces).slice(0, 20).map(([key, interfaceData]) => 
  `- **${interfaceData.name}** (${interfaceData.businessPurpose})\n  - File: \`${interfaceData.filePath}\`\n  - Fields: ${interfaceData.fields.length}\n  - Context: ${interfaceData.usageContext}\n  - Exported: ${interfaceData.isExported ? 'Yes' : 'No'}`
).join('\n\n')}

### API Endpoints
${Object.entries(blueprint.apiEndpoints).map(([key, endpointData]) => 
  `- **${endpointData.method} ${endpointData.path}** (${endpointData.purpose})\n  - File: \`${endpointData.filePath}\``
).join('\n\n')}

### Data Flows
${Object.entries(blueprint.dataFlows).map(([field, flowData]) => 
  `- **${field}**\n  - Interfaces: ${flowData.interfaces.length}\n  - Functions: ${flowData.functions.length}`
).join('\n\n')}

## Integration Points
${Object.entries(blueprint.webhooks).map(([key, webhookData]) => 
  `- **${webhookData.reference}** (${webhookData.purpose})\n  - File: \`${webhookData.filePath}\``
).join('\n\n')}
`;
  }

  generateInterfaceReference(blueprint) {
    return `# Interface Reference

${Object.entries(blueprint.interfaces).map(([key, interfaceData]) => `
## ${interfaceData.name}

**Purpose**: ${interfaceData.businessPurpose}  
**Context**: ${interfaceData.usageContext}  
**File**: \`${interfaceData.filePath}\`  
**Exported**: ${interfaceData.isExported ? 'Yes' : 'No'}

### Fields
${interfaceData.fields.map(field => 
  `- **${field.name}**${field.optional ? '?' : ''}: \`${field.type}\` (${field.purpose})`
).join('\n')}

### Relationships
${interfaceData.relationships.length > 0 ? 
  interfaceData.relationships.map(rel => `- References: ${rel}`).join('\n') : 
  'No direct relationships found'}

### Raw Definition
\`\`\`typescript
${interfaceData.rawDefinition}
\`\`\`
`).join('\n')}`;
  }

  generateApiReference(blueprint) {
    return `# API Reference

${Object.entries(blueprint.apiEndpoints).map(([key, endpointData]) => `
## ${endpointData.method} ${endpointData.path}

**Purpose**: ${endpointData.purpose}  
**File**: \`${endpointData.filePath}\`

### Input Interface
${endpointData.inputInterface || 'Not specified'}

### Output Interface
${endpointData.outputInterface || 'Not specified'}

### Implementation
\`\`\`typescript
${endpointData.rawDefinition}
\`\`\`
`).join('\n')}`;
  }

  generateDataFlowDocumentation(blueprint) {
    return `# Data Flow Analysis

${Object.entries(blueprint.dataFlows).map(([field, flowData]) => `
## ${field} Data Flow

### Interfaces Using This Field
${flowData.interfaces.map(iface => 
  `- **${iface.name}** in \`${iface.filePath}\``
).join('\n')}

### Functions Processing This Field
${flowData.functions.map(func => 
  `- **${func.name}** in \`${func.filePath}\``
).join('\n')}

### Transformations
${flowData.transformations.length > 0 ? 
  flowData.transformations.join('\n') : 
  'No transformations tracked'}
`).join('\n')}`;
  }
}

// Run the technical blueprint generator
if (require.main === module) {
  const generator = new TechnicalBlueprintGenerator();
  generator.generateTechnicalBlueprint().catch(console.error);
}

module.exports = TechnicalBlueprintGenerator; 