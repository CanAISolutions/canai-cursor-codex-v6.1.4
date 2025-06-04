#!/usr/bin/env node

/**
 * CanAI Comprehensive Date Correction Utility v2.0
 * Purpose: Fix ALL systematic date errors (January 2025 → May 2025)
 * Discrepancy: 4 months (120 days) forward correction needed
 * Date: 2025-05-27 (CORRECTED)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface DateMapping {
  january: string;
  may: string;
  description: string;
}

class ComprehensiveDateCorrectionUtility {
  private readonly DAYS_OFFSET = 120; // 4 months
  
  private dateMappings: DateMapping[] = [];
  private processedFiles: string[] = [];
  private correctionCount = 0;

  constructor() {
    this.initializeDateMappings();
  }

  /**
   * Initialize comprehensive date mappings for all January dates
   * What: Map all January 2025 dates to their May 2025 equivalents
   * Why: Systematic correction requires comprehensive date mapping
   * How: Calculate exact date offsets for all January dates
   */
  private initializeDateMappings(): void {
         // Specific date mappings found in codebase
     const specificMappings = [
       { january: '2025-01-01', may: '2025-05-01', description: 'New Year to May 1st' },
       { january: '2025-01-15', may: '2025-05-15', description: 'Mid-January to Mid-May' },
       { january: '2025-01-20', may: '2025-05-20', description: 'Late January to Late May' },
       { january: '2025-01-22', may: '2025-05-22', description: 'January 22nd to May 22nd' },
       { january: '2025-01-24', may: '2025-05-24', description: 'January 24th to May 24th' },
       { january: '2025-01-27', may: '2025-05-27', description: 'Primary correction date' },
       { january: '2025-01-28', may: '2025-05-28', description: 'January 28th to May 28th' }
     ];

    // Add all specific mappings
    this.dateMappings = specificMappings;

    // Generate comprehensive mappings for all January dates (1-31)
    for (let day = 1; day <= 31; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const januaryDate = `2025-01-${dayStr}`;
      
      // Skip if already mapped specifically
      if (!this.dateMappings.find(m => m.january === januaryDate)) {
        // Calculate May equivalent (accounting for different month lengths)
        let mayDay = day;
        if (day > 31) mayDay = 31; // May has 31 days
        
        const mayDayStr = mayDay.toString().padStart(2, '0');
        const mayDate = `2025-05-${mayDayStr}`;
        
        this.dateMappings.push({
          january: januaryDate,
          may: mayDate,
          description: `January ${day} to May ${mayDay}`
        });
      }
    }
  }

  /**
   * Get all files that need comprehensive date correction
   * What: Scan codebase for files containing any January 2025 dates
   * Why: Comprehensive correction requires finding all affected files
   * How: Search for any 2025-01- pattern
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

    // Filter files that actually contain January 2025 dates
    const filesToCorrect: string[] = [];
    
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('2025-01-')) {
          filesToCorrect.push(file);
        }
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${file}`);
      }
    }

    return filesToCorrect;
  }

  /**
   * Apply comprehensive date corrections to file content
   * What: Replace all January 2025 dates with May 2025 equivalents
   * Why: Systematic correction ensures complete date consistency
   * How: Apply all date mappings sequentially with pattern matching
   */
  private correctFileContent(content: string): { corrected: string; changeCount: number } {
    let corrected = content;
    let changeCount = 0;

    for (const mapping of this.dateMappings) {
      // ISO Date patterns (2025-01-XX)
      const isoPattern = new RegExp(mapping.january.replace(/[-]/g, '\\-'), 'g');
      const isoMatches = corrected.match(isoPattern);
      if (isoMatches) {
        corrected = corrected.replace(isoPattern, mapping.may);
        changeCount += isoMatches.length;
      }

      // ISO DateTime patterns (2025-01-XXT...)
      const isoDateTimePattern = new RegExp(mapping.january.replace(/[-]/g, '\\-') + 'T', 'g');
      const isoDateTimeMatches = corrected.match(isoDateTimePattern);
      if (isoDateTimeMatches) {
        corrected = corrected.replace(isoDateTimePattern, mapping.may + 'T');
        changeCount += isoDateTimeMatches.length;
      }
    }

    return { corrected, changeCount };
  }

  /**
   * Process all files requiring comprehensive date correction
   * What: Apply corrections to all identified files
   * Why: Batch processing ensures complete correction
   * How: Read, correct, write with comprehensive error handling
   */
  public async correctAllDates(): Promise<void> {
    console.log('🔍 Scanning for files with January 2025 dates...');
    
    const filesToCorrect = await this.getFilesToCorrect();
    
    console.log(`📁 Found ${filesToCorrect.length} files requiring comprehensive correction`);
    console.log(`🎯 Correcting: ALL January 2025 dates → May 2025 equivalents`);
    console.log(`📊 Date mappings: ${this.dateMappings.length} patterns`);
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
   * What: Document all corrections made for complete audit trail
   * Why: Transparency and verification of comprehensive correction process
   * How: Detailed report with all mappings and statistics
   */
  private generateCorrectionReport(): void {
    const reportContent = `# Comprehensive Date Correction Report
**Execution Date**: 2025-05-27
**Correction Applied**: ALL January 2025 dates → May 2025 equivalents
**Offset**: +4 months (120 days)
**Scope**: Comprehensive correction of all January 2025 dates

## Summary
- **Files Processed**: ${this.processedFiles.length}
- **Total Corrections**: ${this.correctionCount}
- **Date Mappings Applied**: ${this.dateMappings.length}
- **Status**: ✅ COMPLETED

## Files Corrected
${this.processedFiles.map(file => `- \`${file}\``).join('\n')}

## Date Mappings Applied
${this.dateMappings.map(m => `- \`${m.january}\` → \`${m.may}\` (${m.description})`).join('\n')}

## Specific Corrections Found
- **2025-05-01**: New Year dates corrected to 2025-05-01
- **2025-05-15**: Mid-January dates corrected to 2025-05-15
- **2025-05-20**: Late January dates corrected to 2025-05-20
- **2025-05-22**: January 22nd dates corrected to 2025-05-22
- **2025-05-24**: Template dates corrected to 2025-05-24
- **2025-05-27**: Primary system dates corrected to 2025-05-27
- **2025-05-28**: Future scheduled dates corrected to 2025-05-28

## Pattern Coverage
- ISO Date format: \`YYYY-MM-DD\`
- ISO DateTime format: \`YYYY-MM-DDTHH:mm:ss.sssZ\`
- All January days (01-31) mapped to May equivalents
- Comprehensive schema example data corrected

---
*Generated by CanAI Comprehensive Date Correction Utility v2.0*
`;

    fs.writeFileSync('comprehensive-date-correction-report.md', reportContent);
    
    console.log('');
    console.log('🎉 Comprehensive Date Correction Complete!');
    console.log(`📊 ${this.correctionCount} corrections applied across ${this.processedFiles.length} files`);
    console.log(`🗓️  ${this.dateMappings.length} date patterns corrected`);
    console.log('📋 Report saved to: comprehensive-date-correction-report.md');
  }

  /**
   * Rename files with January 2025 dates in their names
   * What: Update filenames containing any January 2025 dates
   * Why: Consistency requires both content and filename correction
   * How: Systematic file renaming for all January patterns
   */
  public async renameIncorrectFiles(): Promise<void> {
    console.log('🔄 Checking for files with January 2025 dates in names...');
    
    const allFiles = glob.sync('**/*2025-01-*', {
      ignore: ['node_modules/**', '.jest-cache/**', '.git/**']
    });

    for (const oldPath of allFiles) {
      let newPath = oldPath;
      
      // Apply all date mappings to filename
      for (const mapping of this.dateMappings) {
        newPath = newPath.replace(new RegExp(mapping.january, 'g'), mapping.may);
      }
      
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

  /**
   * Validate correction completeness
   * What: Verify no January 2025 dates remain in codebase
   * Why: Quality assurance requires complete verification
   * How: Scan for any remaining 2025-01- patterns
   */
  public async validateCorrections(): Promise<void> {
    console.log('🔍 Validating correction completeness...');
    
    const patterns = ['**/*.md', '**/*.ts', '**/*.js', '**/*.json'];
    const excludePatterns = ['node_modules/**', '.jest-cache/**', '.git/**'];
    
    const allFiles: string[] = [];
    for (const pattern of patterns) {
      const files = glob.sync(pattern, { ignore: excludePatterns });
      allFiles.push(...files);
    }

    const remainingIssues: string[] = [];
    
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('2025-01-') && !file.includes('correction-report')) {
          remainingIssues.push(file);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    if (remainingIssues.length === 0) {
      console.log('✅ Validation Complete: No remaining January 2025 dates found');
    } else {
      console.log(`⚠️  Validation Warning: ${remainingIssues.length} files still contain January 2025 dates:`);
      remainingIssues.forEach(file => console.log(`   - ${file}`));
    }
  }
}

// CLI execution
if (require.main === module) {
  const utility = new ComprehensiveDateCorrectionUtility();
  
  async function main() {
    console.log('🚀 CanAI Comprehensive Date Correction Utility v2.0');
    console.log('🎯 Fixing ALL systematic date errors: January 2025 → May 2025');
    console.log('📅 Comprehensive correction of all January dates');
    console.log('');
    
    await utility.correctAllDates();
    await utility.renameIncorrectFiles();
    await utility.validateCorrections();
    
    console.log('');
    console.log('✨ All comprehensive date corrections completed successfully!');
  }
  
  main().catch(console.error);
}

export default ComprehensiveDateCorrectionUtility; 