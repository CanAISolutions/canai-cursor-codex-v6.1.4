/**
 * MDC Rules Loader
 * 
 * Purpose:
 * Centralized access to MDC rules for use throughout the system
 * Ensures consistent rule application without repetitive loading
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface MDCRule {
  id: string;
  description: string;
  alwaysApply: boolean;
  ruleType: string;
  content: string;
  globs: string[];
  hasEmotionalSovereignty: boolean;
  hasTestRequirements: boolean;
  trustScoreThreshold?: number;
  blockingViolations: string[];
  mandatoryRequirements: string[];
  warningViolations: string[];
}

class MDCRulesLoader {
  private rules: Map<string, MDCRule> = new Map();
  private rulesDir: string;
  private loaded: boolean = false;
  
  constructor(rulesDir = 'cursor/rules') {
    this.rulesDir = rulesDir;
  }
  
  /**
   * Load all MDC rules
   */
  public loadRules(): void {
    if (this.loaded) return;
    
    try {
      const mdcFiles = readdirSync(this.rulesDir)
        .filter(file => file.endsWith('.mdc'))
        .map(file => join(this.rulesDir, file));
      
      for (const filePath of mdcFiles) {
        try {
          const rule = this.loadRule(filePath);
          if (rule) {
            this.rules.set(rule.id, rule);
          }
        } catch (error) {
          console.error(`Error loading MDC rule from ${filePath}:`, error);
        }
      }
      
      this.loaded = true;
    } catch (error) {
      console.error('Error loading MDC rules:', error);
      this.loadFallbackRules();
    }
  }
  
  /**
   * Load a single MDC rule
   */
  private loadRule(filePath: string): MDCRule | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const ruleId = filePath.split('/').pop()?.replace('.mdc', '') || 
                     filePath.split('\\').pop()?.replace('.mdc', '') || 'unknown';
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let description = '';
      let alwaysApply = false;
      let ruleType = 'Always';
      let globs: string[] = ['**/*'];
      
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        
        const descMatch = frontmatter.match(/description:\s*(.+)/);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        
        const applyMatch = frontmatter.match(/alwaysApply:\s*(.+)/);
        if (applyMatch) {
          alwaysApply = applyMatch[1].trim() === 'true';
        }
        
        const typeMatch = frontmatter.match(/ruleType:\s*(.+)/);
        if (typeMatch) {
          ruleType = typeMatch[1].trim();
        }
        
        const globsMatch = frontmatter.match(/globs:\s*\[(.*?)\]/s);
        if (globsMatch) {
          globs = globsMatch[1].split(',').map(g => g.trim().replace(/['"]/g, ''));
        }
      }
      
      // Parse trust score threshold
      const trustScoreMatch = content.match(/trust.*score.*(\d+\.?\d*)/gi);
      const trustScoreThreshold = trustScoreMatch ? 
        parseFloat(trustScoreMatch[0].match(/(\d+\.?\d*)/)?.[1] || '0') : undefined;
      
      // Parse blocking violations
      const blockingPattern = /❌\s*(.+)/g;
      const blockingViolations: string[] = [];
      let blockMatch;
      while ((blockMatch = blockingPattern.exec(content)) !== null) {
        blockingViolations.push(blockMatch[1].trim());
      }
      
      // Parse mandatory requirements
      const mandatoryPattern = /\*\*MANDATORY\*\*:\s*(.+)/g;
      const mandatoryRequirements: string[] = [];
      let mandatoryMatch;
      while ((mandatoryMatch = mandatoryPattern.exec(content)) !== null) {
        mandatoryRequirements.push(mandatoryMatch[1].trim());
      }
      
      // Parse warnings
      const warningPattern = /⚠️\s*(.+)/g;
      const warningViolations: string[] = [];
      let warningMatch;
      while ((warningMatch = warningPattern.exec(content)) !== null) {
        warningViolations.push(warningMatch[1].trim());
      }
      
      // Check for emotional sovereignty and test requirements
      const hasEmotionalSovereignty = content.includes('Sacred Reversal Test') || 
                                    content.includes('emotional sovereignty') || 
                                    content.includes('trust score');
      
      const hasTestRequirements = content.includes('test-first truth') || 
                                content.includes('Test-First Truth') || 
                                content.includes('test validation');
      
      return {
        id: ruleId,
        description,
        alwaysApply,
        ruleType,
        content,
        globs,
        hasEmotionalSovereignty,
        hasTestRequirements,
        trustScoreThreshold,
        blockingViolations,
        mandatoryRequirements,
        warningViolations
      };
    } catch (error) {
      console.error(`Error loading rule ${filePath}:`, error);
      return null;
    }
  }
  
  /**
   * Load fallback rules when regular loading fails
   */
  private loadFallbackRules(): void {
    console.log('Loading fallback MDC rules');
    
    // Define some basic fallback rules
    const toneRule: MDCRule = {
      id: 'codex-tone',
      description: 'Maintain Codex tone and safety layer',
      alwaysApply: true,
      ruleType: 'Always',
      content: 'Use emotionally intelligent and clear tone in all responses.',
      globs: ['**'],
      hasEmotionalSovereignty: true,
      hasTestRequirements: false,
      trustScoreThreshold: 4.2,
      blockingViolations: ['Makes users feel stupid', 'Creates anxiety'],
      mandatoryRequirements: ['Communication must recognize and honor user intent'],
      warningViolations: []
    };
    
    const testFirstTruthRule: MDCRule = {
      id: 'test-first-truth',
      description: 'Enforce test-first truth principles',
      alwaysApply: true,
      ruleType: 'Always',
      content: 'Never assume completion without test validation',
      globs: ['**'],
      hasEmotionalSovereignty: false,
      hasTestRequirements: true,
      blockingViolations: ['Cannot claim completion without tests'],
      mandatoryRequirements: ['Must include test validation evidence'],
      warningViolations: []
    };
    
    this.rules.set(toneRule.id, toneRule);
    this.rules.set(testFirstTruthRule.id, testFirstTruthRule);
    
    this.loaded = true;
  }
  
  /**
   * Get a specific rule by ID
   */
  public getRule(ruleId: string): MDCRule | undefined {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return this.rules.get(ruleId);
  }
  
  /**
   * Get all loaded rules
   */
  public getAllRules(): MDCRule[] {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return Array.from(this.rules.values());
  }
  
  /**
   * Get rules that apply to a specific file path
   */
  public getRulesForPath(filePath: string): MDCRule[] {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return Array.from(this.rules.values()).filter(rule => 
      rule.alwaysApply || this.pathMatchesGlobs(filePath, rule.globs)
    );
  }
  
  /**
   * Check if a file path matches any glob patterns
   */
  private pathMatchesGlobs(filePath: string, globs: string[]): boolean {
    for (const globPattern of globs) {
      if (globPattern === '**' || globPattern === '**/*') {
        return true;
      }
      
      // Simple pattern matching - could be improved with proper glob library
      if (filePath.includes(globPattern.replace('*', ''))) {
        return true;
      }
      
      // Check file extension
      if (globPattern.startsWith('*.') && filePath.endsWith(globPattern.substring(1))) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Get core rules (emotional sovereignty, test-first truth)
   */
  public getCoreRules(): MDCRule[] {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return Array.from(this.rules.values()).filter(rule => 
      rule.hasEmotionalSovereignty || rule.hasTestRequirements
    );
  }
  
  /**
   * Get emotional sovereignty rules
   */
  public getEmotionalSovereigntyRules(): MDCRule[] {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return Array.from(this.rules.values()).filter(rule => rule.hasEmotionalSovereignty);
  }
  
  /**
   * Get test-first truth rules
   */
  public getTestFirstTruthRules(): MDCRule[] {
    if (!this.loaded) {
      this.loadRules();
    }
    
    return Array.from(this.rules.values()).filter(rule => rule.hasTestRequirements);
  }
}

// Export singleton instance
export const mdcRulesLoader = new MDCRulesLoader();

// Command line usage
if (require.main === module) {
  const loader = new MDCRulesLoader();
  loader.loadRules();
  
  console.log('=========================================');
  console.log('LOADED MDC RULES');
  console.log('=========================================');
  
  const allRules = loader.getAllRules();
  console.log(`\nTotal Rules: ${allRules.length}`);
  
  console.log('\nEmotional Sovereignty Rules:');
  const emotionalRules = loader.getEmotionalSovereigntyRules();
  emotionalRules.forEach(rule => {
    console.log(`- ${rule.id}: ${rule.description}`);
  });
  
  console.log('\nTest-First Truth Rules:');
  const testRules = loader.getTestFirstTruthRules();
  testRules.forEach(rule => {
    console.log(`- ${rule.id}: ${rule.description}`);
  });
  
  console.log('\n=========================================');
} 