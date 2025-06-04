/**
 * fallbackRouter.ts
 * 
 * Purpose:
 * Routes recovery strategies based on failure type
 * Provides fallback mechanisms for prompt processing errors
 */

import { Logger } from '../../utils/logger';

const logger = new Logger('FallbackRouter');

/**
 * Routes a fallback based on failure type
 * @param type The type of failure
 * @param data The data associated with the failure
 * @returns A recovery attempt object
 */
export async function routeFallback(type: string, data: any): Promise<any> {
  logger.info('Routing fallback', { type, data });
  
  // Select strategy based on failure type
  const strategy = getStrategyForFailureType(type);
  
  // Log the fallback attempt
  logger.info('Fallback strategy selected', { 
    type, 
    strategy,
    dataKeys: Object.keys(data)
  });
  
  // Return recovery attempt
  return {
    success: false,
    strategy,
    timestamp: new Date().toISOString(),
    fallbackType: type,
    recoveryAttempted: true
  };
}

/**
 * Routes a failure to the appropriate handler
 * @param type The type of failure
 * @param data The data associated with the failure
 * @returns A recovery attempt object
 */
export async function routeFailure(type: string, data: any): Promise<any> {
  return routeFallback(type, data);
}

/**
 * Gets the appropriate strategy for a failure type
 * @param type The type of failure
 * @returns The strategy to use
 */
function getStrategyForFailureType(type: string): string {
  switch (type) {
    case 'validation':
      return 'validation_fallback';
    case 'scoring':
      return 'scoring_fallback';
    case 'emotional':
      return 'emotional_fallback';
    case 'processing_error':
      return 'error_fallback';
    case 'invalid_input':
      return 'invalid_input_fallback';
    default:
      return `${type}_fallback`;
  }
} 