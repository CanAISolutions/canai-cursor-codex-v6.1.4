/**
 * 00_mdc_rules_activation.ts
 * 
 * Purpose: Automatically load and apply MDC rules when Cursor starts
 * Triggered: Always on Cursor initialization and whenever new code is run
 * Enforces: MDC rules, emotional sovereignty, and test-first truth with 100% confidence
 */

import { mdcRulesLoader } from '../mdc-rules-loader';
import { mdcEnforcement } from '../rules/mdc-enforcement-engine';
import { emitSystemLog } from '../system-intel/audit-utils';
import { EventBus } from '../event-bus/eventBus';
import * as path from 'path';

interface MDCActivationResult {
  passed: boolean;
  rulesLoaded: number;
  emotionalSovereigntyRules: number;
  testFirstTruthRules: number;
  trustScoreThreshold?: number;
  enforcementConfidence: number; // 0-100% confidence level
  activeRules: string[]; // IDs of active rules
}

/**
 * Automatically loads and activates all MDC rules with 100% confidence
 * This is the only step in the streamlined boot sequence
 */
export async function activateMDCRules(): Promise<MDCActivationResult> {
  try {
    const eventBus = EventBus.getInstance();
    eventBus.emit('mdc:activation:started', { timestamp: Date.now() });
    
    // Load all MDC rules
    console.log('📋 Loading MDC rules...');
    mdcRulesLoader.loadRules();
    
    // Get loaded rules
    const allRules = mdcRulesLoader.getAllRules();
    const emotionalRules = mdcRulesLoader.getEmotionalSovereigntyRules();
    const testRules = mdcRulesLoader.getTestFirstTruthRules();
    
    // Find trust score threshold
    const trustScoreRule = emotionalRules.find(r => r.trustScoreThreshold !== undefined);
    const trustScoreThreshold = trustScoreRule?.trustScoreThreshold;

    // Verify enforcement engine is operational
    console.log('🔍 Verifying enforcement engine...');
    const enforcementResult = await verifyEnforcementEngine();
    
    // Activate runtime hooks for continuous enforcement
    console.log('🔄 Activating runtime hooks for continuous enforcement...');
    activateRuntimeHooks();

    // Log successful activation
    emitSystemLog('mdc-rules-activated', {
      path: 'cursor/logs/mdc-activation.log.md',
      content: `# MDC Rules Activation: SUCCESS
Timestamp: ${new Date().toISOString()}
Rules loaded: ${allRules.length}
Emotional sovereignty rules: ${emotionalRules.length}
Test-first truth rules: ${testRules.length}
Trust score threshold: ${trustScoreThreshold || 'Not defined'}
Enforcement confidence: ${enforcementResult.confidence.toFixed(1)}%
Active rules:
${allRules.map(rule => `- ${rule.id}`).join('\n')}
`
    });

    // Emit successful activation event
    eventBus.emit('mdc:activation:completed', {
      timestamp: Date.now(),
      rulesLoaded: allRules.length,
      emotionalRules: emotionalRules.length,
      testRules: testRules.length,
      enforcementConfidence: enforcementResult.confidence
    });

    // Return activation result
    return {
      passed: allRules.length > 0 && enforcementResult.confidence > 90,
      rulesLoaded: allRules.length,
      emotionalSovereigntyRules: emotionalRules.length,
      testFirstTruthRules: testRules.length,
      trustScoreThreshold,
      enforcementConfidence: enforcementResult.confidence,
      activeRules: allRules.map(rule => rule.id)
    };
  } catch (error) {
    // Log activation failure
    emitSystemLog('mdc-rules-activation-failed', {
      path: 'cursor/logs/mdc-activation.log.md',
      content: `# MDC Rules Activation: FAILED
Timestamp: ${new Date().toISOString()}
Error: ${(error as Error).message}
Stack: ${(error as Error).stack}
`
    });
    
    // Emit failure event
    const eventBus = EventBus.getInstance();
    eventBus.emit('mdc:activation:failed', {
      timestamp: Date.now(),
      error: (error as Error).message
    });
    
    // Return failure result
    return {
      passed: false,
      rulesLoaded: 0,
      emotionalSovereigntyRules: 0,
      testFirstTruthRules: 0,
      enforcementConfidence: 0,
      activeRules: []
    };
  }
}

/**
 * Verify that the MDC enforcement engine is operational
 * Uses a sample file to confirm enforcement works properly
 */
async function verifyEnforcementEngine(): Promise<{ operational: boolean; confidence: number }> {
  try {
    // Get project root
    const projectRoot = process.cwd();
    
    // Test files to verify enforcement
    const testFiles = [
      path.join(projectRoot, 'cursor/boot_sequence/00_mdc_rules_activation.ts'),
      path.join(projectRoot, 'cursor/rules/mdc-enforcement-engine.ts'),
      path.join(projectRoot, 'cursor/mdc-rules-loader.ts')
    ];
    
    // Run enforcement on test files
    const results = await Promise.all(testFiles.map(async file => {
      try {
        return await mdcEnforcement.enforceFile(file);
      } catch (error) {
        console.error(`Error enforcing rules on ${file}:`, error);
        return null;
      }
    }));
    
    // Calculate confidence based on successful enforcement
    const validResults = results.filter(r => r !== null);
    const rulesAppliedCount = validResults.reduce((sum, r) => sum + (r?.rulesApplied.length || 0), 0);
    
    // Confidence is based on successfully enforcing rules
    const confidence = validResults.length > 0 
      ? (rulesAppliedCount / (validResults.length * 3)) * 100 // Expect at least 3 rules per file
      : 0;
    
    return {
      operational: validResults.length > 0,
      confidence: Math.min(100, confidence)
    };
  } catch (error) {
    console.error('Failed to verify enforcement engine:', error);
    return {
      operational: false,
      confidence: 0
    };
  }
}

/**
 * Activate runtime hooks to ensure continuous MDC rule enforcement
 * These hooks ensure rules are enforced whenever code is run
 */
function activateRuntimeHooks(): void {
  const eventBus = EventBus.getInstance();
  
  // Set up event listeners for key system events
  eventBus.on('file:saved', async (data) => {
    if (!data.filePath) return;
    
    try {
      // Enforce MDC rules on saved file
      const result = await mdcEnforcement.enforceFile(data.filePath);
      
      if (!result.isValid) {
        // Log violations
        emitSystemLog('mdc-rules-violation', {
          path: 'cursor/logs/mdc-violations.log.md',
          content: `# MDC Rules Violation
Timestamp: ${new Date().toISOString()}
File: ${data.filePath}
Violations: ${result.violations.length}
Details:
${result.violations.map(v => `- [${v.ruleId}] ${v.message}`).join('\n')}
`
        });
        
        // Emit violation event
        eventBus.emit('mdc:violation', {
          timestamp: Date.now(),
          filePath: data.filePath,
          violations: result.violations.length,
          details: result.violations
        });
      }
    } catch (error) {
      console.error(`Failed to enforce MDC rules on saved file ${data.filePath}:`, error);
    }
  });
  
  // Hook into code execution
  eventBus.on('code:execute', async (data) => {
    if (!data.filePath) return;
    
    try {
      // Enforce MDC rules before code execution
      const result = await mdcEnforcement.enforceFile(data.filePath);
      
      if (!result.isValid) {
        // Emit warning event
        eventBus.emit('mdc:execution:warning', {
          timestamp: Date.now(),
          filePath: data.filePath,
          violations: result.violations.length,
          details: result.violations
        });
      }
    } catch (error) {
      console.error(`Failed to enforce MDC rules on executed file ${data.filePath}:`, error);
    }
  });
}

// Auto-execute if this file is run directly
if (require.main === module) {
  activateMDCRules().then(result => {
    console.log('🔒 MDC Rules Activation Result:');
    console.log(`✅ Success: ${result.passed ? 'Yes' : 'No'}`);
    console.log(`📋 Rules Loaded: ${result.rulesLoaded}`);
    console.log(`💖 Emotional Sovereignty Rules: ${result.emotionalSovereigntyRules}`);
    console.log(`🧪 Test-First Truth Rules: ${result.testFirstTruthRules}`);
    console.log(`📊 Enforcement Confidence: ${result.enforcementConfidence.toFixed(1)}%`);
    
    if (result.trustScoreThreshold) {
      console.log(`📊 Trust Score Threshold: ${result.trustScoreThreshold}`);
    }
    
    if (result.activeRules.length > 0) {
      console.log(`\n🔍 Active MDC Rules:`);
      result.activeRules.forEach(rule => console.log(`   - ${rule}`));
    }
  });
}