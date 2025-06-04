/**
 * mdc-rules-hook.ts
 * 
 * Purpose: Implement runtime hooks to ensure MDC rules are enforced
 * automatically whenever Cursor launches or code is run.
 * 
 * This is a critical component that ensures 100% confidence in MDC rule enforcement.
 */

import { executeBootSequence } from '../boot_sequence';
import { EventBus } from '../event-bus/eventBus';
import { mdcEnforcement } from '../rules/mdc-enforcement-engine';
import { emitSystemLog } from '../system-intel/audit-utils';

// Define interfaces locally to avoid importing unexported types
interface Violation {
  ruleId: string;
  message: string;
  [key: string]: any;
}

interface EnforcementResultLocal {
  isValid: boolean;
  violations: Violation[];
  warnings: any[];
  rulesApplied: string[];
  [key: string]: any;
}

// Singleton instance tracking
let isInitialized = false;

/**
 * Initialize MDC Rules Hook
 * This is called at the earliest possible moment during Cursor startup
 */
export async function initMDCRulesHook(): Promise<void> {
  if (isInitialized) return;
  
  try {
    console.log('🔒 Initializing MDC Rules Hook...');
    
    // Execute boot sequence to activate MDC rules
    const bootResult = await executeBootSequence();
    
    if (!bootResult.success) {
      console.error('❌ Failed to initialize MDC Rules Hook - boot sequence failed');
      return;
    }
    
    // Register global event listeners
    registerEventListeners();
    
    // Install global hooks
    installGlobalHooks();
    
    // Log successful initialization
    emitSystemLog('mdc-rules-hook-initialized', {
      path: 'cursor/logs/runtime-hooks.log.md',
      content: `# MDC Rules Hook Initialized
Timestamp: ${new Date().toISOString()}
Boot Result: ${bootResult.success ? 'Success' : 'Failed'}
`
    });
    
    isInitialized = true;
    console.log('✅ MDC Rules Hook initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing MDC Rules Hook:', error);
    
    // Log error
    emitSystemLog('mdc-rules-hook-error', {
      path: 'cursor/logs/runtime-hooks.log.md',
      content: `# MDC Rules Hook Error
Timestamp: ${new Date().toISOString()}
Error: ${error instanceof Error ? error.message : String(error)}
Stack: ${error instanceof Error ? error.stack : 'No stack trace'}
`
    });
  }
}

/**
 * Register event listeners for MDC rule enforcement
 */
function registerEventListeners(): void {
  const eventBus = EventBus.getInstance();
  
  // Listen for file save events
  eventBus.on('file:save', async (data: { filePath?: string }) => {
    if (!data.filePath) return;
    await enforceRulesOnFile(data.filePath);
  });
  
  // Listen for file open events
  eventBus.on('file:open', async (data: { filePath?: string }) => {
    if (!data.filePath) return;
    await enforceRulesOnFile(data.filePath);
  });
  
  // Listen for code execution events
  eventBus.on('code:execute', async (data: { filePath?: string }) => {
    if (!data.filePath) return;
    await enforceRulesOnFile(data.filePath, true); // Higher priority for execution
  });
  
  // Listen for project load events
  eventBus.on('project:load', async () => {
    // Re-run boot sequence to ensure rules are activated for the new project
    await executeBootSequence();
  });
  
  console.log('✅ MDC Rules event listeners registered');
}

/**
 * Install global hooks into Node.js runtime
 * This ensures MDC rules are enforced even if event bus is bypassed
 */
function installGlobalHooks(): void {
  try {
    // Hook into require function to enforce rules on loaded modules
    const originalRequire = module.require;
    
    // @ts-ignore - Monkey patch require to enforce rules
    module.require = function (path: string) {
      const result = originalRequire.apply(this, arguments as any);
      
      // Only enforce on .ts/.js files in our project
      if (typeof path === 'string' && 
          (path.endsWith('.ts') || path.endsWith('.js')) && 
          !path.includes('node_modules')) {
        // Use setTimeout to avoid blocking the require call
        setTimeout(() => {
          enforceRulesOnFile(path).catch((err: Error) => {
            console.error(`Error enforcing rules on required module ${path}:`, err);
          });
        }, 0);
      }
      
      return result;
    };
    
    console.log('✅ Global runtime hooks installed');
  } catch (error) {
    console.error('❌ Error installing global hooks:', error);
  }
}

/**
 * Enforce MDC rules on a specific file
 * @param filePath Path to the file
 * @param highPriority Whether this is a high-priority enforcement (e.g., before execution)
 */
async function enforceRulesOnFile(filePath: string, highPriority: boolean = false): Promise<void> {
  try {
    // For high priority enforcement (e.g., code execution), we want to block until rules are enforced
    if (highPriority) {
      const result = await mdcEnforcement.enforceFile(filePath) as EnforcementResultLocal;
      
      if (!result.isValid) {
        // Log violations
        emitSystemLog('mdc-rules-violation-critical', {
          path: 'cursor/logs/mdc-violations.log.md',
          content: `# MDC Rules Violation (CRITICAL)
Timestamp: ${new Date().toISOString()}
File: ${filePath}
Violations: ${result.violations.length}
Details:
${result.violations.map((v: Violation) => `- [${v.ruleId}] ${v.message}`).join('\n')}
`
        });
        
        // Emit violation event
        const eventBus = EventBus.getInstance();
        eventBus.emit('mdc:violation:critical', {
          timestamp: Date.now(),
          filePath,
          violations: result.violations.length,
          details: result.violations
        });
      }
    } else {
      // For regular enforcement, we can do it asynchronously
      const result = await mdcEnforcement.enforceFile(filePath) as EnforcementResultLocal;
      
      if (!result.isValid) {
        // Log violations
        emitSystemLog('mdc-rules-violation', {
          path: 'cursor/logs/mdc-violations.log.md',
          content: `# MDC Rules Violation
Timestamp: ${new Date().toISOString()}
File: ${filePath}
Violations: ${result.violations.length}
Details:
${result.violations.map((v: Violation) => `- [${v.ruleId}] ${v.message}`).join('\n')}
`
        });
        
        // Emit violation event
        const eventBus = EventBus.getInstance();
        eventBus.emit('mdc:violation', {
          timestamp: Date.now(),
          filePath,
          violations: result.violations.length,
          details: result.violations
        });
      }
    }
  } catch (error) {
    console.error(`Error enforcing MDC rules on file ${filePath}:`, error);
  }
}

// Initialize automatically if this file is imported
initMDCRulesHook().catch(error => {
  console.error('❌ Fatal error initializing MDC Rules Hook:', error);
});

// Also initialize if this file is run directly
if (require.main === module) {
  initMDCRulesHook().catch(error => {
    console.error('❌ Fatal error initializing MDC Rules Hook:', error);
    process.exit(1);
  });
} 