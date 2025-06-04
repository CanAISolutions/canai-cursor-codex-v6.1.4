#!/usr/bin/env node

/**
 * CanAI Date Correction Utility v1.0
 * Purpose: Fix systematic date error (2025-05-27 → 2025-05-27)
 * Discrepancy: 4 months (120 days) forward correction needed
 * Date: 2025-05-27 (CORRECTED)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface DateCorrection {
  originalDate: string;
  correctedDate: string;
  pattern: RegExp;
  replacement: string;
}

class DateCorrectionUtility {
  private readonly INCORRECT_BASE_DATE = '2025-05-27';
  private readonly CORRECT_BASE_DATE = '2025-05-27';
  private readonly DAYS_OFFSET = 120; // 4 months
  
  private corrections: DateCorrection[] = [];
  private processedFiles: string[] = [];
  private correctionCount = 0;

  constructor() {
    this.initializeCorrections();
  }

  /**
   * Initialize all date correction patterns
   * What: Define patterns for different date formats found in codebase
   * Why: Systematic correction requires comprehensive pattern matching
   * How: RegExp patterns with precise replacement logic
   */
  private initializeCorrections(): void {
    // ISO Date patterns (2025-05-27)
    this.corrections.push({
      originalDate: '2025-05-27',
      correctedDate: '2025-05-27',
      pattern: /2025-05-27/g,
      replacement: '2025-05-27'
    });

    // ISO DateTime patterns (2025-05-27T...)
    this.corrections.push({
      originalDate: '2025-05-27T',
      correctedDate: '2025-05-27T',
      pattern: /2025-05-27T/g,
      replacement: '2025-05-27T'
    });

    // Archive filename patterns
    this.corrections.push({
      originalDate: 'ARCHIVE-2025-05-27',
      correctedDate: 'ARCHIVE-2025-05-27',
      pattern: /ARCHIVE-2025-05-27/g,
      replacement: 'ARCHIVE-2025-05-27'
    });

    // Backup filename patterns
    this.corrections.push({
      originalDate: 'backup.2025-05-27',
      correctedDate: 'backup.2025-05-27',
      pattern: /backup\.2025-05-27/g,
      replacement: 'backup.2025-05-27'
    });

    // System snapshot patterns
    this.corrections.push({
      originalDate: 'snapshot-v4.1-2025-05-27',
      correctedDate: 'snapshot-v4.1-2025-05-27',
      pattern: /snapshot-v4\.1-2025-05-27/g,
      replacement: 'snapshot-v4.1-2025-05-27'
    });

    // Month-only patterns (2025-05)
    this.corrections.push({
      originalDate: '2025-05',
      correctedDate: '2025-05',
      pattern: /2025-05(?!-\d)/g, // Negative lookahead to avoid matching full dates
      replacement: '2025-05'
    });
  }

  /**
   * Get all files that need date correction
   * What: Scan codebase for files containing incorrect dates
   * Why: Targeted correction is more efficient than blanket replacement
   * How: Glob patterns excluding cache and node_modules
   */
  private async getFilesToCorrect(): Promise<string[]> {
    const patterns = [
      '**/*.md',
      '**/*.ts',
      '**/*.js',
      '**/*.json',
      '**/*.yaml',
      '**/*.yml'
    ];

    const excludePatterns = [
      'node_modules/**',
      '.jest-cache/**',
      'coverage/**',
      '.git/**',
      'dist/**',
      'build/**'
    ];

    const allFiles: string[] = [];
    
    for (const pattern of patterns) {
      const files = glob.sync(pattern, {
        ignore: excludePatterns,
        absolute: false
      });
      allFiles.push(...files);
    }

    // Filter files that actually contain the incorrect date
    const filesToCorrect: string[] = [];
    
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(this.INCORRECT_BASE_DATE)) {
          filesToCorrect.push(file);
        }
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${file}`);
      }
    }

    return filesToCorrect;
  }

  /**
   * Apply date corrections to a single file
   * What: Replace all incorrect date patterns in file content
   * Why: Systematic correction ensures consistency
   * How: Apply all correction patterns sequentially
   */
  private correctFileContent(content: string): { corrected: string; changeCount: number } {
    let corrected = content;
    let changeCount = 0;

    for (const correction of this.corrections) {
      const matches = corrected.match(correction.pattern);
      if (matches) {
        corrected = corrected.replace(correction.pattern, correction.replacement);
        changeCount += matches.length;
      }
    }

    return { corrected, changeCount };
  }

  /**
   * Process all files requiring date correction
   * What: Apply corrections to all identified files
   * Why: Batch processing ensures complete correction
   * How: Read, correct, write with error handling
   */
  public async correctAllDates(): Promise<void> {
    console.log('🔍 Scanning for files with incorrect dates...');
    
    const filesToCorrect = await this.getFilesToCorrect();
    
    console.log(`📁 Found ${filesToCorrect.length} files requiring correction`);
    console.log(`🎯 Correcting: ${this.INCORRECT_BASE_DATE} → ${this.CORRECT_BASE_DATE}`);
    console.log('');

    for (const file of filesToCorrect) {
      try {
        const originalContent = fs.readFileSync(file, 'utf8');
        const { corrected, changeCount } = this.correctFileContent(originalContent);

        if (changeCount > 0) {
          fs.writeFileSync(file, corrected, 'utf8');
          this.processedFiles.push(file);
          this.correctionCount += changeCount;
          
          console.log(`✅ ${file}: ${changeCount} corrections applied`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }

    this.generateCorrectionReport();
  }

  /**
   * Generate comprehensive correction report
   * What: Document all corrections made for audit trail
   * Why: Transparency and verification of correction process
   * How: Detailed report with file list and statistics
   */
  private generateCorrectionReport(): void {
    const reportContent = `# Date Correction Report
**Execution Date**: ${this.CORRECT_BASE_DATE}
**Correction Applied**: ${this.INCORRECT_BASE_DATE} → ${this.CORRECT_BASE_DATE}
**Offset**: +4 months (120 days)

## Summary
- **Files Processed**: ${this.processedFiles.length}
- **Total Corrections**: ${this.correctionCount}
- **Status**: ✅ COMPLETED

## Files Corrected
${this.processedFiles.map(file => `- \`${file}\``).join('\n')}

## Correction Patterns Applied
${this.corrections.map(c => `- \`${c.originalDate}\` → \`${c.correctedDate}\``).join('\n')}

---
*Generated by CanAI Date Correction Utility v1.0*
`;

    fs.writeFileSync('date-correction-report.md', reportContent);
    
    console.log('');
    console.log('🎉 Date Correction Complete!');
    console.log(`📊 ${this.correctionCount} corrections applied across ${this.processedFiles.length} files`);
    console.log('📋 Report saved to: date-correction-report.md');
  }

  /**
   * Rename files with incorrect dates in their names
   * What: Update filenames containing the incorrect date
   * Why: Consistency requires both content and filename correction
   * How: Systematic file renaming with safety checks
   */
  public async renameIncorrectFiles(): Promise<void> {
    console.log('🔄 Checking for files with incorrect dates in names...');
    
    const allFiles = glob.sync('**/*2025-05-27*', {
      ignore: ['node_modules/**', '.jest-cache/**', '.git/**']
    });

    for (const oldPath of allFiles) {
      const newPath = oldPath.replace(/2025-05-27/g, '2025-05-27');
      
      if (oldPath !== newPath) {
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`📝 Renamed: ${oldPath} → ${newPath}`);
        } catch (error) {
          console.error(`❌ Error renaming ${oldPath}:`, error);
        }
      }
    }
  }
}

// CLI execution
if (require.main === module) {
  const utility = new DateCorrectionUtility();
  
  async function main() {
    console.log('🚀 CanAI Date Correction Utility v1.0');
    console.log('🎯 Fixing systematic date error: 2025-05-27 → 2025-05-27');
    console.log('');
    
    await utility.correctAllDates();
    await utility.renameIncorrectFiles();
    
    console.log('');
    console.log('✨ All date corrections completed successfully!');
  }
  
  main().catch(console.error);
}

export default DateCorrectionUtility; 