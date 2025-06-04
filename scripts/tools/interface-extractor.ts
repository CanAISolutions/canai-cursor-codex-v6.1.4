#!/usr/bin/env node

/**
 * Interface Extractor Script
 * Purpose: Scan codebase for all TypeScript interfaces and extract their field definitions
 * Usage: npm run extract-interfaces or node scripts/tools/interface-extractor.ts
 * Output: JSON report with all interfaces, their paths, and field structures
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface InterfaceField {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  defaultValue?: string;
}

interface InterfaceDefinition {
  name: string;
  filePath: string;
  relativePath: string;
  lineNumber: number;
  exported: boolean;
  extends?: string[];
  fields: InterfaceField[];
  description?: string;
  category?: string;
}

interface ExtractionReport {
  timestamp: string;
  totalInterfaces: number;
  totalFiles: number;
  categories: Record<string, number>;
  interfaces: InterfaceDefinition[];
  summary: {
    byCategory: Record<string, InterfaceDefinition[]>;
    byFile: Record<string, InterfaceDefinition[]>;
    fieldStatistics: {
      totalFields: number;
      optionalFields: number;
      requiredFields: number;
      mostCommonTypes: Record<string, number>;
    };
  };
}

class InterfaceExtractor {
  private interfaces: InterfaceDefinition[] = [];
  private rootPath: string;
  private excludePatterns: string[] = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.jest-cache'
  ];
  
  // Specific files to exclude
  private excludeFiles: string[] = [
    'api/types/airtable.ts',
    'api\\types\\airtable.ts' // Windows path format
  ];

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }

  /**
   * Main extraction method
   */
  async extract(): Promise<ExtractionReport> {
    console.log('🔍 Starting interface extraction...');
    
    const tsFiles = this.findTypeScriptFiles(this.rootPath);
    console.log(`📁 Found ${tsFiles.length} TypeScript files`);

    let processedFiles = 0;
    for (const filePath of tsFiles) {
      try {
        await this.extractFromFile(filePath);
        processedFiles++;
        
        if (processedFiles % 50 === 0) {
          console.log(`📊 Processed ${processedFiles}/${tsFiles.length} files...`);
        }
      } catch (error: any) {
        console.warn(`⚠️  Error processing ${filePath}:`, error.message);
      }
    }

    console.log(`✅ Extraction complete! Found ${this.interfaces.length} interfaces`);
    
    return this.generateReport();
  }

  /**
   * Find all TypeScript files in the project
   */
  private findTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];
    
    const scan = (currentDir: string) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip excluded directories
          if (!this.excludePatterns.some(pattern => item.includes(pattern))) {
            scan(fullPath);
          }
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
          // Check if this file should be excluded
          const relativePath = path.relative(this.rootPath, fullPath);
          const normalizedPath = relativePath.replace(/\\/g, '/');
          
          if (!this.excludeFiles.some(excludeFile => 
            normalizedPath === excludeFile || 
            relativePath === excludeFile ||
            fullPath.endsWith(excludeFile)
          )) {
            files.push(fullPath);
          } else {
            console.log(`🚫 Excluding file: ${relativePath}`);
          }
        }
      }
    };
    
    scan(dir);
    return files;
  }

  /**
   * Extract interfaces from a single TypeScript file
   */
  private async extractFromFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const relativePath = path.relative(this.rootPath, filePath);
    
    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node)) {
        const interfaceDef = this.parseInterface(node, filePath, relativePath, content);
        if (interfaceDef) {
          this.interfaces.push(interfaceDef);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  /**
   * Parse a TypeScript interface declaration
   */
  private parseInterface(
    node: ts.InterfaceDeclaration,
    filePath: string,
    relativePath: string,
    fileContent: string
  ): InterfaceDefinition | null {
    try {
      const name = node.name.text;
      const lineNumber = this.getLineNumber(node, fileContent);
      const exported = this.isExported(node);
      const description = this.extractJSDocComment(node);
      const extendsClause = this.extractExtendsClause(node);
      const fields = this.extractFields(node);
      const category = this.categorizeInterface(relativePath, name);

      return {
        name,
        filePath,
        relativePath,
        lineNumber,
        exported,
        extends: extendsClause,
        fields,
        description,
        category
      };
    } catch (error: any) {
      console.warn(`Error parsing interface in ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Extract fields from interface
   */
  private extractFields(node: ts.InterfaceDeclaration): InterfaceField[] {
    const fields: InterfaceField[] = [];

    for (const member of node.members) {
      if (ts.isPropertySignature(member)) {
        const field = this.parsePropertySignature(member);
        if (field) {
          fields.push(field);
        }
      }
    }

    return fields;
  }

  /**
   * Parse a property signature
   */
  private parsePropertySignature(member: ts.PropertySignature): InterfaceField | null {
    try {
      const name = member.name?.getText() || 'unknown';
      const optional = !!member.questionToken;
      const type = member.type ? this.getTypeString(member.type) : 'any';
      const description = this.extractJSDocComment(member);

      return {
        name: name.replace(/['"]/g, ''), // Remove quotes from property names
        type,
        optional,
        description
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get type string from TypeScript type node
   */
  private getTypeString(typeNode: ts.TypeNode): string {
    try {
      // Handle common type patterns
      if (ts.isTypeReferenceNode(typeNode)) {
        const typeName = typeNode.typeName.getText();
        if (typeNode.typeArguments) {
          const args = typeNode.typeArguments.map(arg => this.getTypeString(arg)).join(', ');
          return `${typeName}<${args}>`;
        }
        return typeName;
      }
      
      if (ts.isUnionTypeNode(typeNode)) {
        return typeNode.types.map(t => this.getTypeString(t)).join(' | ');
      }
      
      if (ts.isArrayTypeNode(typeNode)) {
        return `${this.getTypeString(typeNode.elementType)}[]`;
      }
      
      if (ts.isLiteralTypeNode(typeNode)) {
        return typeNode.literal.getText();
      }
      
      // Fallback to raw text
      return typeNode.getText();
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Extract JSDoc comment
   */
  private extractJSDocComment(node: ts.Node): string | undefined {
    const jsDoc = (node as any).jsDoc;
    if (jsDoc && jsDoc.length > 0) {
      return jsDoc[0].comment || undefined;
    }
    return undefined;
  }

  /**
   * Extract extends clause
   */
  private extractExtendsClause(node: ts.InterfaceDeclaration): string[] | undefined {
    if (node.heritageClauses) {
      const extendsClause = node.heritageClauses.find(
        clause => clause.token === ts.SyntaxKind.ExtendsKeyword
      );
      
      if (extendsClause) {
        return extendsClause.types.map(type => type.expression.getText());
      }
    }
    return undefined;
  }

  /**
   * Check if interface is exported
   */
  private isExported(node: ts.InterfaceDeclaration): boolean {
    return node.modifiers?.some(
      modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
    ) || false;
  }

  /**
   * Get line number of node
   */
  private getLineNumber(node: ts.Node, fileContent: string): number {
    const sourceFile = node.getSourceFile();
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    return position.line + 1;
  }

  /**
   * Categorize interface based on file path and name
   */
  private categorizeInterface(filePath: string, name: string): string {
    const pathLower = filePath.toLowerCase();
    const nameLower = name.toLowerCase();

    // Payment & Financial
    if (pathLower.includes('stripe') || nameLower.includes('stripe') || 
        nameLower.includes('payment') || nameLower.includes('invoice')) {
      return 'Payment & Financial';
    }

    // Business Entities
    if (pathLower.includes('client') || pathLower.includes('project') ||
        nameLower.includes('client') || nameLower.includes('project')) {
      return 'Business Entities';
    }

    // Emotional Intelligence
    if (pathLower.includes('emotional') || pathLower.includes('sovereignty') ||
        nameLower.includes('emotional') || nameLower.includes('trust') ||
        nameLower.includes('resonance')) {
      return 'Emotional Intelligence';
    }

    // Memory & AI
    if (pathLower.includes('memory') || pathLower.includes('ai') ||
        nameLower.includes('memory') || nameLower.includes('injection')) {
      return 'Memory & AI';
    }

    // Security
    if (pathLower.includes('security') || nameLower.includes('security') ||
        nameLower.includes('auth') || nameLower.includes('rate')) {
      return 'Security & Monitoring';
    }

    // Testing
    if (pathLower.includes('test') || nameLower.includes('test') ||
        pathLower.includes('validation') || nameLower.includes('validation')) {
      return 'Testing & Validation';
    }

    // API & Types
    if (pathLower.includes('api/types') || pathLower.includes('types/')) {
      return 'API & Types';
    }

    // Prompts
    if (pathLower.includes('prompt') || nameLower.includes('prompt')) {
      return 'Prompts & Content';
    }

    // Utilities
    if (pathLower.includes('util') || pathLower.includes('service') ||
        nameLower.includes('config') || nameLower.includes('option')) {
      return 'Utilities & Services';
    }

    return 'Other';
  }

  /**
   * Generate comprehensive report
   */
  private generateReport(): ExtractionReport {
    const timestamp = new Date().toISOString();
    const totalFiles = new Set(this.interfaces.map(i => i.filePath)).size;
    
    // Categorize interfaces
    const byCategory: Record<string, InterfaceDefinition[]> = {};
    const byFile: Record<string, InterfaceDefinition[]> = {};
    const categories: Record<string, number> = {};
    
    for (const iface of this.interfaces) {
      // By category
      if (!byCategory[iface.category!]) {
        byCategory[iface.category!] = [];
      }
      byCategory[iface.category!].push(iface);
      categories[iface.category!] = (categories[iface.category!] || 0) + 1;
      
      // By file
      if (!byFile[iface.relativePath]) {
        byFile[iface.relativePath] = [];
      }
      byFile[iface.relativePath].push(iface);
    }

    // Field statistics
    const allFields = this.interfaces.flatMap(i => i.fields);
    const typeCount: Record<string, number> = {};
    
    for (const field of allFields) {
      const baseType = field.type.split('<')[0].split('|')[0].trim();
      typeCount[baseType] = (typeCount[baseType] || 0) + 1;
    }

    const fieldStatistics = {
      totalFields: allFields.length,
      optionalFields: allFields.filter(f => f.optional).length,
      requiredFields: allFields.filter(f => !f.optional).length,
      mostCommonTypes: Object.fromEntries(
        Object.entries(typeCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
      )
    };

    return {
      timestamp,
      totalInterfaces: this.interfaces.length,
      totalFiles,
      categories,
      interfaces: this.interfaces,
      summary: {
        byCategory,
        byFile,
        fieldStatistics
      }
    };
  }

  /**
   * Save report to file
   */
  async saveReport(report: ExtractionReport, outputPath?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultPath = `interface-extraction-report-${timestamp}.json`;
    const filePath = outputPath || defaultPath;
    
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${filePath}`);
    
    // Also save a summary markdown file
    const markdownPath = filePath.replace('.json', '.md');
    await this.saveMarkdownSummary(report, markdownPath);
    
    return filePath;
  }

  /**
   * Save markdown summary
   */
  private async saveMarkdownSummary(report: ExtractionReport, filePath: string): Promise<void> {
    let markdown = `# Interface Extraction Report\n\n`;
    markdown += `**Generated:** ${report.timestamp}\n`;
    markdown += `**Total Interfaces:** ${report.totalInterfaces}\n`;
    markdown += `**Total Files:** ${report.totalFiles}\n\n`;

    // Categories overview
    markdown += `## Categories Overview\n\n`;
    for (const [category, count] of Object.entries(report.categories)) {
      markdown += `- **${category}:** ${count} interfaces\n`;
    }
    markdown += `\n`;

    // Field statistics
    markdown += `## Field Statistics\n\n`;
    markdown += `- **Total Fields:** ${report.summary.fieldStatistics.totalFields}\n`;
    markdown += `- **Required Fields:** ${report.summary.fieldStatistics.requiredFields}\n`;
    markdown += `- **Optional Fields:** ${report.summary.fieldStatistics.optionalFields}\n\n`;

    markdown += `### Most Common Types\n\n`;
    for (const [type, count] of Object.entries(report.summary.fieldStatistics.mostCommonTypes)) {
      markdown += `- **${type}:** ${count} occurrences\n`;
    }
    markdown += `\n`;

    // Interfaces by category
    for (const [category, interfaces] of Object.entries(report.summary.byCategory)) {
      markdown += `## ${category}\n\n`;
      
      for (const iface of interfaces) {
        markdown += `### \`${iface.name}\`\n`;
        markdown += `**File:** \`${iface.relativePath}:${iface.lineNumber}\`\n`;
        markdown += `**Exported:** ${iface.exported ? 'Yes' : 'No'}\n`;
        
        if (iface.description) {
          markdown += `**Description:** ${iface.description}\n`;
        }
        
        if (iface.extends && iface.extends.length > 0) {
          markdown += `**Extends:** ${iface.extends.join(', ')}\n`;
        }
        
        markdown += `**Fields:** ${iface.fields.length}\n\n`;
        
        if (iface.fields.length > 0) {
          markdown += `| Field | Type | Required | Description |\n`;
          markdown += `|-------|------|----------|-------------|\n`;
          
          for (const field of iface.fields) {
            const required = field.optional ? 'No' : 'Yes';
            const description = field.description || '';
            markdown += `| \`${field.name}\` | \`${field.type}\` | ${required} | ${description} |\n`;
          }
          markdown += `\n`;
        }
      }
    }

    fs.writeFileSync(filePath, markdown);
    console.log(`📄 Markdown summary saved to: ${filePath}`);
  }
}

// CLI execution
async function main() {
  try {
    const extractor = new InterfaceExtractor();
    const report = await extractor.extract();
    
    console.log('\n📊 EXTRACTION SUMMARY');
    console.log('====================');
    console.log(`Total Interfaces: ${report.totalInterfaces}`);
    console.log(`Total Files: ${report.totalFiles}`);
    console.log(`Categories: ${Object.keys(report.categories).length}`);
    
    console.log('\nTop Categories:');
    const sortedCategories = Object.entries(report.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    for (const [category, count] of sortedCategories) {
      console.log(`  ${category}: ${count} interfaces`);
    }
    
    await extractor.saveReport(report);
    
    console.log('\n✅ Interface extraction complete!');
    
  } catch (error) {
    console.error('❌ Error during extraction:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { InterfaceExtractor, InterfaceDefinition, ExtractionReport }; 