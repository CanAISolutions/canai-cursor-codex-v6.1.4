/**
 * Component Counter for Emotional Sovereignty Platform
 * Purpose: Count all TypeScript components to verify "87 components mapped" claim
 * Date: 2025-05-27
 */

import * as fs from 'fs';
import * as path from 'path';

interface ComponentCount {
  directory: string;
  count: number;
  files: string[];
}

interface ComponentAnalysis {
  totalComponents: number;
  directoryBreakdown: ComponentCount[];
  productionReady: number;
  hasTests: number;
  hasDocumentation: number;
  claimedCount: number;
  actualCount: number;
  accuracy: number;
}

class ComponentCounter {
  private rootPath: string;
  private emotionalSovereigntyDirs: string[] = [
    'cursor/orchestration',
    'cursor/services', 
    'cursor/adapters',
    'cursor/utils',
    'cursor/types',
    'cursor/validators',
    'cursor/components',
    'cursor/ai-memories',
    'cursor/emotion',
    'cursor/memory',
    'cursor/intelligence',
    'src/emotional-sovereignty',
    'src/cultural-intelligence',
    'src/emotional-sovereignty'
  ];

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }

  async analyzeComponents(): Promise<ComponentAnalysis> {
    console.log('🔍 Analyzing Emotional Sovereignty Platform Components...\n');

    const directoryBreakdown: ComponentCount[] = [];
    let totalComponents = 0;
    let productionReady = 0;
    let hasTests = 0;
    let hasDocumentation = 0;

    for (const dir of this.emotionalSovereigntyDirs) {
      const fullPath = path.join(this.rootPath, dir);
      
      if (fs.existsSync(fullPath)) {
        const componentCount = await this.countComponentsInDirectory(fullPath);
        directoryBreakdown.push(componentCount);
        totalComponents += componentCount.count;

        // Analyze component quality
        for (const file of componentCount.files) {
          const filePath = path.join(fullPath, file);
          const analysis = await this.analyzeComponentQuality(filePath);
          
          if (analysis.isProductionReady) productionReady++;
          if (analysis.hasTests) hasTests++;
          if (analysis.hasDocumentation) hasDocumentation++;
        }
      } else {
        console.log(`⚠️  Directory not found: ${dir}`);
      }
    }

    const claimedCount = 87;
    const accuracy = (totalComponents / claimedCount) * 100;

    return {
      totalComponents,
      directoryBreakdown,
      productionReady,
      hasTests,
      hasDocumentation,
      claimedCount,
      actualCount: totalComponents,
      accuracy
    };
  }

  private async countComponentsInDirectory(dirPath: string): Promise<ComponentCount> {
    const files: string[] = [];
    
    const scanDirectory = (currentPath: string) => {
      if (!fs.existsSync(currentPath)) return;
      
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
          const relativePath = path.relative(dirPath, itemPath);
          files.push(relativePath);
        }
      }
    };

    scanDirectory(dirPath);

    return {
      directory: path.relative(this.rootPath, dirPath),
      count: files.length,
      files
    };
  }

  private async analyzeComponentQuality(filePath: string): Promise<{
    isProductionReady: boolean;
    hasTests: boolean;
    hasDocumentation: boolean;
  }> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for production readiness indicators
      const hasExports = content.includes('export');
      const hasInterfaces = content.includes('interface') || content.includes('type');
      const hasErrorHandling = content.includes('try') || content.includes('catch') || content.includes('throw');
      const hasLogging = content.includes('console.') || content.includes('log') || content.includes('emit');
      const noTodos = !content.includes('TODO') && !content.includes('FIXME');
      
      const isProductionReady = hasExports && hasInterfaces && hasErrorHandling && noTodos;

      // Check for tests (look for corresponding test file)
      const testPath = filePath.replace('.ts', '.test.ts');
      const hasTests = fs.existsSync(testPath);

      // Check for documentation
      const hasJSDoc = content.includes('/**');
      const hasComments = content.includes('//') || content.includes('/*');
      const hasDocumentation = hasJSDoc || hasComments;

      return {
        isProductionReady,
        hasTests,
        hasDocumentation
      };
    } catch (error) {
      return {
        isProductionReady: false,
        hasTests: false,
        hasDocumentation: false
      };
    }
  }

  generateReport(analysis: ComponentAnalysis): void {
    console.log('📊 Emotional Sovereignty Component Analysis Report');
    console.log('=' .repeat(60));
    
    console.log(`\n🎯 CLAIM VERIFICATION:`);
    console.log(`   CLAIMED: 87 components mapped`);
    console.log(`   ACTUAL: ${analysis.actualCount} components found`);
    console.log(`   ACCURACY: ${analysis.accuracy.toFixed(1)}%`);
    
    if (analysis.accuracy >= 95) {
      console.log(`   ✅ CLAIM VERIFIED: Component count is accurate`);
    } else if (analysis.accuracy >= 80) {
      console.log(`   ⚠️  CLAIM MOSTLY ACCURATE: Minor discrepancy`);
    } else {
      console.log(`   ❌ CLAIM DISPUTED: Significant discrepancy`);
    }

    console.log(`\n📁 DIRECTORY BREAKDOWN:`);
    analysis.directoryBreakdown
      .sort((a, b) => b.count - a.count)
      .forEach(dir => {
        console.log(`   ${dir.directory}: ${dir.count} components`);
      });

    console.log(`\n🏭 PRODUCTION READINESS:`);
    console.log(`   Production Ready: ${analysis.productionReady}/${analysis.totalComponents} (${(analysis.productionReady/analysis.totalComponents*100).toFixed(1)}%)`);
    console.log(`   Has Tests: ${analysis.hasTests}/${analysis.totalComponents} (${(analysis.hasTests/analysis.totalComponents*100).toFixed(1)}%)`);
    console.log(`   Has Documentation: ${analysis.hasDocumentation}/${analysis.totalComponents} (${(analysis.hasDocumentation/analysis.totalComponents*100).toFixed(1)}%)`);

    const productionReadyPercentage = (analysis.productionReady / analysis.totalComponents) * 100;
    
    console.log(`\n🎯 TRUTH ASSESSMENT:`);
    if (analysis.accuracy >= 95 && productionReadyPercentage >= 75) {
      console.log(`   ✅ CLAIM VERIFIED: 87 components mapped, ${productionReadyPercentage.toFixed(0)}% production-ready`);
    } else if (analysis.accuracy >= 80) {
      console.log(`   ⚠️  CLAIM PARTIALLY VERIFIED: Component count close, production readiness needs work`);
    } else {
      console.log(`   ❌ CLAIM DISPUTED: Significant gaps in component count or readiness`);
    }

    console.log(`\n📋 DETAILED FINDINGS:`);
    console.log(`   • Total TypeScript files: ${analysis.totalComponents}`);
    console.log(`   • Claimed "87 components": ${analysis.accuracy >= 95 ? 'ACCURATE' : 'INACCURATE'}`);
    console.log(`   • Claimed "75+ production-ready": ${productionReadyPercentage >= 75 ? 'VERIFIED' : 'DISPUTED'}`);
  }
}

// Run analysis if called directly
if (require.main === module) {
  const counter = new ComponentCounter();
  counter.analyzeComponents()
    .then(analysis => {
      counter.generateReport(analysis);
    })
    .catch(console.error);
}

export { ComponentCounter }; 