/**
 * MDC Validator Utility
 * 
 * Purpose:
 * Provides utility functions to validate content against MDC rules
 * Ensures responses meet emotional sovereignty and trust transparency standards
 */

import { validateResponse } from '../rules/validate-response';

/**
 * Validates text content against MDC rules
 * 
 * @param content - The text content to validate
 * @returns Validation result with details
 */
export function validateAgainstMDCRules(content: string): {
  isValid: boolean;
  trustScore: number;
  sacredReversalPassed: boolean;
  issues: string[];
  suggestedImprovements?: string[];
} {
  // Use the core validation function
  const result = validateResponse(content);
  
  // Generate improvement suggestions
  const suggestedImprovements: string[] = [];
  
  if (!result.sacredReversalPassed) {
    suggestedImprovements.push(
      'Add more empowerment language (capable, confident, support, guidance, clarity, etc.)'
    );
  }
  
  if (result.trustScore < 4.2) {
    suggestedImprovements.push(
      'Increase trust building language and remove problematic terminology'
    );
  }
  
  if (content.includes('console.log')) {
    suggestedImprovements.push(
      'Remove console.log statements from production code'
    );
  }
  
  if (content.includes('TODO') || content.includes('FIXME')) {
    suggestedImprovements.push(
      'Replace TODO/FIXME comments with actual implementations'
    );
  }
  
  return {
    isValid: result.isValid,
    trustScore: result.trustScore,
    sacredReversalPassed: result.sacredReversalPassed,
    issues: result.issues,
    suggestedImprovements: suggestedImprovements.length > 0 ? suggestedImprovements : undefined
  };
}

/**
 * Simple function to check if content meets minimum MDC requirements
 * 
 * @param content - The text content to check
 * @returns Whether the content meets minimum MDC requirements
 */
export function quickMDCCheck(content: string): boolean {
  // Calculate trust score (simplified version)
  let trustScore = 3.0; // Base score
  
  // Positive indicators
  if (content.includes('trust')) trustScore += 0.3;
  if (content.includes('empower') || content.includes('capable')) trustScore += 0.4;
  if (content.includes('understand') || content.includes('help')) trustScore += 0.3;
  if (content.includes('solution') || content.includes('resolve')) trustScore += 0.2;
  if (content.includes('support') || content.includes('guide')) trustScore += 0.2;
  
  // Negative indicators
  if (content.includes('error') && !content.includes('resolve')) trustScore -= 0.2;
  if (content.includes('fail') && !content.includes('solution')) trustScore -= 0.2;
  if (content.includes('cannot') || content.includes('unable')) trustScore -= 0.2;
  
  // Check for console.log statements
  if (content.includes('console.log')) {
    return false;
  }
  
  // Check for placeholder comments
  if (content.includes('TODO') || content.includes('FIXME')) {
    return false;
  }
  
  // Return whether it meets minimum requirements
  return trustScore >= 4.2;
}

// Export a singleton instance for easy access
export const mdcValidator = {
  validate: validateAgainstMDCRules,
  quickCheck: quickMDCCheck
}; 