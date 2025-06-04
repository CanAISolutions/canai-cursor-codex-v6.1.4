/**
 * Self-Check Script for Cursor
 * 
 * Purpose:
 * Quickly check if a response meets MDC rules and tracking awareness standards
 * To be used by Cursor before finalizing responses
 */

// Simple self-check function - can be imported or run directly
function selfCheck(response) {
  const checks = {
    mdcRules: checkMDCRules(response),
    trackingAwareness: checkTrackingAwareness(response),
    criticalPriorityAwareness: checkCriticalPriorityAwareness(response)
  };
  
  return {
    passed: checks.mdcRules.passed && checks.trackingAwareness.passed && checks.criticalPriorityAwareness.passed,
    checks,
    summary: generateSummary(checks)
  };
}

// Check MDC rules compliance
function checkMDCRules(response) {
  const trustScoreThreshold = 4.2;
  let trustScore = 3.0; // Base score
  
  // Positive indicators
  if (response.includes('trust')) trustScore += 0.3;
  if (response.includes('empower') || response.includes('capable')) trustScore += 0.4;
  if (response.includes('understand') || response.includes('help')) trustScore += 0.3;
  if (response.includes('solution') || response.includes('resolve')) trustScore += 0.2;
  if (response.includes('support') || response.includes('guide')) trustScore += 0.2;
  if (response.includes('clear') || response.includes('specific')) trustScore += 0.2;
  
  // Negative indicators
  if (response.includes('error') && !response.includes('resolve')) trustScore -= 0.2;
  if (response.includes('fail') && !response.includes('solution')) trustScore -= 0.2;
  if (response.includes('cannot') || response.includes('unable')) trustScore -= 0.2;
  if (response.includes('sorry') || response.includes('apologize')) trustScore -= 0.1;
  
  trustScore = Math.min(5.0, Math.max(1.0, trustScore));
  
  // Check empowerment language
  const empowermentPatterns = [
    'empower', 'capable', 'confidence', 'potential', 'support', 
    'guidance', 'clarity', 'help', 'understand', 'trust'
  ];
  
  const empowermentCount = empowermentPatterns.filter(pattern => 
    response.toLowerCase().includes(pattern)).length;
  
  const sacredReversalPassed = empowermentCount >= 2;
  
  // Check for console.log statements
  const hasConsoleLog = response.includes('console.log');
  
  // Check for placeholder comments
  const hasPlaceholders = response.includes('TODO') || response.includes('FIXME');
  
  return {
    passed: trustScore >= trustScoreThreshold && sacredReversalPassed && !hasConsoleLog && !hasPlaceholders,
    trustScore,
    sacredReversalPassed,
    hasConsoleLog,
    hasPlaceholders,
    empowermentCount
  };
}

// Check tracking awareness
function checkTrackingAwareness(response) {
  // Check awareness of verification log
  const hasVerificationLogAwareness = response.includes('VERIFICATION-ACTIONS-LOG.md') || 
                                     response.includes('verification-hub') ||
                                     response.includes('verification log');
  
  // Check awareness of auto-actions log
  const hasAutoActionsLogAwareness = response.includes('auto-actions.log.md') || 
                                   response.includes('auto-actions log');
  
  // Check awareness of archives
  const hasArchiveAwareness = response.includes('cursor/logs/') || 
                            response.includes('log archives') ||
                            response.includes('log history');
  
  return {
    passed: hasVerificationLogAwareness || hasAutoActionsLogAwareness || hasArchiveAwareness,
    hasVerificationLogAwareness,
    hasAutoActionsLogAwareness,
    hasArchiveAwareness
  };
}

// Check critical priority awareness
function checkCriticalPriorityAwareness(response) {
  // Current critical priority from verification log
  const criticalPriority = "EXPANDED CODEX BREACH: Replace All Non-Production Code";
  
  const hasCriticalPriorityAwareness = response.includes(criticalPriority) || 
                                     response.includes('console.log statements') ||
                                     response.includes('stub implementation') ||
                                     response.includes('placeholder');
  
  return {
    passed: hasCriticalPriorityAwareness,
    hasCriticalPriorityAwareness
  };
}

// Generate summary
function generateSummary(checks) {
  const { mdcRules, trackingAwareness, criticalPriorityAwareness } = checks;
  
  const summaryLines = [];
  
  // MDC Rules summary
  if (mdcRules.passed) {
    summaryLines.push('✅ Passes MDC rules compliance');
  } else {
    summaryLines.push('❌ Fails MDC rules compliance:');
    if (mdcRules.trustScore < 4.2) {
      summaryLines.push(`  - Trust score ${mdcRules.trustScore.toFixed(1)} below threshold 4.2`);
    }
    if (!mdcRules.sacredReversalPassed) {
      summaryLines.push('  - Fails Sacred Reversal Test (not enough empowerment language)');
    }
    if (mdcRules.hasConsoleLog) {
      summaryLines.push('  - Contains console.log statements');
    }
    if (mdcRules.hasPlaceholders) {
      summaryLines.push('  - Contains placeholder comments (TODO/FIXME)');
    }
  }
  
  // Tracking awareness summary
  if (trackingAwareness.passed) {
    summaryLines.push('✅ Demonstrates tracking awareness');
  } else {
    summaryLines.push('❌ Lacks tracking awareness:');
    if (!trackingAwareness.hasVerificationLogAwareness) {
      summaryLines.push('  - No reference to verification log');
    }
    if (!trackingAwareness.hasAutoActionsLogAwareness) {
      summaryLines.push('  - No reference to auto-actions log');
    }
    if (!trackingAwareness.hasArchiveAwareness) {
      summaryLines.push('  - No awareness of log archives');
    }
  }
  
  // Critical priority awareness summary
  if (criticalPriorityAwareness.passed) {
    summaryLines.push('✅ Aware of current critical priority');
  } else {
    summaryLines.push('❌ Not aware of current critical priority');
  }
  
  return summaryLines.join('\n');
}

// Direct usage example
if (require.main === module) {
  // Sample response to check
  const sampleResponse = `
    I'll help you implement the feature for tracking user preferences.
    This will empower users by giving them more control over their experience.
    The solution should integrate with our existing tracking system and ensure
    all data is properly validated.
    
    According to our VERIFICATION-ACTIONS-LOG.md, we need to focus on replacing
    non-production code like console.log statements and stub implementations.
    I'll make sure to follow proper practices from our auto-actions.log.md history.
  `;
  
  const result = selfCheck(sampleResponse);
  
  console.log('SELF-CHECK RESULTS:');
  console.log('===================');
  console.log(`Overall: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('\nDetailed Results:');
  console.log(result.summary);
}

// Export for use in other modules
module.exports = {
  selfCheck,
  checkMDCRules,
  checkTrackingAwareness,
  checkCriticalPriorityAwareness
}; 