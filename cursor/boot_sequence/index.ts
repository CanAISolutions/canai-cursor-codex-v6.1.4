/**
 * index.ts - Streamlined Boot Sequence
 * 
 * Purpose: Single-focus boot sequence that prioritizes MDC rules enforcement
 * This simplified boot sequence focuses exclusively on ensuring MDC rules
 * are loaded and enforced immediately upon startup.
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../system-intel/audit-utils';

// Import only the MDC rules activation step
import { activateMDCRules } from './00_mdc_rules_activation';

// Define boot sequence with only MDC rules activation
export const bootSequence = [
  '00_mdc_rules_activation'
];

interface BootResult {
  success: boolean;
  message: string;
  timestamp: number;
  details?: any;
}

/**
 * Execute the simplified boot sequence
 * Focuses solely on MDC rules activation
 */
export async function executeBootSequence(): Promise<BootResult> {
  console.log('🚀 Starting simplified boot sequence: MDC Rules Activation');
  const startTime = performance.now();
  const eventBus = EventBus.getInstance();
  
  try {
    // Emit boot started event
    eventBus.emit('boot:started', { 
      timestamp: Date.now(),
      mode: 'mdc-only' 
    });
    
    // Execute MDC rules activation
    console.log('🔒 Activating MDC Rules...');
    const result = await activateMDCRules();
    
    if (!result.passed) {
      const errorMessage = 'MDC Rules activation failed - critical boot error';
      console.error(`❌ ${errorMessage}`);
      
      // Emit boot failed event
      eventBus.emit('boot:failed', {
        step: 'mdc-rules-activation',
        message: errorMessage,
        timestamp: Date.now()
      });
      
      // Log failure
      emitSystemLog('boot-sequence-failed', {
        path: 'cursor/logs/boot-sequence.log.md',
        content: `# Boot Sequence Failed
Timestamp: ${new Date().toISOString()}
Step: MDC Rules Activation
Error: Rules activation failed
`
      });
      
      return {
        success: false,
        message: errorMessage,
        timestamp: Date.now(),
        details: result
      };
    }
    
    // MDC Rules activated successfully
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Emit boot completed event
    eventBus.emit('boot:completed', {
      success: true,
      timestamp: Date.now(),
      duration,
      details: result
    });
    
    // Log success
    emitSystemLog('boot-sequence-completed', {
      path: 'cursor/logs/boot-sequence.log.md',
      content: `# Boot Sequence Completed Successfully
Timestamp: ${new Date().toISOString()}
Duration: ${duration.toFixed(2)}ms
MDC Rules Loaded: ${result.rulesLoaded}
Emotional Sovereignty Rules: ${result.emotionalSovereigntyRules}
Test-First Truth Rules: ${result.testFirstTruthRules}
Trust Score Threshold: ${result.trustScoreThreshold || 'Not defined'}
`
    });
    
    console.log(`✅ Boot sequence completed successfully in ${duration.toFixed(2)}ms`);
    console.log(`📊 MDC Rules loaded: ${result.rulesLoaded}`);
    
    return {
      success: true,
      message: 'Boot sequence completed successfully',
      timestamp: Date.now(),
      details: {
        duration,
        mdcRules: result
      }
    };
  } catch (error) {
    const errorMessage = `Boot sequence failed with error: ${error instanceof Error ? error.message : String(error)}`;
    console.error(`❌ ${errorMessage}`);
    
    // Emit boot error event
    eventBus.emit('boot:error', {
      error: errorMessage,
      timestamp: Date.now()
    });
    
    // Log error
    emitSystemLog('boot-sequence-error', {
      path: 'cursor/logs/boot-sequence.log.md',
      content: `# Boot Sequence Error
Timestamp: ${new Date().toISOString()}
Error: ${error instanceof Error ? error.message : String(error)}
`
    });
    
    return {
      success: false,
      message: errorMessage,
      timestamp: Date.now()
    };
  }
}

// Auto-execute if this file is run directly
if (require.main === module) {
  executeBootSequence().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('Fatal boot sequence error:', error);
    process.exit(1);
  });
} 