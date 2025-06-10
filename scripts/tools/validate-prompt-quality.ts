#!/usr/bin/env ts-node

/**
 * AI Prompt Quality Validation Script
 * Validates prompt effectiveness, emotional sovereignty, and test-first truth compliance
 * Based on AI Prompt Engineering Best Practices Implementation Plan
 */

// File system imports available if needed for file operations

interface QualityMetrics {
  clarity: number;
  completeness: number;
  effectiveness: number;
  emotionalIntelligence: number;
  firstTrySuccess: number;
  trustScore: number;
}

interface ValidationResult {
  passed: boolean;
  score: number;
  metrics: QualityMetrics;
  issues: string[];
  recommendations: string[];
  sacredReversalTest: boolean;
  testFirstTruthCompliance: boolean;
}

class PromptQualityValidator {
  private qualityThresholds = {
    clarity: 8.0,
    completeness: 9.0,
    effectiveness: 8.5,
    emotionalIntelligence: 9.2,
    firstTrySuccess: 90.0,
    trustScore: 4.2
  };

  /**
   * Validates a prompt interaction against quality standards
   */
  async validatePromptInteraction(
    prompt: string,
    response: string,
    context?: {
      fileChanged?: string;
      linesChanged?: string;
      testEvidence?: any;
      userFeedback?: any;
    }
  ): Promise<ValidationResult> {
    const metrics = await this.calculateMetrics(prompt, response, context);
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Validate format compliance
    if (!this.validateResponseFormat(response)) {
      issues.push('Response format does not comply with line_start:line_end:filename standard');
      recommendations.push('Ensure response uses proper citation format');
    }

    // Validate emotional sovereignty
    const sacredReversalTest = this.validateSacredReversalTest(prompt, response);
    if (!sacredReversalTest) {
      issues.push('Failed Sacred Reversal Test - does not honor user sovereignty');
      recommendations.push('Enhance empathy and user empowerment in response');
    }

    // Validate test-first truth
    const testFirstTruthCompliance = this.validateTestFirstTruth(context);
    if (!testFirstTruthCompliance) {
      issues.push('Test-First Truth violation - no test evidence provided');
      recommendations.push('Include test validation evidence for all changes');
    }

    // Check quality thresholds
    Object.entries(this.qualityThresholds).forEach(([metric, threshold]) => {
      if (metrics[metric as keyof QualityMetrics] < threshold) {
        issues.push(`${metric} score ${metrics[metric as keyof QualityMetrics]} below threshold ${threshold}`);
        recommendations.push(`Improve ${metric} to meet quality standards`);
      }
    });

    const overallScore = this.calculateOverallScore(metrics);
    const passed = issues.length === 0 && overallScore >= 8.5;

    return {
      passed,
      score: overallScore,
      metrics,
      issues,
      recommendations,
      sacredReversalTest,
      testFirstTruthCompliance
    };
  }

  /**
   * Validates response format compliance
   */
  private validateResponseFormat(response: string): boolean {
    // Check for line:line:filename format
    const formatRegex = /\d+:\d+:[\w\-_./]+/;
    
    // Check for intent summary
    const hasIntent = response.toLowerCase().includes('intent:');
    
    // Check for minimal changes indicator
    const hasMinimalChanges = response.includes('// ... existing code') || 
                             response.includes('... existing code ...');

    return formatRegex.test(response) && hasIntent && hasMinimalChanges;
  }

  /**
   * Validates Sacred Reversal Test compliance
   */
  private validateSacredReversalTest(prompt: string, response: string): boolean {
    // Check for empowering language
    const empoweringWords = ['empower', 'enhance', 'improve', 'build', 'strengthen', 'honor'];
    const hasEmpoweringLanguage = empoweringWords.some(word => 
      response.toLowerCase().includes(word)
    );

    // Check for recognition of user expertise
    const recognitionWords = ['existing', 'current', 'your', 'preserv', 'maintain'];
    const hasRecognition = recognitionWords.some(word => 
      response.toLowerCase().includes(word)
    );

    // Check for absence of dismissive language
    const dismissiveWords = ['wrong', 'bad', 'incorrect', 'should not', 'must not'];
    const hasDismissiveLanguage = dismissiveWords.some(word => 
      response.toLowerCase().includes(word)
    );

    return hasEmpoweringLanguage && hasRecognition && !hasDismissiveLanguage;
  }

  /**
   * Validates Test-First Truth compliance
   */
  private validateTestFirstTruth(context?: any): boolean {
    if (!context) return false;
    
    // Check for test evidence
    const hasTestEvidence = context.testEvidence && 
                           (context.testEvidence.testFiles || 
                            context.testEvidence.testResults);

    // Check for validation approach mentioned
    const hasValidationPlan = context.validationApproach || 
                             context.testingStrategy;

    return hasTestEvidence || hasValidationPlan;
  }

  /**
   * Calculates quality metrics
   */
  private async calculateMetrics(
    prompt: string, 
    response: string, 
    context?: any
  ): Promise<QualityMetrics> {
    // Simulated metric calculations - in real implementation, 
    // these would use more sophisticated analysis
    
    const clarity = this.calculateClarity(prompt, response);
    const completeness = this.calculateCompleteness(prompt, response);
    const effectiveness = this.calculateEffectiveness(context);
    const emotionalIntelligence = this.calculateEmotionalIntelligence(response);
    const firstTrySuccess = context?.userFeedback?.firstTrySuccess === true ? 95 : 
                          context?.userFeedback?.firstTrySuccess || 85;
    const trustScore = context?.trustMetrics?.score || 4.0;

    return {
      clarity,
      completeness,
      effectiveness,
      emotionalIntelligence,
      firstTrySuccess,
      trustScore
    };
  }

  private calculateClarity(prompt: string, response: string): number {
    // Simple clarity assessment based on response structure
    const hasStructure = response.includes('Intent:') && 
                        response.includes('Rationale:');
    const isSpecific = response.length > 100 && response.length < 2000;
    const hasCodeExamples = response.includes('```');
    const hasExplanations = response.includes('// ');
    
    let score = 6.0;
    if (hasStructure) score += 1.5;
    if (isSpecific) score += 0.5;
    if (hasCodeExamples) score += 0.5;
    if (hasExplanations) score += 0.5;
    
    return Math.min(score, 10.0);
  }

  private calculateCompleteness(prompt: string, response: string): number {
    // Check if response addresses all aspects of prompt
    const promptWords = prompt.toLowerCase().split(' ');
    const responseWords = response.toLowerCase().split(' ');
    
    const addressedConcepts = promptWords.filter(word => 
      responseWords.includes(word) && word.length > 3
    ).length;
    
    const completenessRatio = addressedConcepts / Math.max(promptWords.length, 1);
    return Math.min(completenessRatio * 10, 10);
  }

  private calculateEffectiveness(context?: any): number {
    // Based on user feedback and actual results
    if (context?.userFeedback?.worked) return 9.0;
    if (context?.testResults?.passed) return 8.5;
    return 7.0; // Default when no evidence available
  }

  private calculateEmotionalIntelligence(response: string): number {
    const empoweringPhrases = [
      'builds on your', 'enhances your', 'preserves your',
      'honors your', 'strengthens your', 'improves your existing',
      'while honoring', 'empowering your', 'while preserving',
      'builds on', 'enhances', 'strengthens', 'honors'
    ];
    
    const empoweringCount = empoweringPhrases.filter(phrase => 
      response.toLowerCase().includes(phrase)
    ).length;

    // Base score + bonus for empowering language
    const baseScore = 8.0;
    const bonusScore = empoweringCount * 0.3;
    
    return Math.min(baseScore + bonusScore, 10.0);
  }

  private calculateOverallScore(metrics: QualityMetrics): number {
    const weights = {
      clarity: 0.15,
      completeness: 0.20,
      effectiveness: 0.25,
      emotionalIntelligence: 0.25,
      firstTrySuccess: 0.10,
      trustScore: 0.05
    };

    return Object.entries(weights).reduce((total, [metric, weight]) => {
      const rawScore = metrics[metric as keyof QualityMetrics];
      const normalizedScore = metric === 'trustScore' ? 
        (rawScore / 5.0) * 10 : // Normalize 5.0 scale to 10 scale
        metric === 'firstTrySuccess' ?
        rawScore / 10 : // Normalize percentage to 10 scale
        rawScore; // Already on 10 scale
      return total + (normalizedScore * weight);
    }, 0);
  }

  /**
   * Generates validation report
   */
  generateReport(result: ValidationResult): string {
    const timestamp = new Date().toISOString();
    
    return `
# Prompt Quality Validation Report
**Generated**: ${timestamp}
**Overall Score**: ${result.score.toFixed(1)}/10
**Status**: ${result.passed ? '✅ PASSED' : '❌ FAILED'}

## Quality Metrics
- **Clarity**: ${result.metrics.clarity.toFixed(1)}/10
- **Completeness**: ${result.metrics.completeness.toFixed(1)}/10  
- **Effectiveness**: ${result.metrics.effectiveness.toFixed(1)}/10
- **Emotional Intelligence**: ${result.metrics.emotionalIntelligence.toFixed(1)}/10
- **First-Try Success**: ${result.metrics.firstTrySuccess.toFixed(1)}%
- **Trust Score**: ${result.metrics.trustScore.toFixed(1)}/5.0

## Compliance Checks
- **Sacred Reversal Test**: ${result.sacredReversalTest ? '✅ PASSED' : '❌ FAILED'}
- **Test-First Truth**: ${result.testFirstTruthCompliance ? '✅ PASSED' : '❌ FAILED'}

## Issues Identified
${result.issues.length > 0 ? result.issues.map(issue => `- ${issue}`).join('\n') : 'No issues found'}

## Recommendations
${result.recommendations.length > 0 ? result.recommendations.map(rec => `- ${rec}`).join('\n') : 'No recommendations needed'}

---
*Validation completed using AI Prompt Engineering Best Practices Framework v5.2.0*
`;
  }
}

// CLI interface - can be enabled for command line usage
// Example usage: ts-node validate-prompt-quality.ts <prompt-file> <response-file>

async function main() {
  console.log('🌟 AI Prompt Quality Validation Framework v5.2.0');
  console.log('==================================================');
  
  const validator = new PromptQualityValidator();
  
  // For now, run a sample validation to demonstrate the framework
  const samplePrompt = "Please help me improve this function to handle edge cases better with proper error handling and input validation.";
  const sampleResponse = `Intent: Enhance function robustness with comprehensive error handling while preserving your existing architecture

I'll improve your function to handle edge cases better while honoring your current implementation approach. This enhancement builds on your existing logic and strengthens the robustness you're seeking:

\`\`\`12:25:src/utils/helper.ts
// ... existing code ...
function improveFunction(input: any): ProcessedResult | null {
  // Enhanced validation that preserves your design
  if (!input) return null;
  if (typeof input !== 'object') return null;
  
  try {
    // Your existing core logic enhanced
    const processedResult = processInput(input);
    return processedResult;
  } catch (error) {
    // Graceful error handling
    console.error('Processing failed:', error);
    return null;
  }
}
// ... existing code ...
\`\`\`

Rationale: This enhancement builds on your existing approach while strengthening error handling and edge case management. It honors your current architecture while empowering your function with the robustness you need for production use.`;

  const context = {
    testEvidence: {
      testFiles: ['test/helper.test.ts'],
      testResults: { passed: true, coverage: 95 }
    },
    userFeedback: {
      firstTrySuccess: true,
      worked: true
    },
    trustMetrics: {
      score: 4.5
    }
  };

  try {
    const result = await validator.validatePromptInteraction(samplePrompt, sampleResponse, context);
    
    console.log('\n📊 Validation Results:');
    console.log('======================');
    console.log(`Overall Score: ${result.score.toFixed(1)}/10`);
    console.log(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Sacred Reversal Test: ${result.sacredReversalTest ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Test-First Truth: ${result.testFirstTruthCompliance ? '✅ PASSED' : '❌ FAILED'}`);
    
    console.log('\n📈 Quality Metrics:');
    console.log('==================');
    console.log(`- Clarity: ${result.metrics.clarity.toFixed(1)}/10`);
    console.log(`- Completeness: ${result.metrics.completeness.toFixed(1)}/10`);
    console.log(`- Effectiveness: ${result.metrics.effectiveness.toFixed(1)}/10`);
    console.log(`- Emotional Intelligence: ${result.metrics.emotionalIntelligence.toFixed(1)}/10`);
    console.log(`- First-Try Success: ${result.metrics.firstTrySuccess.toFixed(1)}%`);
    console.log(`- Trust Score: ${result.metrics.trustScore.toFixed(1)}/5.0`);
    
    if (result.issues.length > 0) {
      console.log('\n⚠️ Issues Identified:');
      result.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (result.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      result.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    console.log('\n✨ Framework Status: Active and operational');
    console.log('🎯 Ready for real-time prompt quality validation');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run main function if this script is executed directly
// Check if script is being run directly vs imported
const isMainModule = process.argv[1]?.includes('validate-prompt-quality');
if (isMainModule) {
  main().catch(console.error);
}

export { PromptQualityValidator };
export type { ValidationResult, QualityMetrics }; 