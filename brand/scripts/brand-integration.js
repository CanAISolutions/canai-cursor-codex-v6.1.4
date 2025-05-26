#!/usr/bin/env node

/**
 * CanAI Brand Integration Script v1.2
 * 
 * What: Automatically updates documents and files to comply with CanAI brand standards
 * Why: Ensures consistent brand implementation across all materials
 * How: Scans files and applies brand-compliant replacements and formatting
 * 
 * Protected under Codex Directive: CanAI-Brand-Core/v1.2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CanAI Brand Configuration
const BRAND_CONFIG = {
  name: 'CanAI',
  domain: 'CanAI.so',
  tagline: 'Empowerment Through Ease',
  corePromise: 'Emotionally intelligent, zero-manual-touch strategy engine for small businesses',
  colors: {
    primaryBlue: '#00CFFF',
    glowCyan: '#00F0FF',
    deepBackground: '#0A0F1C',
    lightText: '#E6F6FF',
    gradientAnchor: '#00B2E3'
  },
  fonts: {
    primary: 'Manrope',
    fallback: 'Inter, Helvetica Neue, sans-serif'
  }
};

// Brand replacement patterns
const BRAND_REPLACEMENTS = [
  // Legacy color updates
  { from: /#3A69E0/g, to: BRAND_CONFIG.colors.primaryBlue, type: 'color' },
  { from: /#26D9C1/g, to: BRAND_CONFIG.colors.glowCyan, type: 'color' },
  { from: /#1E1E1E/g, to: BRAND_CONFIG.colors.deepBackground, type: 'color' },
  
  // Font updates
  { from: /font-family:\s*['"]*Inter['"]*[^;]*/g, to: `font-family: '${BRAND_CONFIG.fonts.primary}', ${BRAND_CONFIG.fonts.fallback}`, type: 'font' },
  
  // Tagline standardization
  { from: /Empowerment Through Ease\./g, to: BRAND_CONFIG.tagline, type: 'tagline' },
  { from: /empowerment through ease\./gi, to: BRAND_CONFIG.tagline, type: 'tagline' },
  
  // Domain standardization
  { from: /canai\.so/gi, to: BRAND_CONFIG.domain, type: 'domain' },
  { from: /CanAI\.so/g, to: BRAND_CONFIG.domain, type: 'domain' }
];

// File types to process
const PROCESSABLE_EXTENSIONS = ['.md', '.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.json'];

class BrandIntegrator {
  constructor() {
    this.processedFiles = 0;
    this.updatedFiles = 0;
    this.errors = [];
    this.changes = [];
  }

  /**
   * Main integration function
   * What: Processes all files in the workspace for brand compliance
   * Why: Ensures consistent brand implementation
   * How: Recursively scans directories and applies brand updates
   */
  async integrate(targetPath = '.') {
    console.log('🎨 CanAI Brand Integration v1.2');
    console.log('🔒 Protected under Codex Directive: CanAI-Brand-Core/v1.2\n');
    
    try {
      await this.processDirectory(targetPath);
      this.generateReport();
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Process a directory recursively
   * What: Scans directory for processable files
   * Why: Ensures comprehensive brand coverage
   * How: Recursively walks directory tree and processes eligible files
   */
  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      // Skip certain directories
      if (stat.isDirectory()) {
        if (this.shouldSkipDirectory(item)) {
          continue;
        }
        await this.processDirectory(fullPath);
      } else if (stat.isFile()) {
        await this.processFile(fullPath);
      }
    }
  }

  /**
   * Check if directory should be skipped
   * What: Determines if a directory should be excluded from processing
   * Why: Avoids processing system files and dependencies
   * How: Checks against exclusion list
   */
  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules', '.git', '.next', 'dist', 'build', 
      'coverage', '.nyc_output', 'logs', 'temp'
    ];
    return skipDirs.includes(dirName);
  }

  /**
   * Process individual file
   * What: Applies brand updates to a single file
   * Why: Ensures file-level brand compliance
   * How: Reads file, applies replacements, writes back if changed
   */
  async processFile(filePath) {
    const ext = path.extname(filePath);
    
    if (!PROCESSABLE_EXTENSIONS.includes(ext)) {
      return;
    }

    this.processedFiles++;
    
    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      let updatedContent = originalContent;
      let fileChanged = false;
      const fileChanges = [];

      // Apply brand replacements
      for (const replacement of BRAND_REPLACEMENTS) {
        const matches = updatedContent.match(replacement.from);
        if (matches) {
          updatedContent = updatedContent.replace(replacement.from, replacement.to);
          fileChanged = true;
          fileChanges.push({
            type: replacement.type,
            count: matches.length,
            pattern: replacement.from.toString()
          });
        }
      }

      // Apply file-specific updates
      if (ext === '.md') {
        const mdUpdates = this.applyMarkdownBrandUpdates(updatedContent);
        if (mdUpdates.changed) {
          updatedContent = mdUpdates.content;
          fileChanged = true;
          fileChanges.push(...mdUpdates.changes);
        }
      }

      if (ext === '.css') {
        const cssUpdates = this.applyCSSBrandUpdates(updatedContent);
        if (cssUpdates.changed) {
          updatedContent = cssUpdates.content;
          fileChanged = true;
          fileChanges.push(...cssUpdates.changes);
        }
      }

      // Write back if changed
      if (fileChanged) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        this.updatedFiles++;
        this.changes.push({
          file: filePath,
          changes: fileChanges
        });
        console.log(`✅ Updated: ${filePath}`);
      }

    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error.message
      });
      console.log(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Apply markdown-specific brand updates
   * What: Handles markdown-specific brand formatting
   * Why: Ensures proper brand presentation in documentation
   * How: Applies markdown-specific patterns and structures
   */
  applyMarkdownBrandUpdates(content) {
    let updatedContent = content;
    const changes = [];
    let changed = false;

    // Add brand header if missing
    if (!content.includes('CanAI.so') && !content.includes('# CanAI')) {
      const brandHeader = `# CanAI.so\n*${BRAND_CONFIG.tagline}*\n\n---\n\n`;
      updatedContent = brandHeader + updatedContent;
      changed = true;
      changes.push({ type: 'header', description: 'Added brand header' });
    }

    // Ensure proper tagline formatting
    const taglinePattern = /\*Empowerment Through Ease[^*]*\*/g;
    if (!taglinePattern.test(content)) {
      // Look for tagline and format it properly
      const taglineReplace = new RegExp(BRAND_CONFIG.tagline, 'g');
      if (taglineReplace.test(content)) {
        updatedContent = updatedContent.replace(taglineReplace, `*${BRAND_CONFIG.tagline}*`);
        changed = true;
        changes.push({ type: 'tagline', description: 'Formatted tagline with emphasis' });
      }
    }

    return { content: updatedContent, changed, changes };
  }

  /**
   * Apply CSS-specific brand updates
   * What: Handles CSS-specific brand formatting
   * Why: Ensures proper brand colors and styles in stylesheets
   * How: Applies CSS-specific patterns and variable updates
   */
  applyCSSBrandUpdates(content) {
    let updatedContent = content;
    const changes = [];
    let changed = false;

    // Add CSS custom properties if missing
    if (!content.includes('--canai-primary-blue') && content.includes(':root')) {
      const brandVars = `
  /* CanAI Brand Colors v1.2 */
  --canai-primary-blue: ${BRAND_CONFIG.colors.primaryBlue};
  --canai-glow-cyan: ${BRAND_CONFIG.colors.glowCyan};
  --canai-deep-background: ${BRAND_CONFIG.colors.deepBackground};
  --canai-light-text: ${BRAND_CONFIG.colors.lightText};
  --canai-gradient-anchor: ${BRAND_CONFIG.colors.gradientAnchor};
`;
      updatedContent = updatedContent.replace(':root {', ':root {' + brandVars);
      changed = true;
      changes.push({ type: 'variables', description: 'Added CanAI brand CSS variables' });
    }

    return { content: updatedContent, changed, changes };
  }

  /**
   * Generate integration report
   * What: Creates a summary of the brand integration process
   * Why: Provides visibility into changes made and any issues
   * How: Compiles statistics and writes report file
   */
  generateReport() {
    console.log('\n📊 Brand Integration Report');
    console.log('=' .repeat(50));
    console.log(`Files Processed: ${this.processedFiles}`);
    console.log(`Files Updated: ${this.updatedFiles}`);
    console.log(`Errors: ${this.errors.length}`);
    
    if (this.changes.length > 0) {
      console.log('\n🔄 Changes Made:');
      this.changes.forEach(change => {
        console.log(`  📄 ${change.file}`);
        change.changes.forEach(c => {
          console.log(`    - ${c.type}: ${c.description || c.count + ' replacements'}`);
        });
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => {
        console.log(`  ${error.file}: ${error.error}`);
      });
    }

    // Write detailed report
    const reportPath = 'brand-integration-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      version: 'v1.2',
      codexDirective: 'CanAI-Brand-Core/v1.2',
      summary: {
        filesProcessed: this.processedFiles,
        filesUpdated: this.updatedFiles,
        errorsCount: this.errors.length
      },
      changes: this.changes,
      errors: this.errors,
      brandConfig: BRAND_CONFIG
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    console.log('\n🎨 Brand integration complete!');
    console.log('🔒 All changes comply with Codex Directive: CanAI-Brand-Core/v1.2');
  }
}

// CLI execution
if (require.main === module) {
  const integrator = new BrandIntegrator();
  const targetPath = process.argv[2] || '.';
  
  integrator.integrate(targetPath).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = BrandIntegrator; 