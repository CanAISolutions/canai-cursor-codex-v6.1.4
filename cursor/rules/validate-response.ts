/**
 * MDC Rule Validation for AI Responses
 * 
 * Purpose: 
 * Validate AI responses against MDC rules before sending to users
 * Ensures emotional sovereignty and trust transparency standards
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Simple Sacred Reversal Test validator
function performSacredReversalTest(text: string): boolean {
  // Check for empowerment language
  const empowermentPatterns = [
    'empower', 'capable', 'confidence', 'potential', 'support', 
    'guidance', 'clarity', 'help', 'understand', 'trust'
  ];
  
  // Check for problematic language
  const problematicPatterns = [
    'cannot', 'unable', 'impossible', 'fail', 'error', 'wrong',
    'incorrect', 'bad', 'sorry', 'apologize', 'fault'
  ];
  
  // Count empowerment vs problematic language
  const empowermentCount = empowermentPatterns.filter(pattern => 
    text.toLowerCase().includes(pattern)).length;
  
  const problematicCount = problematicPatterns.filter(pattern => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    return regex.test(text.toLowerCase());
  }).length;
  
  // Calculate ratio (with minimum counts to avoid division by zero)
  const ratio = (empowermentCount + 1) / (problematicCount + 1);
  
  // Pass if ratio is higher than threshold
  return ratio >= 2.0;
}

// Calculate trust score
function calculateTrustScore(text: string): number {
  let score = 3.0; // Base score
  
  // Positive indicators
  if (text.includes('trust')) score += 0.3;
  if (text.includes('empower') || text.includes('capable')) score += 0.4;
  if (text.includes('understand') || text.includes('help')) score += 0.3;
  if (text.includes('solution') || text.includes('resolve')) score += 0.2;
  if (text.includes('support') || text.includes('guide')) score += 0.2;
  if (text.includes('clear') || text.includes('specific')) score += 0.2;
  if (text.includes('improve') || text.includes('enhance')) score += 0.2;
  
  // Negative indicators
  if (text.includes('error') && !text.includes('resolve')) score -= 0.2;
  if (text.includes('fail') && !text.includes('solution')) score -= 0.2;
  if (text.includes('cannot') || text.includes('unable')) score -= 0.2;
  if (text.includes('sorry') || text.includes('apologize')) score -= 0.1;
  
  return Math.min(5.0, Math.max(1.0, score));
}

// Main validation function
export function validateResponse(text: string): {
  isValid: boolean;
  trustScore: number;
  sacredReversalPassed: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Calculate trust score
  const trustScore = calculateTrustScore(text);
  if (trustScore < 4.2) {
    issues.push(`Trust score ${trustScore.toFixed(1)} below threshold 4.2`);
  }
  
  // Perform Sacred Reversal Test
  const sacredReversalPassed = performSacredReversalTest(text);
  if (!sacredReversalPassed) {
    issues.push('Failed Sacred Reversal Test - not enough empowerment language');
  }
  
  // Check for console.log statements
  if (text.includes('console.log')) {
    issues.push('Contains console.log statements - not allowed in production');
  }
  
  // Check for placeholder comments
  if (text.includes('TODO') || text.includes('FIXME')) {
    issues.push('Contains placeholder comments (TODO/FIXME) - not allowed in production');
  }
  
  return {
    isValid: issues.length === 0,
    trustScore,
    sacredReversalPassed,
    issues
  };
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node validate-response.ts <text or file path>');
    process.exit(1);
  }
  
  let text = args[0];
  
  // Check if input is a file path
  if (text.endsWith('.txt') || text.endsWith('.md')) {
    try {
      text = readFileSync(text, 'utf-8');
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      process.exit(1);
    }
  }
  
  const result = validateResponse(text);
  
  console.log('=========================================');
  console.log('MDC RULE VALIDATION RESULTS');
  console.log('=========================================');
  console.log(`Valid: ${result.isValid ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Trust Score: ${result.trustScore.toFixed(1)}/5.0 ${result.trustScore >= 4.2 ? '✅' : '❌'}`);
  console.log(`Sacred Reversal Test: ${result.sacredReversalPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (result.issues.length > 0) {
    console.log('\nIssues found:');
    result.issues.forEach(issue => {
      console.log(`  - ${issue}`);
    });
    console.log('\nPlease revise your response to address these issues.');
  } else {
    console.log('\n✅ Response complies with all MDC rules and emotional sovereignty standards.');
  }
} 